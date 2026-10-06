import { useState } from "react";
import { Link } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiEdit,
  FiFilter,
  FiMoreVertical,
  FiPlus,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlinePedalBike } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { PARCEL_STATUSES, statusLabel, timeAgo } from "../../../utils/parcelStatus";

const RANGE_OPTIONS = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

// Status pill colours in the style of the design
const pillStyles = {
  delivered: "bg-green-100 text-green-700",
  "in-transit": "bg-blue-50 text-blue-600",
  "reached-service-center": "bg-blue-50 text-blue-600",
  shipped: "bg-blue-50 text-blue-600",
  "ready-for-delivery": "bg-purple-50 text-purple-600",
  paid: "bg-orange-50 text-orange-600",
  "ready-to-pickup": "bg-orange-50 text-orange-600",
  unpaid: "bg-red-50 text-red-600",
};

const taka = (value) => `৳${Number(value || 0).toLocaleString()}`;

const shortTaka = (value) =>
  value >= 1000 ? `৳${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : `৳${value}`;

const RangeSelect = ({ value, onChange, includeAll = false }) => (
  <label className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm">
    <FiCalendar className="text-gray-500" />
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="cursor-pointer bg-transparent pr-1 outline-none"
    >
      {includeAll && <option value="all">All Time</option>}
      {RANGE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const IconButton = ({ to, label, children }) => (
  <Link
    to={to}
    aria-label={label}
    title={label}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
  >
    {children}
  </Link>
);

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-md">
      <p className="text-gray-500">{point.fullLabel}</p>
      <p className="mt-1 flex items-center gap-1.5 font-semibold">
        <span className="h-2 w-2 rounded-full bg-[#9bc93c]" />
        {taka(point.revenue)}
      </p>
      <p className="text-gray-500">
        {point.payments} payment{point.payments === 1 ? "" : "s"} · {point.parcels} new parcel
        {point.parcels === 1 ? "" : "s"}
      </p>
    </div>
  );
};

// 1 2 3 ... 8 9 10
const pageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, 3, total - 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? ["...", page] : [page],
  );
};

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const [chartRange, setChartRange] = useState("week");
  const [tableRange, setTableRange] = useState("all");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: overview, isLoading } = useQuery({
    queryKey: ["admin-overview", chartRange],
    placeholderData: keepPreviousData,
    queryFn: async () => (await axiosSecure.get(`/admin/overview?range=${chartRange}`)).data,
  });

  const { data: shipments, isFetching: shipmentsLoading } = useQuery({
    queryKey: ["admin-shipments", tableRange, status, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const params = new URLSearchParams({ range: tableRange, page, limit: 6 });
      if (status) params.set("status", status);
      return (await axiosSecure.get(`/admin/shipments?${params}`)).data;
    },
  });

  if (isLoading || !overview) return <Loading />;

  const { cards, series, totals, lateInvoices, alerts, alertCounts } = overview;
  const statCards = [
    { label: "To Pay", value: cards.toPay },
    { label: "Ready Pick Up", value: cards.readyPickup },
    { label: "In Transit", value: cards.inTransit },
    { label: "Ready to Deliver", value: cards.readyToDeliver },
    { label: "Delivered", value: cards.delivered },
  ];
  const rows = shipments?.data || [];
  const totalPages = shipments?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#03373d]">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">
            You can access all your data and information from anywhere.
          </p>
        </div>
        <Link
          to="/send-parcel"
          className="btn rounded-xl border-[#caeb66] bg-[#caeb66] text-[#03373d] hover:bg-[#b8d955]"
        >
          <FiPlus /> Add Parcel
        </Link>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div key={card.label} className="flex items-center gap-4 rounded-2xl bg-white p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1f2f4]">
              <CiDeliveryTruck className="size-6 text-[#03373d]" />
            </span>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-[#03373d]">{card.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall statistics */}
      <section className="rounded-2xl bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#03373d]">Overall Statistics</h2>
            <p className="text-xs text-gray-500">
              Revenue {taka(totals.revenue)} · {totals.payments} payments ·{" "}
              {totals.parcels} new parcels · {totals.customers} customers ·{" "}
              {totals.riders} riders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RangeSelect value={chartRange} onChange={setChartRange} />
            <IconButton to="/dashboard/payment-history" label="All payments">
              <FiMoreVertical />
            </IconButton>
          </div>
        </div>
        <div className="h-72 rounded-xl border border-gray-100 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#caeb66" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#caeb66" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={shortTaka}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "#9bc93c", strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#9bc93c"
                strokeWidth={2}
                fill="url(#revenueFill)"
                activeDot={{ r: 5, fill: "#9bc93c" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Shipping reports */}
      <section className="rounded-2xl bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#03373d]">Shipping Reports</h2>
          <div className="flex flex-wrap items-center gap-2">
            <RangeSelect
              value={tableRange}
              onChange={(value) => {
                setTableRange(value);
                setPage(1);
              }}
              includeAll
            />
            <label className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm">
              <FiFilter className="text-gray-500" />
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent outline-none"
              >
                <option value="">All status</option>
                {PARCEL_STATUSES.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <IconButton to="/dashboard/delivery-management" label="All deliveries">
              <FiMoreVertical />
            </IconButton>
          </div>
        </div>

        <div className={`overflow-x-auto rounded-xl border border-gray-100 ${shipmentsLoading ? "opacity-60" : ""}`}>
          <table className="table">
            <thead className="bg-[#f6f7f8] text-gray-600">
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Weight</th>
                <th>Shipper</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">
                    No shipments for this filter.
                  </td>
                </tr>
              )}
              {rows.map((parcel) => (
                <tr key={parcel._id} className="even:bg-[#fafafa]">
                  <td className="whitespace-nowrap text-xs font-medium">
                    {parcel.trackingId || `#${parcel._id.slice(-8).toUpperCase()}`}
                  </td>
                  <td>
                    <div className="font-medium">{parcel.senderName}</div>
                    <div className="text-xs text-gray-400">
                      {parcel.senderDistrict} → {parcel.receiverDistrict}
                    </div>
                  </td>
                  <td className="whitespace-nowrap text-sm">
                    {new Date(parcel.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap text-sm">
                    {parcel.parcelType === "document" ? "Document" : `${parcel.parcelWeight || 0} kg`}
                  </td>
                  <td className="text-sm">
                    {parcel.deliveryRider?.name || parcel.pickupRider?.name || (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-sm">{taka(parcel.cost)}</td>
                  <td>
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                        pillStyles[parcel.deliveryStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusLabel(parcel.deliveryStatus)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {parcel.deliveryStatus === "unpaid" ? (
                        <span className="flex items-center gap-1 px-2 text-xs text-gray-400" title="Waiting for payment">
                          <FiEdit /> Edit
                        </span>
                      ) : (
                        <Link
                          to={`/dashboard/manage-parcel/${parcel._id}`}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-gray-100"
                        >
                          <FiEdit /> Edit
                        </Link>
                      )}
                      <Link
                        to={`/dashboard/parcel/${parcel._id}`}
                        aria-label="View details"
                        className="rounded-md p-1 hover:bg-gray-100"
                      >
                        <FiMoreVertical />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1}
            className="btn btn-sm rounded-lg border-gray-200 bg-white"
          >
            <FiArrowLeft /> Previous
          </button>
          <div className="flex flex-wrap items-center gap-1">
            {pageNumbers(page, totalPages).map((item, index) =>
              item === "..." ? (
                <span key={`gap-${index}`} className="px-2 text-sm text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  className={`h-8 w-8 rounded-full text-sm ${
                    item === page ? "bg-[#caeb66] font-semibold" : "hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <button
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={page >= totalPages}
            className="btn btn-sm rounded-lg border-gray-200 bg-white"
          >
            Next <FiArrowRight />
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Late invoices */}
        <section className="rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#03373d]">Late Invoices</h2>
            <Link
              to="/dashboard/delivery-management"
              className="btn btn-sm rounded-full border-[#caeb66] bg-[#caeb66] text-[#03373d]"
            >
              View All Invoices
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="table">
              <thead className="bg-[#f6f7f8] text-gray-600">
                <tr>
                  <th>No</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lateInvoices.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      Every parcel is paid. 🎉
                    </td>
                  </tr>
                )}
                {lateInvoices.map((invoice) => (
                  <tr key={invoice._id} className="even:bg-[#fafafa]">
                    <td>
                      <div className="text-xs font-medium">
                        #INV-{invoice._id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400">{invoice.senderName}</div>
                    </td>
                    <td className="text-sm">{taka(invoice.cost)}</td>
                    <td className="whitespace-nowrap text-sm">{timeAgo(invoice.createdAt)}</td>
                    <td>
                      <Link
                        to={`/dashboard/parcel/${invoice._id}`}
                        aria-label="View parcel"
                        className="inline-flex rounded-md p-1 hover:bg-gray-100"
                      >
                        <FiMoreVertical />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Shipment alerts */}
        <section className="rounded-2xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#03373d]">Shipment Alerts</h2>
            <Link
              to="/dashboard/manage-riders"
              className="btn btn-sm rounded-full border-[#caeb66] bg-[#caeb66] text-[#03373d]"
            >
              View All
            </Link>
          </div>

          <div className="mb-4 grid grid-cols-3 divide-x divide-gray-200 rounded-xl bg-[#f1f2f4] py-4 text-center">
            <div>
              <p className="text-2xl font-bold">{alertCounts.pendingRiders}</p>
              <p className="text-xs text-gray-500">Pending Riders</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{alertCounts.delayed}</p>
              <p className="text-xs text-gray-500">Delayed (48h+)</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{alertCounts.awaitingPickupRider}</p>
              <p className="text-xs text-gray-500">Need a Rider</p>
            </div>
          </div>

          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100">
            {alerts.length === 0 && (
              <li className="p-6 text-center text-sm text-gray-500">No alerts right now.</li>
            )}
            {alerts.map((alert, index) => (
              <li key={`${alert.link}-${index}`} className="flex items-center gap-3 p-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    alert.type === "rider" ? "bg-teal-50 text-teal-600" : "bg-red-50 text-red-500"
                  }`}
                >
                  {alert.type === "rider" ? <MdOutlinePedalBike /> : <FiAlertCircle />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <p className="truncate text-xs text-gray-500">
                    {alert.subtitle}
                    {alert.status ? ` · ${statusLabel(alert.status)}` : ""} · {timeAgo(alert.at)}
                  </p>
                </div>
                <Link to={alert.link} aria-label="Open" className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100">
                  <FiExternalLink />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminHome;
