import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { PARCEL_STATUSES, formatDate } from "../../../utils/parcelStatus";
import StatusPieChart from "./StatusPieChart";

const StatCard = ({ label, value, accent = "#caeb66" }) => (
  <div
    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    style={{ borderTop: `5px solid ${accent}` }}
  >
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await axiosSecure.get("/stats/admin")).data,
  });

  const { data: serviceCenterCount = 0 } = useQuery({
    queryKey: ["service-centers-count"],
    queryFn: async () => (await (await fetch("/serviceCenter.json")).json()).length,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["admin-recent-payments"],
    queryFn: async () => (await axiosSecure.get("/payments")).data?.data || [],
  });

  if (isLoading || !stats) return <Loading />;

  const byStatus = stats.byStatus || {};
  const chartData = PARCEL_STATUSES.map((status) => ({
    name: status.label,
    value: byStatus[status.key] || 0,
    color: status.color,
  }));

  return (
    <div className="mt-20 space-y-6">
      <h1 className="text-3xl font-bold">Admin Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Customers" value={stats.byRole?.user || 0} />
        <StatCard label="Riders" value={stats.byRole?.rider || 0} accent="#33929d" />
        <StatCard label="Pending Riders" value={stats.pendingRiders || 0} accent="#fb923c" />
        <StatCard label="Parcels Delivered" value={byStatus.delivered || 0} accent="#22c55e" />
        <StatCard label="Service Centers" value={serviceCenterCount} accent="#a78bfa" />
        <StatCard
          label="Earning"
          value={`$${Number(stats.totalEarning || 0).toFixed(2)}`}
          accent="#03373d"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">Parcels by pickup district</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byDistrict || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="district" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#33929d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <StatusPieChart title="All parcels by status" data={chartData} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold">Recent payments</h3>
        {payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {payments.slice(0, 8).map((payment) => (
              <li key={payment._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-semibold">
                    {payment.customerEmail} paid ${Number(payment.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {payment.parcelName} · {payment.trackingId}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{formatDate(payment.paidAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
