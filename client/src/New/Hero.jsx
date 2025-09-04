import React from 'react'
import { useTranslation } from 'react-i18next'
import hero from '../../src/assets/heroCopy.jpg'

const Hero = () => {
  const { t } = useTranslation();
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
        <div className="max-w-2xl text-white leading-relaxed" style={{marginLeft: '0px'}}>
          <h2 className="text-[#CA3561] font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
            {t('home.hero.foundationName', 'Sakhii Care Foundation')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-black font-semibold">
            <span className="text-[#CA3561]">{t('home.hero.empoweringWomen', 'Empowering women')} </span>
            {t('home.hero.through', 'through')} <span className="text-[#CA3561]">{t('home.hero.healthEducation', 'health, education')} </span> <br/>
            {t('home.hero.andDignity', 'and dignity')} <span className="text-[#CA3561]">{t('home.hero.usingAI', 'using AI')}</span> {t('home.hero.and', 'and')}
            <span className="text-[#CA3561]"> {t('home.hero.communityCare', 'community care')} </span>
            {t('home.hero.forImpact', 'for')} <br /> {t('home.hero.lastingImpact', 'lasting impact')}.
          </p>
        </div>
      </div>
      <div className=' absolute bottom-0 w-full h-1/6 bg-gradient-to-t from-white to-transparent'></div>
    </div>
  )
}

export default Hero
