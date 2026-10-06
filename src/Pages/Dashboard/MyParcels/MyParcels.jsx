import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import { FiMapPin } from "react-icons/fi";
import Swal from "sweetalert2";
import Loading from "../../../Component/Loading/Loading";
import { getErrorMessage } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myparcels", user?.email, search],
    enabled: !!user?.email,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await axiosSecure.get(`/parcels?${params.toString()}`);
      return res.data;
    },
  });

  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  const handleParcelDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axiosSecure
        .delete(`/parcels/${id}`)
        .then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your Parcel Has Been Deleted.",
              icon: "success",
            });
          }
        })
        .catch((error) => {
          Swal.fire("Error!", getErrorMessage(error), "error");
        });
    });
  };

  return (
    <div className="text-[#000000] mt-20 mx-4 rounded-2xl bg-[#ffffff] p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Parcels ({parcels.length})</h1>
        <form onSubmit={handleSearch} className="join">
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Receiver phone, tracking ID or name"
            className="input join-item w-64 bg-white"
          />
          <button className="btn join-item border-[#caeb66] bg-[#caeb66] text-black">
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-[#000000]">
              <tr>
                <th></th>
                <th>Name</th>
                <th>Receiver</th>
                <th>Type</th>
                <th>Cost</th>
                <th>Payment</th>
                <th>Delivery Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">
                    No parcels found.{" "}
                    <Link to="/send-parcel" className="font-semibold text-green-600">
                      Send one now
                    </Link>
                  </td>
                </tr>
              )}
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="font-medium">{parcel.parcelName}</div>
                    {parcel.trackingId && (
                      <div className="text-xs text-gray-500">{parcel.trackingId}</div>
                    )}
                  </td>
                  <td>
                    <div>{parcel.receiverName}</div>
                    <div className="text-xs text-gray-500">
                      {parcel.receiverContact} · {parcel.receiverDistrict}
                    </div>
                  </td>
                  <td className="capitalize">{parcel.parcelType}</td>
                  <td>৳{parcel.cost}</td>
                  <td>
                    {parcel.paymentStatus === "paid" ? (
                      <span className="font-semibold text-green-500">Paid</span>
                    ) : (
                      <Link
                        to={`/dashboard/payment/${parcel._id}`}
                        className="btn btn-sm bg-[#caeb66] border-[#caeb66] text-[#000000]"
                      >
                        Pay Now
                      </Link>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={parcel.deliveryStatus} />
                  </td>
                  <td className="whitespace-nowrap">
                    <Link
                      to={`/dashboard/parcel/${parcel._id}`}
                      title="View details"
                      className="btn btn-square btn-sm bg-[#ffffff] border-[#ffffff] text-[#000000] hover:bg-[#caeb66]"
                    >
                      <FaMagnifyingGlass />
                    </Link>
                    {parcel.trackingId && (
                      <Link
                        to={`/dashboard/track?id=${parcel.trackingId}`}
                        title="Track"
                        className="btn btn-square btn-sm bg-[#ffffff] border-[#ffffff] text-[#000000] hover:bg-[#caeb66]"
                      >
                        <FiMapPin />
                      </Link>
                    )}
                    {parcel.paymentStatus !== "paid" && (
                      <button
                        onClick={() => handleParcelDelete(parcel._id)}
                        title="Delete"
                        className="btn btn-square btn-sm bg-[#ffffff] border-[#ffffff] text-[#000000] hover:bg-red-200"
                      >
                        <AiOutlineDelete />
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

export default MyParcels;
