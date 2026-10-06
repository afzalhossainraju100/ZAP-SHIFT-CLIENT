import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { Avatar } from "../../../Component/ProfileMenu/ProfileMenu";
import { formatDate, timeAgo } from "../../../utils/parcelStatus";

const roleBadge = {
  admin: "bg-[#03373d] text-white",
  rider: "bg-amber-100 text-amber-800",
  user: "bg-lime-100 text-lime-800",
};

const riderBadge = {
  pending: "text-amber-600",
  approved: "text-green-600",
  rejected: "text-red-600",
};

// The admin role is fixed in the system, so this page only lists accounts.
// Riders get their role from Manage Riders (approve / reject).
const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", search, role],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      return (await axiosSecure.get(`/users?${params.toString()}`)).data.data;
    },
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users ({users.length})</h1>
          <p className="text-sm text-gray-500">
            Every registered customer, rider and the admin.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form
            className="join"
            onSubmit={(event) => {
              event.preventDefault();
              setSearch(searchInput.trim());
            }}
          >
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, email or phone"
              className="input join-item bg-white"
            />
            <button className="btn join-item border-[#caeb66] bg-[#caeb66] text-black">
              Search
            </button>
          </form>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="select bg-white"
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="rider">Rider</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-black">
              <tr>
                <th></th>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Rider application</th>
                <th>Sign up</th>
                <th>Joined</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user, index) => (
                <tr key={user._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar user={{ photoURL: user.photoURL, displayName: user.name, email: user.email }} />
                      <div>
                        <div className="font-medium">{user.name || "—"}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{user.phone || "—"}</td>
                  <td>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleBadge[user.role] || ""}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={`text-sm capitalize ${riderBadge[user.riderStatus] || "text-gray-400"}`}>
                    {user.riderStatus && user.riderStatus !== "none" ? user.riderStatus : "—"}
                  </td>
                  <td className="text-sm capitalize">{user.signUpMethod || "—"}</td>
                  <td className="text-xs">{formatDate(user.createdAt)}</td>
                  <td className="text-xs">{timeAgo(user.lastLoginAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
