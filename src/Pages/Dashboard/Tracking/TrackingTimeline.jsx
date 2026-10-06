import { formatDate } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";

const TrackingTimeline = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No tracking updates yet. Updates start once the parcel is paid.
      </p>
    );
  }

  return (
    <ol className="relative ms-3 border-s-2 border-[#caeb66]">
      {history.map((item) => (
        <li key={item._id} className="mb-6 ms-6">
          <span className="absolute -start-2.25 mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#03373d]" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            <time className="text-xs text-gray-500">{formatDate(item.createdAt)}</time>
          </div>
          <p className="mt-1 text-sm">{item.message}</p>
        </li>
      ))}
    </ol>
  );
};

export default TrackingTimeline;
