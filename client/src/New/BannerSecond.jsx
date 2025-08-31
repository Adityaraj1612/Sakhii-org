import React from "react";
import banner from "../assets/Rectangle 64.png";

const BannerSecond = () => {
  return (
    <div className="w-full relative  my-8">
      <img
        src={banner}
        alt="Banner"
        className="w-full h-auto max-h-[500px] object-cover sm:max-h-[400px] md:max-h-[500px] object-top brightness-95  "
      />
      <div className="sm:absolute inset-0 lg:left-32 left-50  lg:top-36 top-20  w-96  h-60  rounded-2xl bg-white p-4   ">
        <p className=" text-xl font-semibold">
          Empowering Children with Quality Sanitory Products and Education
        </p>
        <p className="mt-4 text-black/70">
          Education transforms lives but million of girls worldwide still lack
          access to the resources they and grow{" "}
        </p>
        <button className="lg:w-full w-1/2 bg-[#ca3561] text-white font-semibold py-1 rounded-2xl mt-4 cursor-pointer">
          Donate Now
        </button>
      </div>
      <div className="absolute top-0 w-full  h-1/4 bg-gradient-to-b from-white to-transparent "></div>

      <div className="absolute bottom-0 w-full md:h-1/6  bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default BannerSecond;
