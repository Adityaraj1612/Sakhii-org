import React from "react";
import { useTranslation } from 'react-i18next'
import about1 from "../../src/assets/Rectangle 11.png"
import about2 from "../../src/assets/Rectangle 32.png"
import about3 from "../../src/assets/Rectangle 54.png"

const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-16 px-4 md:px-12 lg:px-20 max-w-6xl mx-auto">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        {t('home.about.title', 'About Sakhii Care Foundation')}
      </h2>

      {/* Vision & Mission Container */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Vision */}
        <div className="flex flex-col items-center md:items-end ">
          <h3 className="text-3xl font-bold text-[#CA3561] mb-3">{t('home.about.ourVision', 'Our Vision')}</h3>
          <p className="text-gray-700 text-center md:text-left w-75 ">
            {t('home.about.visionText1', 'To create an inclusive, informed, and empowered society where every woman regardless of her location, background, or literacy level has')}{" "}
            <span className="text-[#CA3561] font-medium">
              {t('home.about.visionText2', 'access to personalized healthcare, education, and support.')}
            </span>
          </p>
        </div>

        {/* Vision Image */}
        <div className="flex justify-center">
          <img
            src={about1} // Replace with your real image URL
            alt="Women Group"
            className="rounded-xl shadow-md w-full h-auto object-cover max-h-[300px]"
          />
        </div>

        {/* Mission Image (on small screen appears before text) */}
        <div className="flex justify-center mb-10 ">
          <div className="relative">
            <img
              src={about2} // Replace with your real image URL
              alt="Kids Group"
              className="rounded-xl shadow-md w-full max-h-[200px] object-cover"
            />
            <img
              src={about3} // Replace with your real image URL
              alt="Girls Learning"
              className="rounded-xl shadow-md w-64 max-h-[160px] object-cover absolute -right-8 -bottom-20  "
            />
          </div>
        </div>

        {/* Mission */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-3xl font-bold text-[#CA3561] mb-3">{t('home.about.ourMission', 'Our Mission')}</h3>
          <p className="text-gray-700 text-center md:text-left md:w-75">
            {t('home.about.missionText1', 'To empower every woman with accessible, personalized healthcare and education through')}{" "}
            <span className="text-rose-500 font-medium">
              {t('home.about.missionText2', 'AI powered tools, trusted medical support, and a safe digital community')}
            </span>{" "}
            {t('home.about.missionText3', 'no matter where she lives.')}
          </p>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;
