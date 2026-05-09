import Service from "../../../assets/service.png";

const OurService = () => {
  const Services = [
    {
      name: "Express & Standard Delivery",
      description:
        "We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery is available in Dhaka within 4-6 hours from pick-up to drop-off.",
    },
    {
      name: "Nationwide Delivery",
      description:
        "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48-72 hours.",
    },
    {
      name: "Fulfillment Solution",
      description:
        "We also offer customized service with inventory management support, online order processing, packaging, and after-sales support.",
    },
    {
      name: "Cash on Home Delivery",
      description:
        "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    },
    {
      name: "Corporate Service / Contract In Logistics",
      description:
        "Customized corporate services which include warehouse and inventory management support.",
    },
    {
      name: "Parcel Return",
      description:
        "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    },
  ];
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
            <img src={Service} alt="icon" />
            <h2 className="text-xl font-semibold mb-4">{service.name}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurService;
