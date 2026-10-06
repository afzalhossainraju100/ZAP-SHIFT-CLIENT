import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import useAuth from "../../../Hooks/useAuth";

const ProfileCard = ({ role, children }) => {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="h-16 w-16 rounded-full object-cover ring-4 ring-[#caeb66]"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#caeb66] text-2xl font-bold uppercase">
            {(user?.displayName || user?.email || "?").charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold">
            {user?.displayName || "Unnamed user"}
          </h2>
          <p className="truncate text-sm text-gray-500">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-[#03373d] px-2 py-0.5 text-xs font-semibold uppercase text-white">
            {role}
          </span>
        </div>
      </div>
      {children}
      <Link
        to="/dashboard/profile"
        className="btn btn-sm mt-5 border-[#caeb66] bg-[#caeb66] text-black"
      >
        <FiEdit /> Edit Profile
      </Link>
    </div>
  );
};

export default ProfileCard;
