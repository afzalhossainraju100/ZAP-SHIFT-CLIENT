import bookingIcon from "../../../assets/bookingIcon.png";

const WorkingProcess = () => {
    const WorkingProcessData = [
      {
        id: 1,
        title: "Booking Pick & Drop",
        description:
          "From personal packages to business shipments — we deliver on time, every time.",
      },
      {
        id: 2,
        title: "Cash On Delivery",
        description:
          "From personal packages to business shipments — we deliver on time, every time.",
      },
      {
        id: 3,
        title: "Delivery Hub",
        description:
          "From personal packages to business shipments — we deliver on time, every time.",
      },
      {
        id: 4,
        title: "Booking SME & Corporate",
        description:
          "From personal packages to business shipments — we deliver on time, every time.",
      },
    ];
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-start mb-8">How It Works</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {WorkingProcessData.map((process) => (
          <div
            key={process.id}
            className="bg-[#ffffff] rounded-lg shadow-md p-6 text-start transition-transform duration-300 hover:scale-105"
          >
            <img src={bookingIcon} alt="icon" />
            <h2 className="text-xl font-semibold mb-4">{process.title}</h2>
            <p className="text-gray-600">{process.description}</p>
          </div>
        ))}
      </div>
        </div>
    );
};

export default WorkingProcess;