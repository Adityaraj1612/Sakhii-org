import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Heart, 
  Target, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  User, 
  Edit3, 
  Plus, 
  Activity,
  Weight,
  Ruler,
  Droplets,
  ThermometerSun,
  Moon,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, subDays } from "date-fns";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  lastUpdated: Date;
  icon: React.ReactNode;
  color: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  category: 'fitness' | 'nutrition' | 'wellness' | 'medical';
  priority: 'low' | 'medium' | 'high';
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      name: 'Weight',
      value: user?.weight || 0,
      unit: 'kg',
      target: (user?.weight || 70) - 5,
      lastUpdated: new Date(),
      icon: <Weight className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      id: '2',
      name: 'Water Intake',
      value: 6,
      unit: 'glasses',
      target: 8,
      lastUpdated: new Date(),
      icon: <Droplets className="h-5 w-5" />,
      color: 'text-cyan-600'
    },
    {
      id: '3',
      name: 'Sleep Hours',
      value: 7,
      unit: 'hours',
      target: 8,
      lastUpdated: new Date(),
      icon: <Moon className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      id: '4',
      name: 'Exercise',
      value: 30,
      unit: 'minutes',
      target: 60,
      lastUpdated: new Date(),
      icon: <Activity className="h-5 w-5" />,
      color: 'text-green-600'
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Drink 8 glasses of water daily',
      description: 'Stay hydrated for better health and energy',
      targetDate: addDays(new Date(), 30),
      progress: 75,
      category: 'wellness',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Exercise 5 times per week',
      description: 'Build a consistent fitness routine',
      targetDate: addDays(new Date(), 60),
      progress: 60,
      category: 'fitness',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Regular gynecological checkup',
      description: 'Schedule annual health screening',
      targetDate: addDays(new Date(), 90),
      progress: 25,
      category: 'medical',
      priority: 'medium'
    }
  ]);

  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    category: 'wellness',
    priority: 'medium',
    progress: 0
  });

  const updateMetric = (metricId: string, newValue: number) => {
    setHealthMetrics(prev => 
      prev.map(metric => 
        metric.id === metricId 
          ? { ...metric, value: newValue, lastUpdated: new Date() }
          : metric
      )
    );
    toast({
      title: "Metric Updated",
      description: "Your health metric has been successfully updated!",
    });
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updates }
          : goal
      )
    );
    toast({
      title: "Goal Updated",
      description: "Your goal has been successfully updated!",
    });
  };

  const addNewGoal = () => {
    if (!newGoal.title || !newGoal.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title!,
      description: newGoal.description!,
      targetDate: newGoal.targetDate || addDays(new Date(), 30),
      progress: 0,
      category: newGoal.category as Goal['category'] || 'wellness',
      priority: newGoal.priority as Goal['priority'] || 'medium'
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'wellness',
      priority: 'medium',
      progress: 0
    });
    setIsAddingGoal(false);
    
    toast({
      title: "Goal Added",
      description: "Your new goal has been successfully created!",
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal Deleted",
      description: "Your goal has been removed.",
    });
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'fitness': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'wellness': return 'bg-purple-100 text-purple-800';
      case 'medical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600">
            Track your health metrics and achieve your wellness goals
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric) => (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.name}
                </CardTitle>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{metric.target} {metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.value / metric.target) * 100} 
                  className="h-2 mb-2"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Updated: {format(metric.lastUpdated, 'HH:mm')}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setEditingMetric(metric)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update {metric.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="value">Current Value</Label>
                          <Input
                            id="value"
                            type="number"
                            defaultValue={metric.value}
                            onChange={(e) => {
                              const newValue = parseFloat(e.target.value) || 0;
                              updateMetric(metric.id, newValue);
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="target">Target Value</Label>
                          <Input
                            id="target"
                            type="number"
                            defaultValue={metric.target}
                            onChange={(e) => {
                              const newTarget = parseFloat(e.target.value) || 0;
                              setHealthMetrics(prev => 
                                prev.map(m => 
                                  m.id === metric.id 
                                    ? { ...m, target: newTarget }
                                    : m
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-pink-500" />
                Health Goals
              </CardTitle>
              <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Goal Title *</Label>
                      <Input
                        id="title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter goal title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your goal"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newGoal.category} 
                        onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value as Goal['category'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fitness">Fitness</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={newGoal.priority} 
                        onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value as Goal['priority'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewGoal} className="bg-pink-500 hover:bg-pink-600">
                        Add Goal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{goal.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                        <Badge className={getPriorityColor(goal.priority)}>
                          {goal.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Goal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="progress">Progress (%)</Label>
                            <Input
                              id="progress"
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={goal.progress}
                              onChange={(e) => {
                                const progress = parseInt(e.target.value) || 0;
                                updateGoal(goal.id, { progress: Math.min(100, Math.max(0, progress)) });
                              }}
                            />
                          </div>
                          <div className="flex justify-between">
                            <Button 
                              variant="destructive" 
                              onClick={() => deleteGoal(goal.id)}
                              size="sm"
                            >
                              Delete Goal
                            </Button>
                            <Button 
                              onClick={() => updateGoal(goal.id, { progress: 100 })}
                              className="bg-green-500 hover:bg-green-600"
                              size="sm"
                            >
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Target: {format(goal.targetDate, 'MMM dd, yyyy')}</span>
                    <span>{Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity & Calendar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => updateMetric('2', Math.min(8, healthMetrics.find(m => m.id === '2')?.value || 0) + 1)}
                >
                  <Droplets className="h-5 w-5 mb-1 text-cyan-500" />
                  <span className="text-xs">Log Water</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => updateMetric('4', (healthMetrics.find(m => m.id === '4')?.value || 0) + 30)}
                >
                  <Activity className="h-5 w-5 mb-1 text-green-500" />
                  <span className="text-xs">Log Exercise</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => updateMetric('1', (user?.weight || 70) - 0.1)}
                >
                  <Weight className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs">Log Weight</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => updateMetric('3', Math.min(12, (healthMetrics.find(m => m.id === '3')?.value || 0) + 1))}
                >
                  <Moon className="h-5 w-5 mb-1 text-purple-500" />
                  <span className="text-xs">Log Sleep</span>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Goal Progress</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
                    </span>
                  </div>
                  <Progress 
                    value={goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length} 
                    className="h-3"
                  />
                  <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {goals.filter(g => g.progress === 100).length}
                      </div>
                      <div className="text-xs text-gray-500">Completed Goals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {goals.filter(g => g.progress > 0 && g.progress < 100).length}
                      </div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;