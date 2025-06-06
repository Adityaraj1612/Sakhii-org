import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalsWidgetProps {
  fullWidth?: boolean;
}

const GoalsWidget = ({ fullWidth = false }: GoalsWidgetProps) => {
  // Mock goals data
  const goals = [
    {
      id: 1,
      name: "Daily Water",
      value: 75,
      target: "2500ml",
      icon: "💧"
    },
    {
      id: 2,
      name: "Exercise",
      value: 60,
      target: "30 minutes",
      icon: "🏃‍♀️"
    },
    {
      id: 3,
      name: "Sleep Quality",
      value: 80,
      target: "8 hours",
      icon: "😴"
    },
    {
      id: 4,
      name: "Meditation",
      value: 40,
      target: "10 minutes",
      icon: "🧘‍♀️"
    }
  ];
  
  // Only show first three goals if not full width
  const displayGoals = fullWidth ? goals : goals.slice(0, 3);

  return (
    <Card className={`${fullWidth ? 'w-full' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            My Goals
          </CardTitle>
          
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayGoals.map((goal) => (
            <div key={goal.id}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{goal.icon}</span>
                  <span>{goal.name}</span>
                </div>
                <span className="text-neutral-500 text-sm">
                  {goal.value}% of {goal.target}
                </span>
              </div>
              <Progress value={goal.value} className="h-2" />
            </div>
          ))}
        </div>
        
        {fullWidth && (
          <>
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Completed Goals</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🎯</span>
                    <span>Vitamins Intake</span>
                  </div>
                  <span className="text-green-600 text-sm">Completed</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">🥗</span>
                    <span>Healthy Eating</span>
                  </div>
                  <span className="text-green-600 text-sm">Completed</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                View All Goals
              </Button>
              <Button className="w-full">
                Add New Goal
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsWidget;
