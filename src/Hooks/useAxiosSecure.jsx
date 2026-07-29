import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 5000,
  //   headers: { "X-Custom-Header": "foobar" },
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
