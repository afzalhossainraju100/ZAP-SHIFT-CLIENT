import { use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ReviewCard from "./ReviewCard";
import customertop from "../../../assets/customertop.png";

const Reviews = ({ reviewsPromise }) => {
  const reviews = use(reviewsPromise);

  return (
    <div className="flex flex-col items-center justify-center mt-15">
      <div className="flex flex-col items-center justify-center space-y-4">
        <img src={customertop} alt="Customer" />
        <h1 className="text-3xl font-bold text-center mb-8">
          What our customers are saying
        </h1>
        <p>
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>
      </div>
      <div className="w-full flex justify-center items-center py-12">
        <Swiper
        loop={true}
        effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={24}
          coverflowEffect={{
            rotate:30,
            stretch:'50%',
            depth:200,
            modifier:1,
            scale:0.75,
            sliderShadows:true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={true}
          modules={[Pagination, EffectCoverflow, Autoplay]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Reviews;
