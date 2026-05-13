import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const BannerButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleRiderClick = () => {
    if (user) {
      navigate("/rider");
    } else {
      navigate("/signin", { state: { from: { pathname: "/rider" } } });
    }
  };

  return (
    <div className="flex gap-4 absolute top-135 left-60 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex gap-0 items-center">
        <button className="p-2 bg-[#CAEB66] text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#03373D] hover:text-[#ffffff] hover:scale-105 active:scale-95 cursor-pointer">
          Track Your Parcel
        </button>
        <div className="p-2 bg-[#000000] text-[#CAEB66] font-bold text-2xl rounded-full">
          <GoArrowUpRight />
        </div>
      </div>
      <button
        onClick={handleRiderClick}
        className="p-2 bg-[#03373D] text-[#ffffff] rounded-lg transition-all duration-300 hover:bg-[#CAEB66] hover:text-[#000000] hover:scale-105 active:scale-95"
      >
        Be A Rider
      </button>
    </div>
  );
};

export default BannerButton;
