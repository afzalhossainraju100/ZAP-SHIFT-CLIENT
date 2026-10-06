import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiShield, FiSmartphone } from "react-icons/fi";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";
import { setAdminSession } from "../../../utils/adminSession";
import { getAuthErrorMessage } from "../../../utils/authErrors";

// Second step of the admin login: 6 digit code from an authenticator app
const AdminVerify = () => {
  const { user, loading, logOut } = useAuth();
  const { role, otpVerified, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = !!user && role === "admin";

  const { data: setup, isLoading: setupLoading, error: setupError } = useQuery({
    queryKey: ["admin-otp-setup", user?.email],
    enabled: isAdmin && !otpVerified,
    staleTime: Infinity,
    retry: false,
    queryFn: async () => (await axiosSecure.post("/auth/admin/otp/setup")).data,
  });

  if (loading || roleLoading) return <Loading />;
  if (!user) return <Navigate to="/signin" replace />;
  if (role !== "admin" || otpVerified) return <Navigate to="/dashboard" replace />;

  const handleVerify = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await axiosSecure.post("/auth/admin/otp/verify", { code });
      setAdminSession(res.data.sessionToken, res.data.expiresAt);
      await queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    await logOut();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-black">
      <div className="w-105 max-w-full rounded-2xl bg-white p-10 shadow-lg">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100 text-[#03373d]">
          <FiShield className="size-6" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">Admin verification</h1>
        <p className="mt-2 text-sm text-gray-500">
          Signed in as <span className="font-semibold">{user.email}</span>. Enter
          the 6 digit code from your authenticator app.
        </p>

        {setupLoading && <p className="mt-6 text-sm text-gray-500">Loading...</p>}
        {setupError && (
          <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {getAuthErrorMessage(setupError)}
          </p>
        )}

        {setup && !setup.enrolled && (
          <div className="mt-6 rounded-xl border border-dashed border-lime-400 bg-lime-50/50 p-4">
            <p className="flex items-center gap-2 font-semibold">
              <FiSmartphone /> First time: set up your authenticator
            </p>
            <ol className="mt-2 list-decimal space-y-1 ps-5 text-sm text-gray-600">
              <li>Install Google Authenticator or Microsoft Authenticator.</li>
              <li>Scan this QR code with the app.</li>
              <li>Type the 6 digit code it shows below.</li>
            </ol>
            <img
              src={setup.qrCode}
              alt="Authenticator QR code"
              className="mx-auto my-4 h-48 w-48 rounded-lg bg-white p-2"
            />
            <p className="text-center text-xs text-gray-500">
              Can't scan? Enter this key manually:
            </p>
            <p className="mt-1 select-all break-all text-center font-mono text-sm font-semibold tracking-wider">
              {setup.secret}
            </p>
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            placeholder="000000"
            className="w-full rounded-lg border border-gray-200 p-3 text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-lime-200"
          />
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting || code.length !== 6}
            className="w-full rounded-lg bg-lime-400 py-3 font-semibold text-gray-900 shadow-sm transition hover:bg-lime-500 disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify & continue"}
          </button>
        </form>

        <button
          onClick={handleCancel}
          className="mt-4 w-full text-center text-sm text-gray-500 underline"
        >
          Cancel and sign out
        </button>
      </div>
    </div>
  );
};

export default AdminVerify;
