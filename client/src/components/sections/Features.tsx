import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, CalendarDays, UserRound } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();
  
  const featureIcons = [
    <BrainCircuit className="text-primary h-6 w-6" />,
    <CalendarDays className="text-primary h-6 w-6" />,
    <UserRound className="text-primary h-6 w-6" />
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-heading">
          {t('home.features.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <Card 
              key={index} 
              className="border border-neutral-100 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  {featureIcons[index]}
                </div>
                <h3 className="text-xl font-semibold mb-2 font-heading">
                  {t(`home.features.items.${index}.title`)}
                </h3>
                <p className="text-neutral-600">
                  {t(`home.features.items.${index}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
