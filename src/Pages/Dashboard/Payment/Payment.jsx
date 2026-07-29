import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";

const Payment = () => {
  const { parcelId } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const { isLoading, data: parcel } = useQuery({
    queryKey: ["payment", parcelId],
    enabled: !!parcelId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  const handlePayment = async () => {
    setPaymentError("");

    if (!parcel?._id || !parcel?.senderEmail || parcel?.cost == null) {
      setPaymentError(
        "Payment data is incomplete. Please go back and try again.",
      );
      return;
    }

    const amount = Number(parcel.cost);

    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError("The parcel cost is invalid.");
      return;
    }

    try {
      setIsSubmitting(true);

      const successUrl = `${window.location.origin}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/dashboard/payment-cancelled`;

      const paymentInfo = {
        parcelId: parcel._id,
        parcelName: parcel.parcelName,
        cost: amount,
        amount,
        senderEmail: parcel.senderEmail,
        customerEmail: user?.email ?? parcel.senderEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        successUrl,
        cancelUrl,
      };

      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo,
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      setPaymentError("Unable to start the payment session. Please try again.");
    } catch (error) {
      console.error("Payment request failed:", error);
      setPaymentError(
        "Payment could not be started. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!parcelId) {
    return (
      <div className="mt-20 mx-4 min-h-screen bg-[#ffffff] text-[#000000] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold">
            No parcel selected for payment.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 mx-4 min-h-screen bg-[#ffffff] text-[#000000] flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
          Payment Summary
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          ${parcel?.cost ?? "0.00"} for {parcel?.parcelName ?? "Unknown parcel"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Confirm the parcel details below, then continue to the secure
          checkout.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Parcel ID:</span>{" "}
            {parcel?._id ?? "N/A"}
          </p>
          <p className="mt-2">
            <span className="font-semibold">Sender email:</span>{" "}
            {parcel?.senderEmail ?? "N/A"}
          </p>
        </div>

        {paymentError ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentError}
          </div>
        ) : null}

        <button
          onClick={handlePayment}
          disabled={isSubmitting || !parcel?._id}
          className="mt-6 w-full rounded-xl bg-[#caeb66] px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Redirecting to checkout..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
