import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import PeriodCalendar from "@/components/sections/PeriodCalendar";
import HealthTracker from "@/components/sections/HealthTracker";
import MedicalExperts from "@/components/sections/MedicalExperts";
import Community from "@/components/sections/Community";
import Testimonials from "@/components/sections/Testimonials";
import CallToAction from "@/components/sections/CallToAction";

const Home = () => {
  return (
    <div className="font-sans">
      <Hero />
      <Features />
      <MedicalExperts />
      <PeriodCalendar />
      <HealthTracker />
      <Community />
       <Testimonials />
       <CallToAction/>
      
      
    </div>
  );
};

export default Home;
