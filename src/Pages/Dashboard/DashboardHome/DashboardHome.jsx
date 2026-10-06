import useRole from "../../../Hooks/useRole";
import Loading from "../../../Component/Loading/Loading";
import UserHome from "./UserHome";
import AdminHome from "./AdminHome";
import RiderHome from "./RiderHome";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) return <Loading />;
  if (role === "admin") return <AdminHome />;
  if (role === "rider") return <RiderHome />;
  return <UserHome />;
};

export default DashboardHome;
