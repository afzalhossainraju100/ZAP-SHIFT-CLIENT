import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { formatDate, getErrorMessage } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";
import TrackingTimeline from "./TrackingTimeline";

const TrackParcel = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();
  const trackingId = searchParams.get("id") || "";
  const [input, setInput] = useState(trackingId);

  const {
    data: result,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["track", trackingId],
    enabled: !!trackingId,
    retry: false,
    queryFn: async () => (await axiosSecure.get(`/trackings/${trackingId}`)).data,
  });

  // Notification feed: latest updates for all of the user's parcels
  const { data: updates = [] } = useQuery({
    queryKey: ["my-tracking-updates", user?.email],
    queryFn: async () => (await axiosSecure.get("/trackings")).data.data,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = input.trim().toUpperCase();
    if (value) setSearchParams({ id: value });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Track a Parcel</h1>
        <form onSubmit={handleSubmit} className="join mt-4 w-full max-w-xl">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter tracking ID, e.g. PRCL-20261006-AB12CD34"
            className="input join-item w-full bg-white"
          />
          <button className="btn join-item border-[#caeb66] bg-[#caeb66] text-black">
            Track
          </button>
        </form>

        {isFetching && <p className="mt-4 text-sm text-gray-500">Searching...</p>}
        {error && (
          <p className="mt-4 text-sm text-red-600">{getErrorMessage(error)}</p>
        )}
        {result && !isFetching && (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold">{result.parcel.parcelName}</h2>
              <StatusBadge status={result.parcel.deliveryStatus} />
              <Link to={`/dashboard/parcel/${result.parcel._id}`} className="btn btn-xs">
                View details
              </Link>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              {result.parcel.senderDistrict} → {result.parcel.receiverDistrict}
            </p>
            <TrackingTimeline history={result.history} />
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Latest updates on my parcels</h2>
        {updates.length === 0 ? (
          <p className="text-sm text-gray-500">No updates yet.</p>
        ) : (
          <ul className="space-y-3">
            {updates.map((item) => (
              <li
                key={item._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.parcelName}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                  <p className="text-xs text-gray-400">
                    {item.trackingId} · {formatDate(item.createdAt)}
                  </p>
                </div>
                <Link to={`/dashboard/parcel/${item.parcelId}`} className="btn btn-sm">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrackParcel;
