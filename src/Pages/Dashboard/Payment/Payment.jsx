import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";

const Payment = () => {
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, data: parcel } = useQuery({
    queryKey: ["payment", parcelId],
    enabled: !!parcelId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  const handlePayment = async () => {
    if (!parcel?._id || !parcel?.senderEmail || parcel?.cost == null) {
      console.error("Missing payment data", parcel);
      return;
    }

    const amount = Number(parcel.cost);

    if (!Number.isFinite(amount) || amount <= 0) {
      console.error("Invalid payment amount", parcel.cost);
      return;
    }

    try {
      setIsSubmitting(true);

      const paymentInfo = {
        parcelId: parcel._id,
        senderEmail: parcel.senderEmail,
        amount,
        parcelName: parcel.parcelName,
      };

      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo,
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Payment request failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!parcelId) {
    return (
      <div className="mt-20 mx-4 bg-[#ffffff] text-[#000000] h-screen flex items-center justify-center">
        <h1>No parcel selected for payment.</h1>
      </div>
    );
  }

  return (
    <div className="mt-20 mx-4 bg-[#ffffff] text-[#000000] h-screen flex items-center justify-center gap-5">
      <h1>
        Please Pay ${parcel?.cost ?? "0.00"} for:{" "}
        {parcel?.parcelName ?? "Unknown parcel"}
      </h1>

      <button
        onClick={handlePayment}
        disabled={isSubmitting || !parcel?._id}
        className="bg-[#caeb66] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isSubmitting ? "Redirecting..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default Payment;
