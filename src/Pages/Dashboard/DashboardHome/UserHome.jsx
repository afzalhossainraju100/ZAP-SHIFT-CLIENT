import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Component/Loading/Loading";
import { PARCEL_STATUSES } from "../../../utils/parcelStatus";
import ProfileCard from "./ProfileCard";
import StatusPieChart from "./StatusPieChart";

const UserHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: byStatus = {}, isLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/stats/user");
      return res.data?.byStatus || {};
    },
  });

  if (isLoading) return <Loading />;

  const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
  const chartData = PARCEL_STATUSES.map((status) => ({
    name: status.label,
    value: byStatus[status.key] || 0,
    color: status.color,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-sm text-gray-600">
            You have booked {total} parcel{total === 1 ? "" : "s"} so far.
          </p>
        </div>
        <Link to="/send-parcel" className="btn border-[#caeb66] bg-[#caeb66] text-black">
          Send a Parcel
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PARCEL_STATUSES.map((status) => (
          <div
            key={status.key}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ borderLeft: `6px solid ${status.color}` }}
          >
            <p className="text-sm text-gray-500">{status.label}</p>
            <p className="mt-1 text-3xl font-bold">{byStatus[status.key] || 0}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ProfileCard role="user" />
        <StatusPieChart title="My parcels by status" data={chartData} />
      </div>
    </div>
  );
};

export default UserHome;
