import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import heroimg from "../../../../attached_assets/Hero.jpg";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section 
      className="relative min-h-screen flex items-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${heroimg})`,
        backgroundPosition: '50% 30%',
        backgroundSize: 'cover',
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content positioned on the left */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading drop-shadow-lg">
            {t("home.hero.mainHeading")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 drop-shadow-md">
            {t("home.hero.subHeading")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="font-medium text-lg px-8 py-3">
                {t("home.hero.exploreCta")}
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="lg" variant="outline" className="font-medium text-lg px-8 py-3 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                {t("home.hero.findDoctorCta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
