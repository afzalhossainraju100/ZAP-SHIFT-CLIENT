import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { formatDate, getErrorMessage } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";

const config = {
  pickup: {
    title: "Parcels to Pickup",
    empty: "No parcels waiting for pickup.",
    action: "Confirm Pickup",
  },
  delivery: {
    title: "Parcels to Deliver",
    empty: "No parcels waiting for delivery.",
    action: "Confirm Delivery",
  },
  completed: {
    title: "Completed Deliveries",
    empty: "You haven't delivered any parcels yet.",
  },
};

// type: "pickup" | "delivery" | "completed"
const RiderParcels = ({ type }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { title, empty, action } = config[type];

  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ["rider-parcels", type],
    queryFn: async () => (await axiosSecure.get(`/rider/parcels?type=${type}`)).data.data,
  });

  const handleConfirm = (parcel) => {
    Swal.fire({
      title: action,
      text: "Ask for the parcel's tracking ID and type it below to confirm.",
      input: "text",
      inputPlaceholder: "PRCL-XXXXXXXX-XXXXXXXX",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      inputValidator: (value) => (!value ? "Tracking ID is required" : undefined),
      preConfirm: (trackingId) =>
        axiosSecure
          .patch(`/rider/parcels/${parcel._id}/confirm`, { action: type, trackingId })
          .then((res) => res.data)
          .catch((error) => Swal.showValidationMessage(getErrorMessage(error))),
    }).then((result) => {
      if (!result.isConfirmed) return;

      refetch();
      queryClient.invalidateQueries({ queryKey: ["rider-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rider-current-tasks"] });
      Swal.fire("Done!", "Status updated. ৳20 added to your earnings.", "success");
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">
        {title} ({parcels.length})
      </h1>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-black">
              <tr>
                <th></th>
                <th>Parcel</th>
                <th>{type === "pickup" ? "Pickup from" : "Deliver to"}</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Updated</th>
                {action && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {parcels.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500">
                    {empty}
                  </td>
                </tr>
              )}
              {parcels.map((parcel, index) => {
                const isPickup = type === "pickup";
                return (
                  <tr key={parcel._id}>
                    <th>{index + 1}</th>
                    <td>
                      <div className="font-medium">{parcel.parcelName}</div>
                      <div className="text-xs capitalize text-gray-500">
                        {parcel.parcelType}
                        {parcel.parcelWeight ? ` · ${parcel.parcelWeight} kg` : ""}
                      </div>
                    </td>
                    <td>
                      <div>{isPickup ? parcel.senderAddress : parcel.receiverAddress}</div>
                      <div className="text-xs text-gray-500">
                        {isPickup ? parcel.senderDistrict : parcel.receiverDistrict}
                      </div>
                      {(isPickup ? parcel.pickupInstruction : parcel.deliveryInstruction) && (
                        <div className="text-xs italic text-gray-500">
                          “{isPickup ? parcel.pickupInstruction : parcel.deliveryInstruction}”
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{isPickup ? parcel.senderName : parcel.receiverName}</div>
                      <div className="text-xs text-gray-500">
                        {isPickup ? parcel.senderPhone : parcel.receiverContact}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={parcel.deliveryStatus} />
                    </td>
                    <td className="text-xs">{formatDate(parcel.updatedAt)}</td>
                    {action && (
                      <td>
                        <button
                          onClick={() => handleConfirm(parcel)}
                          className="btn btn-sm border-[#caeb66] bg-[#caeb66] text-black"
                        >
                          {action}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiderParcels;
