import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PeriodCalendarWidget from "@/components/dashboard/PeriodCalendarWidget";
import { CalendarDays, Baby, LineChart, Bike, Clock, Droplets, Activity } from "lucide-react";

// Create a new component for the tracker card
const TrackerCard = ({ 
  title, 
  description, 
  icon, 
  active = false,
  onClick 
}: { 
  title: string, 
  description: string, 
  icon: React.ReactNode,
  active?: boolean,
  onClick: () => void 
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${active ? 'ring-2 ring-primary' : ''}`} 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <div className="mr-2 text-primary">{icon}</div>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant={active ? "default" : "outline"} size="sm">
          {active ? "Currently Active" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Create the video card component
const VideoCard = ({ 
  title, 
  thumbnail, 
  duration, 
  url 
}: { 
  title: string, 
  thumbnail: string, 
  duration: string, 
  url: string 
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{title}</h3>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={() => window.open(url, '_blank')}>
          Watch Video
        </Button>
      </CardFooter>
    </Card>
  );
};

const HealthTrackers = () => {
  const [selectedTracker, setSelectedTracker] = useState<string>("period");
  const [activeTab, setActiveTab] = useState<string>("trackers");
  const [_, setLocation] = useLocation();

  // Educational videos data
  const educationalVideos = [
    {
      title: "Understanding Your Menstrual Cycle",
      thumbnail: "/images/woman-profile.png", 
      duration: "10:25",
      url: "https://www.youtube.com/watch?v=ekyJoYZivDg",
    },
    {
      title: "Ovulation Tracking Methods",
      thumbnail: "/images/woman-profile.png",
      duration: "7:15",
      url: "https://www.youtube.com/watch?v=jd_YL5JwNQQ",
    },
    {
      title: "Pregnancy Symptoms & Signs",
      thumbnail: "/images/woman-profile.png",
      duration: "12:40",
      url: "https://www.youtube.com/watch?v=5QwN9PKJ9L8",
    },
    {
      title: "Managing PMS Symptoms Naturally",
      thumbnail: "/images/woman-profile.png",
      duration: "8:30",
      url: "https://www.youtube.com/watch?v=RARkim5Ydhg",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Health Trackers</h1>
      
      <Tabs defaultValue="trackers" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trackers">Trackers</TabsTrigger>
          <TabsTrigger value="educational">Educational Videos</TabsTrigger>
          <TabsTrigger value="insights">Insights & Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trackers" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <TrackerCard
              title="Period Tracker"
              description="Track your menstrual cycle and predict your next period"
              icon={<CalendarDays className="h-5 w-5" />}
              active={selectedTracker === "period"}
              onClick={() => setSelectedTracker("period")}
            />
            
            <TrackerCard
              title="Ovulation Tracker"
              description="Monitor your fertility window and ovulation days"
              icon={<Clock className="h-5 w-5" />}
              active={selectedTracker === "ovulation"}
              onClick={() => setSelectedTracker("ovulation")}
            />
            
            <TrackerCard
              title="Pregnancy Tracker"
              description="Follow your pregnancy journey week by week"
              icon={<Baby className="h-5 w-5" />}
              active={selectedTracker === "pregnancy"}
              onClick={() => setSelectedTracker("pregnancy")}
            />
            
            <TrackerCard
              title="Symptoms Tracker"
              description="Log your symptoms throughout your cycle"
              icon={<Activity className="h-5 w-5" />}
              active={selectedTracker === "symptoms"}
              onClick={() => setSelectedTracker("symptoms")}
            />
            
            <TrackerCard
              title="Flow Tracker"
              description="Monitor your menstrual flow intensity"
              icon={<Droplets className="h-5 w-5" />}
              active={selectedTracker === "flow"}
              onClick={() => setSelectedTracker("flow")}
            />
            
            <TrackerCard
              title="Exercise Tracker"
              description="Track your physical activities during your cycle"
              icon={<Bike className="h-5 w-5" />}
              active={selectedTracker === "exercise"}
              onClick={() => setSelectedTracker("exercise")}
            />
          </div>
          
          <div className="mt-8">
            {selectedTracker === "period" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Period Tracker</h2>
                <p className="mb-4 text-neutral-600">Track your menstrual cycle to predict your next period, fertile window, and ovulation days.</p>
                <PeriodCalendarWidget fullWidth={true} />
              </div>
            )}
            
            {selectedTracker === "ovulation" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Ovulation Tracker</h2>
                <p className="mb-4 text-neutral-600">Monitor your most fertile days and track your basal body temperature to optimize chances of conception.</p>
                <PeriodCalendarWidget fullWidth={true} />
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Fertile Window</h3>
                  <p className="text-blue-700">Your fertile window is highlighted in light blue on the calendar. These days (typically 5 days before ovulation and the day of ovulation) are when you're most likely to conceive.</p>
                </div>
              </div>
            )}
            
            {selectedTracker === "pregnancy" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Pregnancy Tracker</h2>
                <p className="mb-4 text-neutral-600">Track your pregnancy journey week by week with detailed information about your baby's development.</p>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <img src="/images/woman-profile.png" alt="Baby development" className="mx-auto h-40 object-contain" />
                      <h3 className="font-bold mt-4">Pregnancy Week: Not Active</h3>
                      <p className="text-neutral-600 mt-2">To start tracking your pregnancy, please enter your last menstrual period date or expected due date.</p>
                    </div>
                    <Button className="w-full">Start Pregnancy Tracking</Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {selectedTracker === "symptoms" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Symptoms Tracker</h2>
                <p className="mb-4 text-neutral-600">Log your symptoms throughout your cycle to identify patterns and better manage your health.</p>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <LineChart className="h-20 w-20 mx-auto text-primary opacity-50" />
                      <h3 className="font-bold mt-4">No Symptom Data Available</h3>
                      <p className="text-neutral-600 mt-2">Start tracking your symptoms to see patterns and correlations with your cycle.</p>
                    </div>
                    <Button className="w-full">Log Symptoms</Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {selectedTracker === "flow" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Flow Tracker</h2>
                <p className="mb-4 text-neutral-600">Monitor your menstrual flow intensity to understand your cycle better.</p>
                <PeriodCalendarWidget fullWidth={true} />
                <div className="mt-6 bg-rose-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-rose-900 mb-2">Flow Intensity Guide</h3>
                  <ul className="space-y-2 text-rose-700">
                    <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-300 mr-2"></span> Light: Minimal flow, may only need panty liners</li>
                    <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span> Medium: Moderate flow, regular pad/tampon usage</li>
                    <li className="flex items-center"><span className="w-3 h-3 rounded-full bg-rose-700 mr-2"></span> Heavy: Heavy flow, frequent changing of pads/tampons</li>
                  </ul>
                </div>
              </div>
            )}
            
            {selectedTracker === "exercise" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Exercise Tracker</h2>
                <p className="mb-4 text-neutral-600">Track your physical activities and energy levels throughout your cycle.</p>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <Bike className="h-20 w-20 mx-auto text-primary opacity-50" />
                      <h3 className="font-bold mt-4">No Exercise Data Available</h3>
                      <p className="text-neutral-600 mt-2">Start tracking your workouts to see how your cycle affects your energy levels and performance.</p>
                    </div>
                    <Button className="w-full">Log Exercise</Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="educational" className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Educational Videos</h2>
          <p className="mb-6 text-neutral-600">Learn more about menstrual health, fertility, and pregnancy through these educational videos.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {educationalVideos.map((video, index) => (
              <VideoCard 
                key={index}
                title={video.title}
                thumbnail={video.thumbnail}
                duration={video.duration}
                url={video.url}
              />
            ))}
          </div>
          
          <div className="mt-8 bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Menstrual Health Education</h3>
            <p className="mb-4">Understanding your menstrual cycle is key to overall reproductive health. Here are some important phases:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card className="bg-rose-50 border-rose-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-rose-700 text-base">Menstrual Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-rose-600">Day 1-5: The uterine lining sheds, resulting in menstrual flow. Hormones are at their lowest.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-700 text-base">Follicular Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-600">Day 6-13: Estrogen rises as follicles in the ovary develop. Your body prepares for ovulation.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-700 text-base">Ovulation Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-600">Day 14: A mature egg is released from the ovary. This is when you're most fertile.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 text-base">Luteal Phase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600">Day 15-28: Progesterone rises to prepare for pregnancy. If no pregnancy occurs, this leads to menstruation.</p>
                </CardContent>
              </Card>
            </div>
            
            <Button variant="outline" className="mt-2" onClick={() => setActiveTab("trackers")}>
              Start Tracking Your Cycle
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Insights & Reports</h2>
          <p className="mb-6 text-neutral-600">View personalized insights and reports based on your tracking data.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Length Analysis</CardTitle>
                <CardDescription>View how your cycle length has changed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <LineChart className="h-20 w-20 text-gray-400" />
                  <p className="ml-4 text-gray-500">Tracking data required to generate insights</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSelectedTracker("period");
                  setActiveTab("trackers");
                }}>
                  Start Tracking
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Symptom Correlation</CardTitle>
                <CardDescription>See how symptoms correlate with your cycle phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <Activity className="h-20 w-20 text-gray-400" />
                  <p className="ml-4 text-gray-500">Tracking data required to generate insights</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => {
                  setSelectedTracker("symptoms");
                  setActiveTab("trackers");
                }}>
                  Track Symptoms
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" className="mr-2" onClick={() => setLocation("/tracker")}>
          Go to Simple Tracker
        </Button>
        <Button onClick={() => window.open('/dashboard', '_self')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default HealthTrackers;