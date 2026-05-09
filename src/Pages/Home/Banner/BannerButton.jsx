import { GoArrowUpRight } from "react-icons/go";

const BannerButton = () => {
  return (
    <div className="flex gap-4 position-relative absolute top-135 left-60 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex gap-0 items-center">
        <button className="p-2 bg-[var(--color-primary)] text-[#000000] rounded-lg transition-all duration-300 hover:bg-[var(--color-3)] hover:text-[#ffffff] hover:scale-105 active:scale-95 coursor-pointer">
          Track Your Parcel
        </button>
        <div className="p-2 bg-[#000000] text-[#CAEB66] font-bold text-2xl rounded-full">
          <GoArrowUpRight />
        </div>
      </div>
      <button className="p-2 bg-[var(--color-3)] text-[#ffffff] rounded-lg transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-[#000000] hover:scale-105 active:scale-95">
        Be A Rider
      </button>
    </div>
  );
};

export default BannerButton;
