import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

// Returns the logged in user's role from the server: "user" | "rider" | "admin"
const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role = "user", isLoading: roleLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users/role");
      return res.data?.role || "user";
    },
  });

  return { role, roleLoading: loading || roleLoading };
};

export default useRole;
