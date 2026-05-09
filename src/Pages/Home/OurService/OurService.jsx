import ServiceImg from "../../../assets/service.png";
import { use } from "react";

const OurService = ({ servicePromise }) => {
  const Services = use(servicePromise);
  return (
    <div className="bg-[#03373D] p-25 rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#ffffff]">
        Our Services
      </h1>
      <p className="text-center text-[#ffffff]">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero
        hassle. From personal packages to business shipments — we deliver on
        time, every time.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Services.map((service, index) => (
          <div
            key={index}
            className="bg-[#ffffff] rounded-lg shadow-md p-6 text-center flex flex-col items-center transition-transform duration-300 hover:bg-[#CAEB66] hover:scale-105"
          >
            <img src={ServiceImg} alt="icon" />
            <h2 className="text-xl font-semibold mb-4">{service.title}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurService;
