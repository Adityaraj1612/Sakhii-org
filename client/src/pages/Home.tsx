import React from "react";

const Hero: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://i.ibb.co/nqSWpmBK/Whats-App-Image-2025-06-07-at-12-41-26-0d008c3b.jpg')",
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Sakhii.org
        </h1>
        <p className="text-lg md:text-2xl max-w-2xl mx-auto">
          Empowering Women’s Health with Knowledge, Community, and Care.
        </p>
        <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-full transition duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
