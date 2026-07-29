import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  // const queryClient = useQueryClient();
  const senderEmail = user?.email || "";

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["myparcels", senderEmail],
    enabled: !!senderEmail,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("email", senderEmail);
      queryParams.set("senderEmail", senderEmail);

      const res = await axiosSecure.get(`/parcels?${queryParams.toString()}`);
      return res.data;
    },
  });

  const handleParcelDelete = (id) => {
    console.log(id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/parcels/${id}`).then((res) => {
          console.log(res.data);
          if (res.data.deletedCount > 0) {
            //refreash the data
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your Parcel Has Been Deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div className="text-[#000000] mt-20 mx-4 bg-[#ffffff]">
      <h1>All of my parcels: {parcels.length}</h1>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="text-[#000000]">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Parcel Type</th>
              <th>Cost</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel.parcelName}</td>
                <td>{parcel.parcelType}</td>
                <td>{parcel.cost}</td>
                <td>
                  {parcel.paymentStatus === "paid" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <Link
                      to={`/dashboard/payment/${parcel._id}`}
                      className="btn btn-sm bg-[#caeb66] border-[#caeb66] text-[#000000] hover:bg-[#caeb66] hover:border-[#caeb66]"
                    >
                      Pay Now
                    </Link>
                  )}
                </td>
                <td>{parcel.deliveryStatus}</td>
                <td>
                  <button className="btn btn-square bg-[#ffffff] border-[#ffffff] text-[#000000] hover:bg-[#caeb66] hover:border-[#caeb66]">
                    <FaMagnifyingGlass />
                  </button>
                  <button className="btn btn-square bg-[#ffffff] border-[#ffffff] text-[#000000] hover:bg-[#caeb66] hover:border-[#caeb66]">
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleParcelDelete(parcel._id)}
                    className="btn btn-square bg-[#ffffff] border-[#ffffff] text-[#000000] hover:bg-[#caeb66] hover:border-[#caeb66]"
                  >
                    <AiOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
