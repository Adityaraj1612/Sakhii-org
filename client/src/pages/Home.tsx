// import Hero from "@/components/sections/Hero";
// import Features from "@/components/sections/Features";
// import PeriodCalendar from "@/components/sections/PeriodCalendar";
// import HealthTracker from "@/components/sections/HealthTracker";
// import MedicalExperts from "@/components/sections/MedicalExperts";
// import Community from "@/components/sections/Community";
// import Testimonials from "@/components/sections/Testimonials";
// import CallToAction from "@/components/sections/CallToAction";

import AboutSection from "@/New/About";
import Banner from "@/New/Banner";
import BannerSecond from "@/New/BannerSecond";
import CommunitySection from "@/New/Community";
import FaqSection from "@/New/Faq";
import Health from "@/New/Helth";
import Hero from "@/New/Hero";
import Testimonial from "@/New/Testimonial";


const Home = () => {
  return (
    <div className="font-sans max-w-screen-2xl mx-auto">
      {/* <Hero />
      <Features />
      <MedicalExperts />
      <PeriodCalendar />
      <HealthTracker />
      <Community />
       <Testimonials />
       <CallToAction/>
       
       */}
       
       <Hero/>
    <AboutSection/>
    <Health/>
    <Banner/>
    <BannerSecond/>
    <Testimonial/>
    <CommunitySection/>
    <FaqSection/>
      
    </div>
  );
};

export default Home;
