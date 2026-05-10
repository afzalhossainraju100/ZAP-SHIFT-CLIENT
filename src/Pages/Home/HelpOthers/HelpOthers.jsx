import brand1 from "../../../assets/brands/amazon_vector.png";
import brand2 from "../../../assets/brands/amazon.png";
import brand3 from "../../../assets/brands/casio.png";
import brand4 from "../../../assets/brands/moonstar.png";
import brand5 from "../../../assets/brands/randstad.png";
import brand6 from "../../../assets/brands/start_people.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const HelpOthers = () => {

  const brands = [brand1, brand2, brand3, brand4, brand5, brand6];
    return (
      <div className="flax flax-cols items-center container mx-auto px-4 py-12 justify-center">
        <h1 className="text-3xl font-bold text-center mb-8">
          We've helped thousands of sales teams
        </h1>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2} // Mobile
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          autoplay={{ delay: 250, disableOnInteraction: false }}
          loop={true}
          className="mb-20"
        >
          {brands.map((b, i) => (
            <SwiperSlide key={i}>
              <img src={b} alt={`Brand ${i}`} className="mx-auto" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
};

export default HelpOthers;