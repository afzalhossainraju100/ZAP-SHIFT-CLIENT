import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Loading from "../../../Component/Loading/Loading";

const Payment = () => {
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { isLoading, data: parcel } = useQuery({
    queryKey: ["payment", parcelId],
    enabled: !!parcelId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!parcelId) {
    return (
      <div className="mt-20 mx-4 bg-[#ffffff] text-[#000000] h-screen flex items-center justify-center">
        <h1>No parcel selected for payment.</h1>
      </div>
    );
  }

  return (
    <div className="mt-20 mx-4 bg-[#ffffff] text-[#000000] h-screen flex items-center justify-center gap-5">
      <h1>Please Pay: {parcel?.parcelName ?? "Unknown parcel"}</h1>

      <button className="bg-[#caeb66] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Proceed to Payment
      </button>
    </div>
  );
};

export default Payment;
