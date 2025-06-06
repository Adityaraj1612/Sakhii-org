import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, LineChart, Activity, User, Bell, Settings } from "lucide-react";
import PeriodCalendarWidget from "@/components/dashboard/PeriodCalendarWidget";
import HealthMetricsWidget from "@/components/dashboard/HealthMetricsWidget";
import AppointmentsWidget from "@/components/dashboard/AppointmentsWidget";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import EducationalContentWidget from "@/components/dashboard/EducationalContentWidget";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="py-8 bg-purple-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 font-heading">My Dashboard</h1>
            <p className="text-neutral-600">
              Track your health metrics, appointments, and personalized content
            </p>
          </div>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Period Tracker</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Next period in 14 days
              </p>
              <Button variant="outline" size="sm" className="w-full">View Calendar</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Health Metrics</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Last updated today
              </p>
              <Button variant="outline" size="sm" className="w-full">Update Metrics</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Consultations</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Next appointment: Jun 15
              </p>
              <Button variant="outline" size="sm" className="w-full">Book Appointment</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Goals</h3>
              <p className="text-neutral-600 text-sm mb-4">
                2 goals in progress
              </p>
              <Button variant="outline" size="sm" className="w-full">Manage Goals</Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="period-tracker">Period Tracker</TabsTrigger>
            <TabsTrigger value="health-metrics">Health Metrics</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <PeriodCalendarWidget />
              </div>
              
              <div>
                <GoalsWidget />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <HealthMetricsWidget />
              <AppointmentsWidget />
            </div>
            
            <div className="mt-6">
              <EducationalContentWidget />
            </div>
          </TabsContent>
          
          <TabsContent value="period-tracker">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 font-heading">Period Tracker</h2>
                  <PeriodCalendarWidget fullWidth />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="health-metrics">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 font-heading">Health Metrics</h2>
                  <HealthMetricsWidget fullWidth />
                </CardContent>
              </Card>
              
              <GoalsWidget fullWidth />
            </div>
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 font-heading">My Appointments</h2>
                  <AppointmentsWidget fullWidth />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6 font-heading">Educational Resources</h2>
                  <EducationalContentWidget fullWidth />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
