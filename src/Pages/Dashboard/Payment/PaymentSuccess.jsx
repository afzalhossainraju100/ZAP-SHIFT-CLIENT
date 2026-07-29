import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentInfo,setPaymentInfo] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    sessionId
      ? "Finalizing your payment..."
      : "Missing payment session information.",
  );
  const [hasError, setHasError] = useState(!sessionId);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
        .then((res) => {
          console.log("Payment success response:", res.data);
          setPaymentInfo({
            transactionId: res.data?.transactionId || null,
            trackingId: res.data?.trackingId || null,
          });
        })
      return;
    }

    axiosSecure
      .patch(`/payment-success?session_id=${sessionId}`)
      .then((res) => {
        if (res.data?.modifiedCount || res.data?.success) {
          setMessage("Payment completed successfully.");
          setIsRedirecting(true);
          setTimeout(() => {
            navigate("/dashboard/my-parcels", { replace: true });
          }, 1500);
          return;
        }

        setHasError(true);
        setMessage(
          "Payment was received, but the order update did not complete.",
        );
      })
      .catch(() => {
        setHasError(true);
        setMessage(
          "Payment confirmation failed. Please contact support or try again.",
        );
      });
  }, [sessionId, axiosSecure, navigate]);

  return (
    <div className="mt-20 mx-4 min-h-screen bg-[#ffffff] text-[#000000] flex items-center justify-center px-4">
    <h1>Your Transaction Details: </h1><p>{paymentInfo?.transactionId}</p>
    <p>Tracking ID: {paymentInfo?.trackingId}</p>
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold">Payment Status</h1>
        <p
          className={`mt-4 text-base ${hasError ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </p>
        <p className="mt-3 text-sm text-gray-500">
          {sessionId
            ? `Session ID: ${sessionId}`
            : "No Stripe session was returned."}
        </p>
        <Link
          to="/dashboard/my-parcels"
          className="mt-6 inline-flex rounded-xl bg-[#caeb66] px-4 py-3 font-semibold text-black transition hover:opacity-90"
        >
          {isRedirecting ? "Returning to My Parcels..." : "Back to My Parcels"}
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
