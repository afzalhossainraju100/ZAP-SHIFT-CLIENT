import { GoArrowUpRight } from "react-icons/go";
import { Link } from "react-router-dom";

const BannerButton = () => {
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
      <Link to="/rider">
            <button className="p-2 bg-[#03373D] text-[#ffffff] rounded-lg transition-all duration-300 hover:bg-[#CAEB66] hover:text-[#000000] hover:scale-105 active:scale-95">
        Be A Rider
      </button>
      </Link>

    </div>
  );
};

export default BannerButton;
