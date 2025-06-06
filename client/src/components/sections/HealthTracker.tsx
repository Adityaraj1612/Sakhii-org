import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Utensils, Apple, SlidersHorizontal,
  Check, ChevronRight
} from "lucide-react";
import { DIET_PLAN_TYPES } from "@/lib/constants";

const HealthTracker = () => {
  // Mock health metrics data
  const healthMetrics = {
    weight: 63.5,
    bmi: 22.1,
    sleep: 6.5
  };

  // Mock goals data
  const goals = [
    { name: 'Daily Water', value: 75, target: 100 },
    { name: 'Exercise', value: 60, target: 100 },
    { name: 'Sleep Quality', value: 80, target: 100 }
  ];

  // Group diet plan types
  const dietPlanGroups = [
    {
      icon: <Utensils className="text-primary mr-2" />,
      title: "Nutrition",
      items: DIET_PLAN_TYPES.slice(0, 4)
    },
    {
      icon: <Apple className="text-primary mr-2" />,
      title: "Diet Types",
      items: DIET_PLAN_TYPES.slice(4, 8)
    },
    {
      icon: <SlidersHorizontal className="text-primary mr-2" />,
      title: "Customization",
      items: [
        "Adapt to your cycle",
        "Allergy considerations",
        "Budget-friendly options",
        "Time-saving recipes"
      ]
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-heading">Personalized Diet Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {dietPlanGroups.map((group, groupIndex) => (
            <Card key={groupIndex} className="border border-neutral-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  {group.icon}
                  {group.title}
                </h3>
                <ul className="space-y-2 text-neutral-600">
                  {group.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <Check className="text-green-500 mr-2 h-4 w-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mb-12">
          <Button size="lg">
            Get a Custom Diet Plan
          </Button>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8 font-heading">My Health Tracker</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-neutral-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Health Metrics</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-neutral-600">Weight</p>
                  <p className="text-2xl font-semibold text-neutral-800">{healthMetrics.weight}kg</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-600">BMI</p>
                  <p className="text-2xl font-semibold text-neutral-800">{healthMetrics.bmi}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-600">Sleep</p>
                  <p className="text-2xl font-semibold text-neutral-800">{healthMetrics.sleep}h</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full bg-purple-50 text-primary hover:bg-purple-100">
                Update Metrics
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border border-neutral-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">My Goals</h3>
              
              {goals.map((goal, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{goal.name}</span>
                    <span>{goal.value}%</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${goal.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full bg-purple-50 text-primary hover:bg-purple-100">
                Set New Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HealthTracker;
