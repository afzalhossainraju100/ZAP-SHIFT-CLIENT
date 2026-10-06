import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { formatDate, getErrorMessage } from "../../../utils/parcelStatus";
import StatusBadge from "../../../Component/StatusBadge/StatusBadge";
import TrackingTimeline from "../Tracking/TrackingTimeline";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium">{value || "—"}</span>
  </div>
);

const ParcelDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: parcel, isLoading, error } = useQuery({
    queryKey: ["parcel", id],
    queryFn: async () => (await axiosSecure.get(`/parcels/${id}`)).data,
    retry: false,
  });

  const { data: history = [] } = useQuery({
    queryKey: ["tracking", parcel?.trackingId],
    enabled: !!parcel?.trackingId,
    queryFn: async () =>
      (await axiosSecure.get(`/trackings/${parcel.trackingId}`)).data.history,
  });

  if (isLoading) return <Loading />;

  if (error || !parcel) {
    return (
      <div className="mt-20 rounded-2xl bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Parcel not found</h1>
        <p className="mt-2 text-gray-500">{getErrorMessage(error, "")}</p>
        <Link to="/dashboard" className="btn mt-6 bg-[#caeb66] border-[#caeb66] text-black">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-20 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">{parcel.parcelName}</h1>
          <p className="text-sm text-gray-500">
            {parcel.trackingId ? `Tracking ID: ${parcel.trackingId}` : "Not paid yet - no tracking ID"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={parcel.deliveryStatus} />
          {parcel.paymentStatus !== "paid" && (
            <Link
              to={`/dashboard/payment/${parcel._id}`}
              className="btn btn-sm bg-[#caeb66] border-[#caeb66] text-black"
            >
              Pay ৳{parcel.cost}
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">Parcel</h2>
          <Row label="Type" value={parcel.parcelType} />
          <Row label="Weight" value={parcel.parcelWeight ? `${parcel.parcelWeight} kg` : null} />
          <Row label="Cost" value={`৳${parcel.cost}`} />
          <Row label="Payment" value={parcel.paymentStatus} />
          <Row label="Booked" value={formatDate(parcel.createdAt)} />
          <Row label="Pickup rider" value={parcel.pickupRider?.name} />
          <Row label="Delivery rider" value={parcel.deliveryRider?.name} />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">Sender</h2>
          <Row label="Name" value={parcel.senderName} />
          <Row label="Phone" value={parcel.senderPhone} />
          <Row label="Email" value={parcel.senderEmail} />
          <Row label="Address" value={parcel.senderAddress} />
          <Row label="Service center" value={`${parcel.senderDistrict}, ${parcel.senderRegion}`} />
          <Row label="Instruction" value={parcel.pickupInstruction} />
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">Receiver</h2>
          <Row label="Name" value={parcel.receiverName} />
          <Row label="Phone" value={parcel.receiverContact} />
          <Row label="Email" value={parcel.receiverEmail} />
          <Row label="Address" value={parcel.receiverAddress} />
          <Row label="Service center" value={`${parcel.receiverDistrict}, ${parcel.receiverRegion}`} />
          <Row label="Instruction" value={parcel.deliveryInstruction} />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Delivery timeline</h2>
        <TrackingTimeline history={history} />
      </div>
    </div>
  );
};

export default ParcelDetails;
