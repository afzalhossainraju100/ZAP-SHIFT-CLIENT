import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.init";
import { clearAdminSession, getAdminSession } from "../utils/adminSession";

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach a fresh Firebase ID token to every request.
// getIdToken() returns the cached token and refreshes it automatically when it
// is about to expire, so pages never need to handle tokens themselves.
axiosSecure.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Admin only: proof that the authenticator code was entered
  const adminSession = getAdminSession();
  if (adminSession) {
    config.headers["X-Admin-Session"] = adminSession;
  }

  return config;
});

axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // Session no longer valid, or a Firebase login without a ZapShift account
    if ((status === 401 || code === "PROFILE_NOT_FOUND") && auth.currentUser) {
      console.warn("Signing out:", error.response?.data?.message);
      clearAdminSession();
      await signOut(auth);
    }

    // Admin session expired: ask for a new authenticator code
    if (code === "ADMIN_OTP_REQUIRED") {
      clearAdminSession();
      if (window.location.pathname !== "/admin-verify") {
        window.location.assign("/admin-verify");
      }
    }

    return Promise.reject(error);
  },
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
