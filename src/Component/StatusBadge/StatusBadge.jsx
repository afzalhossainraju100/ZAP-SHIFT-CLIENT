import { PARCEL_STATUSES, statusLabel } from "../../utils/parcelStatus";

const StatusBadge = ({ status }) => {
  const color =
    PARCEL_STATUSES.find((item) => item.key === status)?.color || "#9ca3af";

  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-[#03373d]"
      style={{ backgroundColor: `${color}55`, border: `1px solid ${color}` }}
    >
      {statusLabel(status)}
    </span>
  );
};

export default StatusBadge;
