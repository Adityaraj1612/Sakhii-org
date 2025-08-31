import React, { useState } from "react";
import { FaMinus, FaPlus, FaPlay } from "react-icons/fa";
import { MdPlayArrow } from "react-icons/md";

const faqData = [
  {
    question: "How are donation used ?",
    answer:
      "Answers to common quick questions About Our mission and work and Quick Guide to our Programs and Processes",
  },
  {
    question: "How are donation used ?",
    answer:
      "Answers to common quick questions About Our mission and work and Quick Guide to our Programs and Processes",
  },
  {
    question: "How are donation used ?",
    answer:
      "Answers to common quick questions About Our mission and work and Quick Guide to our Programs and Processes",
  },
  {
    question: "How are donation used ?",
    answer:
      "Answers to common quick questions About Our mission and work and Quick Guide to our Programs and Processes",
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Top section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between ">
        <div className="flex md:flex-row flex-col items-center justify-between gap-4 mb-4 md:mb-0  w-full">
          <button className="flex items-center   gap-1 border border-[#CA3561] text-black  rounded-full">
            <MdPlayArrow className="bg-[#CA3561] text-white p-1 rounded-full w-8 h-8 " />
            <span className="font-medium mr-2">Questions Answered</span>
          </button>
          <div>
          <p className="text-base text-gray-600 max-w-sm">
            Answers to common quick questions About Our mission and work and Quick Guide to our Programs and Processes
          </p>
          <button className="bg-[#CA3561] text-white px-4 py-1 rounded-full shadow-md hover:bg-rose-600 transition mt-2">
          Contact Us
        </button>
          </div>
        </div>
        
      </div>

      {/* FAQ Title */}
      <h2 className="text-4xl font-extrabold mb-8">Frequently <br /> asked questions</h2>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="border border-black/50 rounded-xl shadow-lg p-5 transition-all duration-300 bg-white"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleIndex(index)}
            >
              <h3 className="text-lg font-medium">{item.question}</h3>
              <span className="">
                {activeIndex === index ? (
                  <FaMinus className="w-4 h-4 border bg-[#ff6b8b] text-white p-0.5" />
                ) : (
                  <FaPlus className="w-4 h-4" />
                )}
              </span>
            </div>
            {activeIndex === index && (
              <p className="text-gray-600 mt-2 text-sm">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
