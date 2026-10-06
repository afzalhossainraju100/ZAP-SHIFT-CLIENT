import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../Component/Loading/Loading";
import { formatDate, getErrorMessage } from "../../../utils/parcelStatus";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-users", search, role],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      return (await axiosSecure.get(`/users?${params.toString()}`)).data.data;
    },
  });

  const changeRole = (user, newRole) => {
    Swal.fire({
      title: `Make ${user.email} ${newRole === "admin" ? "an admin" : "a user"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change role",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axiosSecure
        .patch(`/users/${user._id}/role`, { role: newRole })
        .then(() => {
          refetch();
          Swal.fire("Updated!", `${user.email} is now ${newRole}.`, "success");
        })
        .catch((error) => Swal.fire("Error!", getErrorMessage(error), "error"));
    });
  };

  return (
    <div className="mt-20 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Users ({users.length})</h1>
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
              placeholder="Search by email"
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
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="font-medium">{user.name || "—"}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td>
                    <span className="badge capitalize">{user.role}</span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    {user.email === currentUser?.email ? (
                      <span className="text-xs text-gray-400">You</span>
                    ) : user.role === "admin" ? (
                      <button onClick={() => changeRole(user, "user")} className="btn btn-sm">
                        Make User
                      </button>
                    ) : (
                      <button
                        onClick={() => changeRole(user, "admin")}
                        className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
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
