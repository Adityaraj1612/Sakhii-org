import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import heroimg from "../../../../attached_assets/Hero.jpg"; // Adjust the path as necessary
import { url } from "inspector";
const Hero = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="py-12 md:py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4 font-heading">
                {t("home.hero.mainHeading")}
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                {t("home.hero.subHeading")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="font-medium">
                    {t("home.hero.exploreCta")}
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button size="lg" variant="outline" className="font-medium">
                    {t("home.hero.findDoctorCta")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="rounded-lg h-80 md:h-96 w-full overflow-hidden">
                <img
                  src={heroimg}
                  alt={t("home.hero.imageAlt")}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          
            
            
              <div className="rounded-lg h-120 md:h-96 w-full overflow-hidden" style={{ backgroundImage: `url(${heroimg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="md:w-1/2 mb-10 md:mb-0 p-4">
              <h1 className="text-4xl md:text-4xl font-bold text-neutral-800 mb-4 font-heading">
                {t("home.hero.mainHeading")}
              </h1>
              <p className="text-lg text-neutral-600 mb-8">
                {t("home.hero.subHeading")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="font-medium">
                    {t("home.hero.exploreCta")}
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button size="lg" variant="outline" className="font-medium">
                    {t("home.hero.findDoctorCta")}
                  </Button>
                </Link>
              </div>
            </div>
              </div>
            </div>
          
        
      </section>

     
    </>
  );
};

export default Hero;
