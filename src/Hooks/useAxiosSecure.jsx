import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.init";

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

  return config;
});

// A 401 means the session is no longer valid: sign out so PrivateRoute sends
// the user to the sign in page. 403 (wrong role) is left to the caller.
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && auth.currentUser) {
      console.warn("Session expired or invalid, signing out.");
      await signOut(auth);
    }

    return Promise.reject(error);
  },
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
