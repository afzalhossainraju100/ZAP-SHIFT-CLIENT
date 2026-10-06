import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { formatDate } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";
import ProfileCard from "./ProfileCard";
import StatusPieChart from "./StatusPieChart";

const RiderHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["rider-stats"],
    queryFn: async () => (await axiosSecure.get("/stats/rider")).data,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["rider-current-tasks"],
    queryFn: async () => {
      const [pickups, deliveries] = await Promise.all([
        axiosSecure.get("/rider/parcels?type=pickup"),
        axiosSecure.get("/rider/parcels?type=delivery"),
      ]);
      return [...pickups.data.data, ...deliveries.data.data];
    },
  });

  if (isLoading || !stats) return <Loading />;

  const chartData = [
    { name: "To Pickup", value: stats.toPickup, color: "#facc15" },
    { name: "To Deliver", value: stats.toDeliver, color: "#fb923c" },
    { name: "Delivered", value: stats.delivered, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Rider Overview</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-[#03373d] p-5 text-white shadow-sm">
          <p className="text-sm text-white/70">Earnings</p>
          <p className="mt-2 text-3xl font-bold">৳ {stats.earnings}</p>
        </div>
        {chartData.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            style={{ borderTop: `5px solid ${item.color}` }}
          >
            <p className="text-sm text-gray-500">{item.name}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ProfileCard role="rider" />
        <StatusPieChart title="My tasks" data={chartData} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold">Current tasks</h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">No open tasks. Enjoy the break!</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {tasks.map((parcel) => (
              <li key={parcel._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-semibold">{parcel.parcelName}</p>
                  <p className="text-xs text-gray-500">
                    {parcel.trackingId} · {formatDate(parcel.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={parcel.deliveryStatus} />
                  <Link
                    to={
                      parcel.deliveryStatus === "ready-to-pickup"
                        ? "/dashboard/pending-pickups"
                        : "/dashboard/pending-deliveries"
                    }
                    className="btn btn-xs"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RiderHome;
