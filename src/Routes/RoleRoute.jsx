import { Link } from "react-router-dom";
import useRole from "../Hooks/useRole";
import Loading from "../Component/Loading/Loading";

// Renders children only when the user's role is one of `allow`.
// Use inside a PrivateRoute (the dashboard already is one).
const RoleRoute = ({ allow, children }) => {
  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loading />;
  }

  if (allow.includes(role)) {
    return children;
  }

  return (
    <div className="mt-20 flex min-h-[60vh] items-center justify-center px-4 text-[#000000]">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
          403 Forbidden
        </p>
        <h1 className="mt-3 text-2xl font-bold">You don't have access</h1>
        <p className="mt-2 text-sm text-gray-600">
          This page is only for {allow.join(" / ")} accounts. Your role is{" "}
          <span className="font-semibold">{role}</span>.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-[#caeb66] px-4 py-3 font-semibold text-black"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export const AdminRoute = ({ children }) => (
  <RoleRoute allow={["admin"]}>{children}</RoleRoute>
);

export const RiderRoute = ({ children }) => (
  <RoleRoute allow={["rider"]}>{children}</RoleRoute>
);

export default RoleRoute;
