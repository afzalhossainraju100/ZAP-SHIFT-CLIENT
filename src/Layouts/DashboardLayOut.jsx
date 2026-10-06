import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { CiDeliveryTruck } from "react-icons/ci";
import {
  FiCreditCard,
  FiHome,
  FiGrid,
  FiMapPin,
  FiSettings,
  FiLogOut,
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiSend,
  FiNavigation,
} from "react-icons/fi";
import { MdOutlineDeliveryDining, MdOutlinePedalBike } from "react-icons/md";
import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import logo from "../assets/logo.png";

const linksByRole = {
  user: [
    { to: "/dashboard/my-parcels", label: "My Parcels", icon: CiDeliveryTruck },
    { to: "/send-parcel", label: "Send Parcel", icon: FiSend },
    { to: "/dashboard/track", label: "Track Parcel", icon: FiMapPin },
    { to: "/dashboard/payment-history", label: "Payment History", icon: FiCreditCard },
  ],
  admin: [
    { to: "/dashboard/delivery-management", label: "Delivery Management", icon: FiPackage },
    { to: "/dashboard/manage-riders", label: "Manage Riders", icon: MdOutlinePedalBike },
    { to: "/dashboard/manage-users", label: "Manage Users", icon: FiUsers },
    { to: "/dashboard/payment-history", label: "All Payments", icon: FiCreditCard },
  ],
  rider: [
    { to: "/dashboard/pending-pickups", label: "Parcels to Pickup", icon: FiNavigation },
    { to: "/dashboard/pending-deliveries", label: "Parcels to Deliver", icon: MdOutlineDeliveryDining },
    { to: "/dashboard/completed-deliveries", label: "Completed Deliveries", icon: FiCheckCircle },
  ],
};

const navClass = ({ isActive }) =>
  `is-drawer-close:tooltip is-drawer-close:tooltip-right ${
    isActive ? "bg-[#caeb66] font-semibold" : ""
  }`;

const DashboardLayOut = () => {
  const { user, logOut } = useAuth();
  const { role, roleLoading } = useRole();
  const navigate = useNavigate();
  const roleLinks = linksByRole[role] || linksByRole.user;

  const handleLogOut = () => {
    logOut()
      .then(() => navigate("/signin"))
      .catch((error) => console.error("Error during logout:", error));
  };

  return (
    <div className="drawer bg-gray-100 text-[#000000] lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content min-h-screen">
        {/* Navbar */}
        <nav className="navbar w-full bg-[#ffffff] shadow-lg text-[#000000] fixed top-0 z-10 gap-3">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 p-1 rounded-lg bg-[#caeb66]">
            Zap Shift Dashboard
          </div>
          {!roleLoading && (
            <span className="badge badge-outline capitalize">{role}</span>
          )}
        </nav>
        {/* Page content here */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible z-20">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-[#ffffff] text-[#000000] is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Logo */}
          <Link to="/" className="flex items-end gap-1 px-4 pt-4 is-drawer-close:hidden">
            <img src={logo} alt="ZapShift" className="h-8" />
            <span className="-ms-3 text-xl font-bold">ZapShift</span>
          </Link>

          {/* User info */}
          <div className="flex w-full items-center gap-3 border-b border-gray-100 px-3 py-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user?.displayName || "User"}
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-[#caeb66]"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#caeb66] font-bold uppercase">
                {(user?.displayName || user?.email || "?").charAt(0)}
              </div>
            )}
            <div className="min-w-0 is-drawer-close:hidden">
              <p className="truncate text-sm font-semibold">
                {user?.displayName || "Unnamed user"}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-[#03373d] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                {roleLoading ? "..." : role}
              </span>
            </div>
          </div>

          <ul className="menu w-full grow">
            <li>
              <NavLink to="/dashboard" end className={navClass} data-tip="Dashboard Home">
                <FiGrid className="size-4" />
                <span className="is-drawer-close:hidden">Dashboard Home</span>
              </NavLink>
            </li>

            {/* Role based links */}
            {!roleLoading &&
              roleLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink to={to} className={navClass} data-tip={label}>
                    <Icon className="size-4" />
                    <span className="is-drawer-close:hidden">{label}</span>
                  </NavLink>
                </li>
              ))}

            <li>
              <NavLink to="/dashboard/settings" className={navClass} data-tip="Settings">
                <FiSettings className="size-4" />
                <span className="is-drawer-close:hidden">Settings</span>
              </NavLink>
            </li>

            {/* Public pages */}
            <li className="menu-title is-drawer-close:hidden mt-4">Public</li>
            <li>
              <Link to="/" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                <FiHome className="size-4" />
                <span className="is-drawer-close:hidden">Homepage</span>
              </Link>
            </li>
            <li>
              <Link to="/coverage" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Coverage">
                <FiMapPin className="size-4" />
                <span className="is-drawer-close:hidden">Coverage</span>
              </Link>
            </li>
          </ul>

          <div className="w-full border-t border-gray-100 p-2">
            <button
              onClick={handleLogOut}
              className="btn btn-ghost w-full justify-start is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip="Logout"
            >
              <FiLogOut className="size-4" />
              <span className="is-drawer-close:hidden">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayOut;
