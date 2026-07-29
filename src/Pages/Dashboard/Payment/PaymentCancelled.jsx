import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <div className="mt-20 mx-4 min-h-screen bg-[#ffffff] text-[#000000] flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
          Payment Cancelled
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          Your Stripe checkout was cancelled.
        </h1>
        <p className="mt-4 text-sm text-gray-600">
          No money was taken. You can safely return to your parcel list and try
          again when ready.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard/my-parcels"
            className="inline-flex items-center justify-center rounded-xl bg-[#caeb66] px-4 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Back to My Parcels
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-black transition hover:bg-gray-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
