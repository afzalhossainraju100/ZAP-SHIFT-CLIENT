import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  return (
    <div className="review-card w-full rounded-[28px] bg-white px-7 py-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <FaQuoteLeft className="mb-5 text-3xl text-[#c6e2e7]" />

      <p className="min-h-32 text-[15px] leading-7 text-slate-700">
        {review?.review}
      </p>

      <div className="my-5 border-t border-dashed border-[#8fc8d2]" />

      <div className="flex items-center gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#0a5560] shrink-0">
          {review?.user_photoURL ? (
            <img
              src={review.user_photoURL}
              alt={review?.userName}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="leading-tight">
          <h3 className="text-[17px] font-bold text-[#0b4853]">
            {review?.userName}
          </h3>
          <p className="text-[14px] text-slate-500">{review?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
