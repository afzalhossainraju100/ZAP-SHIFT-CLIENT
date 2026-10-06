import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiGrid,
  FiUser,
  FiPackage,
  FiTruck,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlinePedalBike } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import useRole from "../../Hooks/useRole";

const roleShortcut = {
  user: { to: "/dashboard/my-parcels", label: "My Parcels", icon: FiPackage },
  rider: { to: "/dashboard/pending-pickups", label: "My Tasks", icon: FiTruck },
  admin: { to: "/dashboard/delivery-management", label: "Delivery Management", icon: FiPackage },
};

export const Avatar = ({ user, size = "h-9 w-9", text = "text-sm" }) =>
  user?.photoURL ? (
    <img
      src={user.photoURL}
      alt={user.displayName || "Profile"}
      className={`${size} shrink-0 rounded-full object-cover ring-2 ring-[#caeb66]`}
    />
  ) : (
    <span
      className={`${size} ${text} flex shrink-0 items-center justify-center rounded-full bg-[#caeb66] font-bold uppercase text-[#03373d]`}
    >
      {(user?.displayName || user?.email || "?").charAt(0)}
    </span>
  );

// Avatar button in the navbar that opens an account menu
const ProfileMenu = ({ onLogOut }) => {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (event) => event.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const shortcut = roleShortcut[role] || roleShortcut.user;
  const items = [
    { to: "/dashboard", label: "Dashboard", icon: FiGrid },
    { to: "/dashboard/profile", label: "My Profile", icon: FiUser },
    shortcut,
  ];
  if (role === "user") {
    items.push({ to: "/rider", label: "Be a Rider", icon: MdOutlinePedalBike });
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition hover:border-[#caeb66] hover:shadow-sm"
      >
        <Avatar user={user} />
        <span className="max-w-28 truncate text-sm font-medium">
          {user?.displayName?.split(" ")[0] || "Account"}
        </span>
        <FiChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white text-black shadow-xl"
        >
          <div className="bg-linear-to-r from-[#03373d] to-[#33929d] p-4 text-white">
            <div className="flex items-center gap-3">
              <Avatar user={user} size="h-12 w-12" text="text-lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {user?.displayName || "Unnamed user"}
                </p>
                <p className="truncate text-xs text-white/70">{user?.email}</p>
                <span className="mt-1 inline-block rounded-full bg-[#caeb66] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#03373d]">
                  {roleLoading ? "..." : role}
                </span>
              </div>
            </div>
          </div>

          <ul className="p-2">
            {items.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[#caeb66]/30"
                >
                  <Icon className="size-4 text-[#03373d]" />
                  {label}
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-gray-100 pt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogOut();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <FiLogOut className="size-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
