
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

const CallToAction = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('home.cta.title', "Don't Wait, Embark on Your Health Journey Today")}
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {t('home.cta.subtitle', 'Take the first step towards better health and wellness with Sakhi')}
        </p>
        <Link href="/sign-up">
          <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-3">
            {t('home.cta.getStarted', 'Get Started')}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
