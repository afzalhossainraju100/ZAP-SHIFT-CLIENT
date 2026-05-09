import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const QAs = [
    {
      question: "How does this posture corrector work?",
      answer:
        "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
    },
    {
      question: "Is it suitable for all ages and body types?",
      answer:
        "Posture Pro works by using sensors to monitor your posture throughout the day. When it detects that you are slouching or have poor posture, it sends gentle vibrations or notifications to remind you to correct your posture. This helps you develop better habits and maintain proper alignment over time.",
    },
    {
      question: "Does it really help with back pain and posture improvement?",
      answer:
        "Posture Pro is generally suitable for most individuals, but it's always a good idea to consult with a healthcare professional before using any posture correction device, especially if you have pre-existing medical conditions or spinal issues.",
    },
    {
      question: "Does it have smart features like vibration alerts?",
      answer:
        "The recommended duration for wearing Posture Pro can vary based on individual needs and comfort levels. It's often suggested to start with shorter periods, such as 15-30 minutes a day, and gradually increase the duration as you become more accustomed to the device.",
    },
    {
      question: "How will I be notified when the product is back in stock?",
      answer:
        "Posture Pro can potentially help alleviate back pain by encouraging proper posture and reducing strain on the spine. However, it's important to address any underlying causes of back pain and consult with a healthcare professional for a comprehensive treatment plan.",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Question (FAQ)
      </h1>
      <p>
        Enhance posture, mobility, and well-being effortlessly with Posture Pro.
        Achieve proper alignment, reduce pain, and strengthen your body with
        ease!
      </p>

      <div className="w-full max-w-3xl">
        {QAs.map((qa, index) => (
          <div
            key={index}
            className="mb-6 bg-[#ffffff] p-6 rounded-lg shadow-md transition-all duration-300"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full text-left"
            >
              <h2 className="text-xl font-bold text-[#000000] transition-colors duration-300 hover:text-[#03373D]">
                {qa.question}
              </h2>
            </button>
            {openIndex === index && (
              <p className="mt-3 text-[#666666] transition-all duration-300">
                {qa.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-0 items-center">
        <button className="p-2 bg-[#CAEB66] text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#03373D] hover:text-[#ffffff] hover:scale-105 active:scale-95 cursor-pointer">
          See More FAQs
        </button>
        <div className="p-2 bg-[#000000] text-[#CAEB66] font-bold text-2xl rounded-full">
          <GoArrowUpRight />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
