// Parcel delivery statuses in workflow order (requirements420.md)
export const PARCEL_STATUSES = [
  { key: "unpaid", label: "Unpaid", color: "#9ca3af" },
  { key: "paid", label: "Paid", color: "#caeb66" },
  { key: "ready-to-pickup", label: "Ready to Pickup", color: "#facc15" },
  { key: "in-transit", label: "In Transit", color: "#60a5fa" },
  { key: "reached-service-center", label: "Reached Service Center", color: "#a78bfa" },
  { key: "shipped", label: "Shipped", color: "#33929d" },
  { key: "ready-for-delivery", label: "Ready for Delivery", color: "#fb923c" },
  { key: "delivered", label: "Delivered", color: "#22c55e" },
];

export const statusLabel = (key) =>
  PARCEL_STATUSES.find((status) => status.key === key)?.label || key || "Unpaid";

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || error?.message || fallback;

// "5 min ago", "3h ago", "10 days ago"
export const timeAgo = (value) => {
  if (!value) return "—";
  const seconds = Math.max(0, (Date.now() - new Date(value).getTime()) / 1000);
  if (Number.isNaN(seconds)) return "—";
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};
