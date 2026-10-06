import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

// The logged in account as the server sees it:
// role "user" | "rider" | "admin", whether the admin passed the OTP check,
// and the rider application status ("none" | "pending" | "approved" | "rejected")
const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["auth-me", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => (await axiosSecure.get("/auth/me")).data,
  });

  return {
    role: data?.role || "user",
    otpVerified: data?.otpVerified ?? true,
    riderStatus: data?.riderStatus || "none",
    wantsToRide: !!data?.wantsToRide,
    roleLoading: loading || (!!user && isLoading),
  };
};

export default useRole;
