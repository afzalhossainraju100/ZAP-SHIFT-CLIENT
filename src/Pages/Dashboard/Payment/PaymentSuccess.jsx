import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [message, setMessage] = useState(
    sessionId
      ? "Finalizing your payment..."
      : "Missing payment session information.",
  );
  const [hasError, setHasError] = useState(!sessionId);

  useEffect(() => {
    if (!sessionId) return;

    // The server is idempotent, so the double run from StrictMode is harmless
    axiosSecure
      .patch(`/payment-success?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!res.data?.success) {
          setHasError(true);
          setMessage("Payment was received, but the order update did not complete.");
          return;
        }

        setPaymentInfo({
          transactionId: res.data.transactionId,
          trackingId: res.data.trackingId,
        });
        setMessage("Payment completed successfully.");
        queryClient.invalidateQueries({ queryKey: ["myparcels"] });
        queryClient.invalidateQueries({ queryKey: ["payment-history"] });

        Swal.fire({
          icon: "success",
          title: "Payment Successful!",
          html: `Tracking ID: <b>${res.data.trackingId}</b><br/>Transaction: <small>${res.data.transactionId}</small>`,
        });
      })
      .catch((error) => {
        setHasError(true);
        setMessage(
          error.response?.data?.message ||
            "Payment confirmation failed. Please contact support or try again.",
        );
      });
  }, [sessionId, axiosSecure, queryClient]);

  return (
    <div className="mt-20 mx-4 min-h-[70vh] text-[#000000] flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold">Payment Status</h1>
        <p
          className={`mt-4 text-base ${hasError ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </p>

        {paymentInfo && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4 text-left text-sm">
            <p>
              <span className="font-semibold">Tracking ID:</span>{" "}
              {paymentInfo.trackingId}
            </p>
            <p className="mt-2 break-all">
              <span className="font-semibold">Transaction ID:</span>{" "}
              {paymentInfo.transactionId}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard/my-parcels"
            className="inline-flex rounded-xl bg-[#caeb66] px-4 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Back to My Parcels
          </Link>
          {paymentInfo?.trackingId && (
            <Link
              to={`/dashboard/track?id=${paymentInfo.trackingId}`}
              className="inline-flex rounded-xl border border-gray-300 px-4 py-3 font-semibold"
            >
              Track Parcel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
