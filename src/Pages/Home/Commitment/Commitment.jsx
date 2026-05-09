import LiveTrackign from "../../../assets/livetracking.png";
import SafeDelevary from "../../../assets/safedelivery.png";
import CallCenterSupport from "../../../assets/safedelivery.png";

const Commitment = () => {
  const commits = [
    {
      id: 1,
      img: LiveTrackign,
      title: "Commitment to Quality",
      description:
        "We are dedicated to providing high-quality services and products that meet the needs and expectations of our customers. We continuously strive for excellence in everything we do.",
    },
    {
      id: 2,
      img: SafeDelevary,
      title: "Customer Satisfaction",
      description:
        "Our customers are at the heart of our business. We are committed to delivering exceptional customer service and ensuring that our customers are satisfied with their experience with us.",
    },
    {
      id: 3,
      img: CallCenterSupport,
      title: "Innovation and Improvement",
      description:
        "We are committed to innovation and continuous improvement. We embrace change and are always looking for ways to enhance our services and products to better serve our customers.",
    },
  ];
  return (
    <div>
      <hr className="border-t border-dashed border-gray-400 my-4" />

      <div className="flex flex-col gap-6 mt-15 mb-15">
        {commits.map((commit) => (
          <div
            key={commit.id}
            className="text-start flex gap-2 bg-[#ffffff] rounded-lg shadow-md p-6 items-center transition-transform duration-300 hover:scale-102 hover:shadow-lg"
          >
            <img src={commit.img} alt={commit.title} className="mx-auto mb-4" />

            <div className="h-50">
                <hr className="h-full border-l border-dashed border-gray-400 mx-4 w-px bg-transparent " />
            </div>
            

            <div>
              <h3 className="text-xl font-bold mb-2">{commit.title}</h3>
              <p className="text-gray-600">{commit.description}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-t border-dashed border-gray-400 my-4" />
    </div>
  );
};

export default Commitment;
