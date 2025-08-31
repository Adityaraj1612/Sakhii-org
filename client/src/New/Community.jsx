import React from "react";
import communtiImage from "../assets/image 1.png";



const stats = [
  { count: "100+", label: "Community Members" },
  { count: "15", label: "Doctors Present" },
  { count: "2", label: "NGO Collaboration" },
  { count: "10", label: "Offline Events" },
  { count: "50+", label: "Helped Women", highlight: true },
];

const CommunitySection = () => {
  return (
    <section className="bg-white border max-w-screen-2xl mx-auto ">
      {/* Join Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
        Join our Community !
      </h2>

      {/* Community Banner */}
      <div className="grid md:grid-cols-2 gap-6 items-center bg-[#CA3561] text-white rounded-xl overflow-hidden shadow-lg relative">
        {/* Left Image + Text */}
        <div className="relative h-full">
          <img
            src={communtiImage}
            alt="Community Kids"
            className="w-full h-full object-cover brightness-50 "
          />

          {/* Top white gradient */}
          {/* <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-white to-transparent z-10" /> */}

          {/* Bottom white gradient */}
          {/* <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white to-transparent z-10" /> */}

          <div className="absolute inset-0 md:max-w-xl  flex flex-col justify-center p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Join Our Community of Health Advocates
            </h3>
            <p className="mb-4 text-sm md:text-base">
              Make a difference in women’s lives by becoming a Saathi. Share
              your knowledge, experience, and support with those who need it.
            </p>
            <button className="text-white bg-[#CA3561] font-semibold px-6 py-2 rounded-full hover:bg-rose-100 transition w-fit">
              Join Community
            </button>
          </div>
        </div>

        {/* Right WhatsApp Card */}
        <div className="flex flex-col items-center justify-center p-10 bg-[#CA3561] text-center relative ">
          <div className="relative w-64 h-64 rounded-xl overflow-hidden mb-6">
            {/* Background box (optional if just styling) */}
            <div className="absolute inset-0 bg-white z-0" />

            {/* Image */}
            <img
              src={communtiImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-10"
            />

            {/* <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-white to-transparent z-20" /> */}
          </div>

          <button className="bg-white text-[#CA3561] font-semibold px-6 py-2 rounded-full hover:bg-rose-100 transition shadow-md shadow-black">
            Whatsapp Community
          </button>
        </div>
          <div className="absolute bottom-0 left-0 w-full lg:h-1/4 h-1/10 bg-gradient-to-t from-white to-transparent z-10" />
      </div>

      {/* Stats Section */}
      <div className="md:relative flex justify-center ">
      <div className="md:absolute   -bottom-20 z-10 w-full lg:w-auto mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-white rounded-xl py-4 px-4 md:px-10 shadow-md mx-auto">
  {stats.map((item, index) => (
    <div
      key={index}
      className="group text-center py-4 rounded-xl shadow hover:bg-[#CA3561] transition duration-300 cursor-pointer"
    >
      <p className="text-3xl font-bold text-[#CA3561] group-hover:text-white transition">
        {item.count}
      </p>
      <p className="text-sm md:text-base  group-hover:text-white transition">
        {item.label}
      </p>
    </div>
  ))}
</div>

      </div>
      </div>

      {/* Call to Action Text */}
      <div className="text-center lg:mt-28 mt-8 mb-4">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Be the part of big change!
        </h3>
        <p className=" max-w-3xl mx-auto text-gray-700">
          <strong>Sakhii Care Foundation</strong> is a non-profit dedicated to{" "}
          <span className="text-rose-500 italic">
            improving women’s health, education, and empowerment,
          </span>{" "}
          especially in rural India.{" "}
          <span className="text-rose-500 italic">
            We use AI, outreach, and partnerships to provide access to
            reproductive health, mental well-being, and menstrual care.
          </span>
        </p>
      </div>
    </section>
  );
};

export default CommunitySection;
