import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { PARCEL_STATUSES, formatDate } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";

const DeliveryManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data: byStatus = {} } = useQuery({
    queryKey: ["admin-stats-status"],
    queryFn: async () => (await axiosSecure.get("/stats/admin")).data.byStatus,
  });

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["admin-parcels", search, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("deliveryStatus", status);
      return (await axiosSecure.get(`/parcels?${params.toString()}`)).data;
    },
  });

  const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);

  return (
    <div className="mt-20 space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setStatus("")}
          className={`rounded-xl border px-4 py-3 text-left ${status === "" ? "border-[#03373d] bg-[#03373d] text-white" : "border-gray-200 bg-white"}`}
        >
          <p className="text-xs opacity-70">All parcels</p>
          <p className="text-xl font-bold">{total}</p>
        </button>
        {PARCEL_STATUSES.map((item) => (
          <button
            key={item.key}
            onClick={() => setStatus(item.key)}
            className={`rounded-xl border px-4 py-3 text-left ${status === item.key ? "border-[#03373d] bg-[#03373d] text-white" : "border-gray-200 bg-white"}`}
            style={{ borderLeft: `5px solid ${item.color}` }}
          >
            <p className="text-xs opacity-70">{item.label}</p>
            <p className="text-xl font-bold">{byStatus[item.key] || 0}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Delivery Management ({parcels.length})</h1>
          <form
            className="join"
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search tracking ID"
              className="input join-item bg-white"
            />
            <button className="btn join-item border-[#caeb66] bg-[#caeb66] text-black">
              Search
            </button>
          </form>
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-black">
                <tr>
                  <th></th>
                  <th>Parcel</th>
                  <th>Origin → Destination</th>
                  <th>Tracking ID</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {parcels.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500">
                      No parcels found.
                    </td>
                  </tr>
                )}
                {parcels.map((parcel, index) => (
                  <tr key={parcel._id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="font-medium">{parcel.parcelName}</div>
                      <div className="text-xs text-gray-500">{parcel.senderEmail}</div>
                    </td>
                    <td>
                      {parcel.senderDistrict} → {parcel.receiverDistrict}
                    </td>
                    <td className="text-xs">{parcel.trackingId || "—"}</td>
                    <td>
                      <StatusBadge status={parcel.deliveryStatus} />
                    </td>
                    <td className="text-xs">{formatDate(parcel.createdAt)}</td>
                    <td className="space-x-2 whitespace-nowrap">
                      <Link to={`/dashboard/parcel/${parcel._id}`} className="btn btn-sm">
                        View
                      </Link>
                      {parcel.deliveryStatus === "unpaid" ? (
                        <button className="btn btn-sm" disabled>
                          Manage
                        </button>
                      ) : (
                        <Link
                          to={`/dashboard/manage-parcel/${parcel._id}`}
                          className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                        >
                          Manage
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;
