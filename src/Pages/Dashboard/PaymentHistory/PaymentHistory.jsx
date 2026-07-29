import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { FiClock, FiHash, FiCreditCard } from "react-icons/fi";

const formatRelativeTime = (value) => {
  if (!value) return "Unknown date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const PaymentHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const email = user?.email || "";

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", email],
    enabled: !!email,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("email", email);
      queryParams.set("senderEmail", email);
      queryParams.set("customerEmail", email);

      const res = await axiosSecure.get(`/payments?${queryParams.toString()}`);
      const records = res.data?.payments ?? res.data ?? [];

      return Array.isArray(records) ? records : [];
    },
  });

  const sortedPayments = [...payments].sort((first, second) => {
    const firstDate = new Date(
      first?.paidAt ||
        first?.paymentDate ||
        first?.createdAt ||
        first?.date ||
        0,
    ).getTime();
    const secondDate = new Date(
      second?.paidAt ||
        second?.paymentDate ||
        second?.createdAt ||
        second?.date ||
        0,
    ).getTime();

    return secondDate - firstDate;
  });

  const totalAmount = sortedPayments.reduce((sum, payment) => {
    const amount = Number(payment?.amount ?? payment?.cost ?? 0);
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);

  if (authLoading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="mt-20 mx-4 min-h-screen bg-[#ffffff] text-[#000000]">
      <div className="rounded-2xl bg-linear-to-r from-[#caeb66] via-white to-[#e7f3ba] p-6 shadow-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-600">
          Payment History
        </p>
        <h1 className="mt-2 text-3xl font-bold">Your completed payments</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-700">
          Review every payment made from your account, including the transaction
          reference and how long ago it was completed.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <FiCreditCard className="text-xl" />
            <span className="text-sm font-medium">Total payments</span>
          </div>
          <p className="mt-3 text-3xl font-bold">{sortedPayments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <FiHash className="text-xl" />
            <span className="text-sm font-medium">Paid amount</span>
          </div>
          <p className="mt-3 text-3xl font-bold">৳ {totalAmount.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <FiClock className="text-xl" />
            <span className="text-sm font-medium">Latest update</span>
          </div>
          <p className="mt-3 text-xl font-semibold">
            {sortedPayments[0]
              ? formatRelativeTime(
                  sortedPayments[0]?.paidAt ||
                    sortedPayments[0]?.paymentDate ||
                    sortedPayments[0]?.createdAt ||
                    sortedPayments[0]?.date,
                )
              : "No payments yet"}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="text-[#000000]">
              <tr>
                <th></th>
                <th>Parcel</th>
                <th>Amount</th>
                <th>Transaction</th>
                <th>Tracking</th>
                <th>Paid</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.length > 0 ? (
                sortedPayments.map((payment, index) => (
                  <tr
                    key={payment?._id || payment?.transactionId || `${index}`}
                  >
                    <th>{index + 1}</th>
                    <td>
                      <div className="font-medium">
                        {payment?.parcelName ||
                          payment?.title ||
                          "Parcel payment"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment?.email ||
                          payment?.senderEmail ||
                          payment?.customerEmail ||
                          ""}
                      </div>
                    </td>
                    <td className="font-semibold">
                      ৳{" "}
                      {Number(payment?.amount ?? payment?.cost ?? 0).toFixed(2)}
                    </td>
                    <td>
                      {payment?.transactionId ||
                        payment?.transaction_id ||
                        "N/A"}
                    </td>
                    <td>
                      {payment?.trackingId || payment?.tracking_no || "N/A"}
                    </td>
                    <td>
                      {formatRelativeTime(
                        payment?.paidAt ||
                          payment?.paymentDate ||
                          payment?.createdAt ||
                          payment?.date,
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    No payment history found for this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
