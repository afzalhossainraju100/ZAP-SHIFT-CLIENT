import { useState } from "react";

const About = () => {
  const aboutUs = [
    {
      id: 1,
      title: "Story",
      description:
        "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    },
    {
      id: 2,
      title: "Mission",
      description:
        "Our mission is to simplify delivery for everyone by combining smart logistics, transparent communication, and dependable service. We focus on getting every parcel delivered safely and on schedule while keeping the process clear and effortless for customers.",
    },
    {
      id: 3,
      title: "Success",
      description:
        "Integrity, Customer Focus, Innovation, Teamwork, and Excellence.",
    },
    {
      id: 4,
      title: "Team & Others",
      description:
        "We are committed to continuous improvement, sustainability, and giving back to our community.",
    },
  ];

  const [activeTabId, setActiveTabId] = useState(aboutUs[0].id);

  const activeContent =
    aboutUs.find((item) => item.id === activeTabId) ?? aboutUs[0];

  return (
    <section className="bg-[#f5f5f5] rounded-3xl p-8 md:p-14">
      {/* Heading */}
      <div className="max-w-3xl">
        <h2 className="text-4xl font-bold text-[#063b44] mb-4">About Us</h2>

        <p className="text-gray-500 leading-7 text-sm md:text-base">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-10"></div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-8 mb-10">
        {aboutUs.map((item) => {
          const isActive = item.id === activeTabId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTabId(item.id)}
              className={`pb-1 transition ${
                isActive
                  ? "text-[#7a8d2b] font-semibold border-b-2 border-[#7a8d2b]"
                  : "text-gray-500 hover:text-black"
              }`}
              aria-pressed={isActive}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-8 text-gray-500 leading-8 text-sm md:text-base">
        <p>{activeContent.description}</p>
      </div>
    </section>
  );
};

export default About;
