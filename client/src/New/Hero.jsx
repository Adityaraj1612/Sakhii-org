import React from 'react'
import hero from '../../src/assets/heroCopy.jpg'

const Hero = () => {
  return (
    <div className="relative w-full">
      {/* Hero Image */}
      <img 
        src={hero} 
        alt="Hero" 
        className="w-full h-[60vh] object-cover "
      />

      {/* Optional Overlay for better text visibility */}
      <div className="absolute inset-0 "></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex py-10 px-4 sm:px-8 md:px-16">
        <div className="max-w-xl text-white leading-relaxed">
          <h2 className="text-[#CA3561] font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
            Sakhii Care Foundation
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-black font-semibold">
            <span className="text-[#CA3561]">Empowering women </span>
            through <span className="text-[#CA3561]">health, education </span> <br/>
            and dignity <span className="text-[#CA3561]">using AI</span> and
            <span className="text-[#CA3561]"> community care </span>
            for <br /> lasting impact.
          </p>
        </div>
      </div>
      <div className=' absolute bottom-0 w-full h-1/6 bg-gradient-to-t from-white to-transparent'></div>
    </div>
  )
}

export default Hero
