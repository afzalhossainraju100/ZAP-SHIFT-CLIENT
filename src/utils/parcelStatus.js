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
