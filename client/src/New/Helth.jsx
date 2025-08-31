import React from 'react';
import periodImg from "../assets/UntitledDesign1.png";
import nutritionImg from "../assets/UntitledDesign2.png";
import shopImg from "../assets/UntitledDesign3.png";
import yojanasImg from "../assets/UntitledDesign4.png";
import communityImg from "../assets/UntitledDesign5.png";
import educationImg from "../assets/UntitledDesign6.png";

const Health = () => {
  const features = [
    { title: "Period Tracker2", image: periodImg },
    { title: "Nutrition", image: nutritionImg },
    { title: "Shop", image: shopImg },
    { title: "Yojanas", image: yojanasImg },
    { title: "Community", image: communityImg },
    { title: "Education", image: educationImg },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Comprehensive HealthCare Solution
      </h2>
      <div className="flex flex-wrap gap-6  justify-center  ">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-[#C22F5B] text-white rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 w-36 h-36 flex flex-col items-center justify-center p-2"
          >
            <h3 className="text-sm font-semibold text-center">{item.title}</h3>
            <img
              src={item.image}
              alt={item.title}
              className="w-28 h-28 object-contain mb-2"
            />
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default Health;
