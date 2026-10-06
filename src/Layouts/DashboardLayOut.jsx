import { Link, Navigate, Outlet, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FiCreditCard,
  FiGrid,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiSend,
  FiNavigation,
  FiLock,
  FiHome,
  FiBell,
  FiMenu,
} from "react-icons/fi";
import { MdOutlineDeliveryDining, MdOutlinePedalBike } from "react-icons/md";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "../Component/Loading/Loading";
import { Avatar } from "../Component/ProfileMenu/ProfileMenu";
import logo from "../assets/logo.png";

const menuByRole = {
  user: [
    { to: "/dashboard", label: "Dashboard", icon: FiGrid, end: true },
    { to: "/dashboard/my-parcels", label: "My Parcels", icon: FiPackage },
    { to: "/send-parcel", label: "Send Parcel", icon: FiSend },
    { to: "/dashboard/track", label: "Track Parcel", icon: FiMapPin },
    { to: "/dashboard/payment-history", label: "Payment History", icon: FiCreditCard },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: FiGrid, end: true },
    { to: "/dashboard/delivery-management", label: "Deliveries", icon: FiPackage },
    { to: "/dashboard/manage-riders", label: "Riders", icon: MdOutlinePedalBike },
    { to: "/dashboard/manage-users", label: "Users", icon: FiUsers },
    { to: "/dashboard/payment-history", label: "Invoices", icon: FiCreditCard },
  ],
  rider: [
    { to: "/dashboard", label: "Dashboard", icon: FiGrid, end: true },
    { to: "/dashboard/pending-pickups", label: "Parcels to Pickup", icon: FiNavigation },
    { to: "/dashboard/pending-deliveries", label: "Parcels to Deliver", icon: MdOutlineDeliveryDining },
    { to: "/dashboard/completed-deliveries", label: "Completed", icon: FiCheckCircle },
  ],
};

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
    isActive
      ? "bg-[#caeb66] font-semibold text-[#03373d]"
      : "text-gray-600 hover:bg-gray-100"
  }`;

const closeDrawer = () => {
  const toggle = document.getElementById("dashboard-drawer");
  if (toggle) toggle.checked = false;
};

const DashboardLayOut = () => {
  const { user, logOut } = useAuth();
  const { role, otpVerified, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const isAdmin = role === "admin" && otpVerified;

  // Bell: things that need the admin's attention
  const { data: overview } = useQuery({
    queryKey: ["admin-overview", "week"],
    enabled: isAdmin,
    queryFn: async () => (await axiosSecure.get("/admin/overview?range=week")).data,
  });
  const alertCount = isAdmin
    ? (overview?.alertCounts?.pendingRiders || 0) + (overview?.alertCounts?.delayed || 0)
    : 0;

  if (roleLoading) return <Loading />;

  // The admin must pass the authenticator check before seeing the dashboard
  if (role === "admin" && !otpVerified) {
    return <Navigate to="/admin-verify" replace />;
  }

  const menu = menuByRole[role] || menuByRole.user;

  const handleLogOut = () => {
    logOut()
      .then(() => navigate("/signin"))
      .catch((error) => console.error("Error during logout:", error));
  };

  return (
    <div className="drawer bg-[#f1f2f4] text-[#000000] lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white px-4 py-3 shadow-sm">
          <label
            htmlFor="dashboard-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost btn-sm lg:hidden"
          >
            <FiMenu className="size-5" />
          </label>
          <span className="hidden text-sm text-gray-500 lg:block">
            Welcome back, {user?.displayName?.split(" ")[0] || "there"} 👋
          </span>

          <div className="flex items-center gap-3">
            <Link
              to={
                role === "admin"
                  ? "/dashboard/manage-riders"
                  : role === "rider"
                    ? "/dashboard/pending-pickups"
                    : "/dashboard/track"
              }
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
            >
              <FiBell className="size-4" />
              {alertCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {alertCount > 99 ? "99+" : alertCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-gray-50"
            >
              <Avatar user={user} />
              <span className="hidden leading-tight sm:block">
                <span className="block max-w-36 truncate text-sm font-semibold">
                  {user?.displayName || "Unnamed user"}
                </span>
                <span className="block text-xs capitalize text-gray-500">{role}</span>
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-20">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay" />
        <aside className="flex min-h-full w-64 flex-col bg-white px-4 py-5">
          <Link to="/" className="mb-6 flex items-end gap-1 px-2">
            <img src={logo} alt="ZapShift" className="h-8" />
            <span className="-ms-3 text-2xl font-extrabold text-[#03373d]">ZapShift</span>
          </Link>

          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu
          </p>
          <nav className="space-y-1">
            {menu.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={itemClass} onClick={closeDrawer}>
                <Icon className="size-4" />
                {label}
              </NavLink>
            ))}
            <NavLink to="/coverage" className={itemClass} onClick={closeDrawer}>
              <FiMapPin className="size-4" />
              Coverage Area
            </NavLink>
          </nav>

          <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            General
          </p>
          <nav className="space-y-1">
            <NavLink to="/dashboard/profile" className={itemClass} onClick={closeDrawer}>
              <FiUser className="size-4" />
              Profile & Settings
            </NavLink>
            <Link
              to="/dashboard/profile#security"
              className={itemClass({ isActive: false })}
              onClick={closeDrawer}
            >
              <FiLock className="size-4" />
              Change Password
            </Link>
            <Link to="/" className={itemClass({ isActive: false })}>
              <FiHome className="size-4" />
              Back to Home
            </Link>
            <button onClick={handleLogOut} className={`${itemClass({ isActive: false })} w-full`}>
              <FiLogOut className="size-4" />
              Logout
            </button>
          </nav>

          {/* Signed in user */}
          <div className="mt-auto flex items-center gap-3 rounded-xl bg-[#f6f7f8] p-3">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.displayName || "Unnamed user"}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayOut;
