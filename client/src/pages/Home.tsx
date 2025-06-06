import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import PeriodCalendar from "@/components/sections/PeriodCalendar";
import HealthTracker from "@/components/sections/HealthTracker";
import EducationalResources from "@/components/sections/EducationalResources";
import MedicalExperts from "@/components/sections/MedicalExperts";
import Community from "@/components/sections/Community";

const Home = () => {
  return (
    <div className="font-sans">
      <Hero />
      <Features />
      <PeriodCalendar />
      <HealthTracker />
      <EducationalResources />
      <MedicalExperts />
      <Community />
    </div>
  );
};

export default Home;
