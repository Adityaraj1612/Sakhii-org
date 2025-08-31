import React from "react";
import peopleImage from "../assets/banner1.png"; // adjust path as needed

const Banner = () => {
  return (
    <section className="bg-[#C73D67] rounded-t-3xl overflow-hidden text-white max-w-7xl mb-8 mx-auto border ">
      <div className=" px-8 pt-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
          Together <span className="text-white">. We Can Make A Difference</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 items-start ">
          {/* Left Text Section */}
          <div className="md:col-span-1 text-center md:text-left space-y-3">
            <p className="text-lg font-semibold lg:mt-20">Total people involved</p>
            <p>Building Brighter Futures Through Learning</p>
            <p className="font-semibold">100+ Peoples</p>
          </div>

          {/* Saathi Card */}
          <div className="bg-[#C73D67] border rounded-3xl p-6 shadow-md ">
            <h3 className="font-bold text-xl mb-3">Become a Saathi</h3>
            <p className="text-sm mb-5">
              Sathis are our champions for change trained and mentored to lead awareness
              drives and build circles of support in their own villages, towns, or schools.
              Lead with us, and be someone's Sakhii.
            </p>
            <button className="bg-white text-[#C73D67] font-bold px-5 py-2 w-full rounded-full shadow hover:bg-pink-100 transition">
              Become a Saathi
            </button>
          </div>

          {/* Volunteer Card */}
          <div className="bg-[#C73D67] border rounded-3xl p-6 shadow-md ">
            <h3 className="font-bold text-xl mb-3">Become a Volunteer</h3>
            <p className="text-sm mb-5">
              Passionate about change? Join our community as a volunteer — from outreach
              and content creation to tech and design. Work flexibly, from anywhere, and
              make a real, lasting difference.
            </p>
            <button className="bg-white text-[#C73D67] font-bold px-5 py-2 w-full rounded-full shadow hover:bg-pink-100 transition">
              Become a Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Image */}
       <div className="relative w-full md:mt-[-30px] overflow-hidden">
  {/* Gradient behind the image */}
  <div className="absolute md:top-20 top-10 w-[80%] mx-[10%] h-full rounded-full bg-gradient-to-b from-white to-transparent z-10"></div>
  
  {/* Image */}
  <img
    src={peopleImage}
    alt="Group of people"
    className="w-full object-cover relative z-10"
  />
</div>

    </section>
  );
};

export default Banner;
