import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { formatDate, getErrorMessage } from "../../../utils/parcelStatus";

const statusStyles = {
  pending: "badge-warning",
  approved: "badge-success",
  rejected: "badge-error",
};

// Rider fields are user input: escape before putting them into SweetAlert HTML
const escapeHtml = (value) =>
  String(value ?? "—").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );

const ManageRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState("");

  const { data: riders = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-riders", status],
    queryFn: async () =>
      (await axiosSecure.get(`/riders${status ? `?status=${status}` : ""}`)).data.data,
  });

  const updateStatus = (rider, newStatus) => {
    Swal.fire({
      title: `${newStatus === "approved" ? "Approve" : "Reject"} ${rider.name}?`,
      text:
        newStatus === "approved"
          ? "Their role will become rider."
          : "Their role will go back to user.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axiosSecure
        .patch(`/riders/${rider._id}/status`, { status: newStatus })
        .then(() => {
          refetch();
          Swal.fire("Done!", `Rider ${newStatus}.`, "success");
        })
        .catch((error) => Swal.fire("Error!", getErrorMessage(error), "error"));
    });
  };

  const showDetails = (rider) => {
    const r = Object.fromEntries(
      Object.entries(rider).map(([key, value]) => [key, escapeHtml(value)]),
    );

    Swal.fire({
      title: r.name,
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.8">
          <b>Email:</b> ${r.email}<br/>
          <b>Phone:</b> ${r.phone}<br/>
          <b>Age:</b> ${r.age}<br/>
          <b>Region / District:</b> ${r.region} / ${r.district}<br/>
          <b>NID:</b> ${r.nid}<br/>
          <b>Driving License:</b> ${r.drivingLicense}<br/>
          <b>Bike:</b> ${r.bikeModel} (${r.bikeRegistration})<br/>
          <b>Earnings:</b> ৳${r.earnings}<br/>
          <b>About:</b> ${r.about}
        </div>`,
    });
  };

  return (
    <div className="mt-20 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Manage Riders ({riders.length})</h1>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="select bg-white"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-black">
              <tr>
                <th></th>
                <th>Rider</th>
                <th>Service Center</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {riders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    No riders found.
                  </td>
                </tr>
              )}
              {riders.map((rider, index) => (
                <tr key={rider._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="font-medium">{rider.name}</div>
                    <div className="text-xs text-gray-500">
                      {rider.email} · {rider.phone}
                    </div>
                  </td>
                  <td>
                    {rider.district}, {rider.region}
                  </td>
                  <td>{formatDate(rider.appliedAt)}</td>
                  <td>
                    <span className={`badge capitalize ${statusStyles[rider.status] || ""}`}>
                      {rider.status}
                    </span>
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    <button onClick={() => showDetails(rider)} className="btn btn-sm">
                      View
                    </button>
                    {rider.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(rider, "approved")}
                        className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                      >
                        Approve
                      </button>
                    )}
                    {rider.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(rider, "rejected")}
                        className="btn btn-sm btn-error text-white"
                      >
                        Reject
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

export default ManageRiders;
