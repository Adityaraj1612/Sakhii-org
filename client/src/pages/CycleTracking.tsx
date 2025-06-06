import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PeriodCalendarWidget from "@/components/dashboard/PeriodCalendarWidget";
import { useAuth } from "@/contexts/AuthContext";
import { format, addDays, subMonths, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { fetchPeriodData, calculateCycleStats, CycleStats } from "@/lib/periodTracking";
import { CalendarDays, Baby, LineChart, Bike, Clock, Droplets, Activity } from "lucide-react";

// Create a tracker card component for selecting different tracking types
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

// Educational card component for displaying cycle phase information
const CyclePhaseCard = ({
  title,
  description,
  color
}: {
  title: string,
  description: string,
  color: string
}) => {
  return (
    <Card className={`bg-${color}-50 border-${color}-200`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-${color}-700 text-base`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm text-${color}-600`}>{description}</p>
      </CardContent>
    </Card>
  );
};

const CycleTracking = () => {
  const [selectedTracker, setSelectedTracker] = useState<string>("period");
  const [loading, setLoading] = useState(true);
  const [cycleStats, setCycleStats] = useState<CycleStats | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const today = new Date();
        const startDate = subMonths(startOfMonth(today), 3);
        const endDate = addMonths(endOfMonth(today), 3);
        
        const data = await fetchPeriodData(user.uid, startDate, endDate);
        const stats = calculateCycleStats(data);
        
        setCycleStats(stats);
      } catch (error) {
        console.error("Error loading cycle data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Get the background color for the cycle phase
  const getCyclePhaseColor = (phase: string | null) => {
    switch (phase) {
      case 'menstrual':
        return 'bg-rose-100';
      case 'follicular':
        return 'bg-yellow-100';
      case 'ovulation':
        return 'bg-green-100';
      case 'luteal':
        return 'bg-blue-100';
      default:
        return 'bg-purple-100';
    }
  };

  // Get the display name for the cycle phase
  const getCyclePhaseName = (phase: string | null) => {
    switch (phase) {
      case 'menstrual':
        return 'Menstrual Phase';
      case 'follicular':
        return 'Follicular Phase';
      case 'ovulation':
        return 'Ovulation Phase';
      case 'luteal':
        return 'Luteal Phase';
      default:
        return 'Unknown Phase';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trackers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      </div>
      
      {selectedTracker === "period" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Current Cycle Phase</h2>
                
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Skeleton className="rounded-full w-48 h-48 mx-auto" />
                    <div className="mt-6 flex gap-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  </div>
                ) : !user ? (
                  <div className="text-center py-10">
                    <p>Sign in to track your cycle</p>
                  </div>
                ) : !cycleStats?.currentCyclePhase ? (
                  <div className="text-center py-10">
                    <p>No cycle data available yet</p>
                    <p className="text-sm text-neutral-500 mt-2">Track at least one period to see predictions</p>
                  </div>
                ) : (
                  <>
                    <div className={`rounded-full w-48 h-48 mx-auto ${getCyclePhaseColor(cycleStats.currentCyclePhase)} flex items-center justify-center`}>
                      <div className="text-center">
                        <div className="text-lg font-medium">{getCyclePhaseName(cycleStats.currentCyclePhase)}</div>
                        <div className="text-sm text-neutral-600">
                          {cycleStats.currentCycleDay ? `Day ${cycleStats.currentCycleDay}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {cycleStats.nextPeriodStartDate && (
                        <Badge variant="secondary">
                          Next Period: {format(cycleStats.nextPeriodStartDate, 'MMM d')}
                        </Badge>
                      )}
                      <Badge variant="secondary">
                        Cycle Length: {cycleStats.averageCycleLength} days
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                
                {loading ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : !user ? (
                  <div className="text-center py-10">
                    <p>Sign in to see your stats</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-600">Average Cycle</div>
                      <div className="text-2xl font-semibold">{cycleStats?.averageCycleLength || "-"} days</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-600">Period Length</div>
                      <div className="text-2xl font-semibold">{cycleStats?.averagePeriodLength || "-"} days</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-600">Last Period</div>
                      <div className="text-2xl font-semibold">
                        {cycleStats?.lastPeriodStartDate 
                          ? format(cycleStats.lastPeriodStartDate, 'MMM d')
                          : "-"}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-sm text-neutral-600">Next Fertile Window</div>
                      <div className="text-2xl font-semibold">
                        {cycleStats?.fertileWindowStart 
                          ? format(cycleStats.fertileWindowStart, 'MMM d')
                          : "-"}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <PeriodCalendarWidget fullWidth={true} />
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-bold mb-3">Understanding Your Cycle</h3>
            <p className="mb-4">Your menstrual cycle consists of several distinct phases, each with unique hormonal changes:</p>
            
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
          </div>
        </>
      )}
      
      {selectedTracker === "ovulation" && (
        <>
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Ovulation Tracker</CardTitle>
                <CardDescription>Track your most fertile days and optimize chances of conception</CardDescription>
              </CardHeader>
              <CardContent>
                <PeriodCalendarWidget fullWidth={true} />
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Your Ovulation Day</h3>
                    <p className="text-green-700 mb-3">
                      {cycleStats?.nextOvulationDate 
                        ? `Next ovulation predicted on ${format(cycleStats.nextOvulationDate, 'MMMM d, yyyy')}`
                        : "Track at least one period to see your predicted ovulation date"}
                    </p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Ovulation day is marked in green on the calendar</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Your Fertile Window</h3>
                    <p className="text-blue-700 mb-3">
                      {cycleStats?.fertileWindowStart && cycleStats?.fertileWindowEnd
                        ? `Fertile days from ${format(cycleStats.fertileWindowStart, 'MMMM d')} to ${format(cycleStats.fertileWindowEnd, 'MMMM d, yyyy')}`
                        : "Track at least one period to see your fertile window"}
                    </p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-300 mr-2"></div>
                      <span className="text-sm">Fertile days are marked in light blue on the calendar</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Signs of Ovulation</CardTitle>
                <CardDescription>Physical signs that may indicate you're ovulating</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">1</div>
                    <div>
                      <span className="font-medium">Change in cervical mucus</span>
                      <p className="text-sm text-neutral-600">Becomes clearer, slippery, and stretchy (similar to egg whites)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">2</div>
                    <div>
                      <span className="font-medium">Slight rise in basal body temperature</span>
                      <p className="text-sm text-neutral-600">Temperature rises by 0.5°F (0.3°C) after ovulation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">3</div>
                    <div>
                      <span className="font-medium">Mild pelvic or lower abdominal pain</span>
                      <p className="text-sm text-neutral-600">Known as mittelschmerz (German for "middle pain")</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">4</div>
                    <div>
                      <span className="font-medium">Slight spotting</span>
                      <p className="text-sm text-neutral-600">Light bleeding that may occur when the egg ruptures from the follicle</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-0.5">5</div>
                    <div>
                      <span className="font-medium">Increased sex drive</span>
                      <p className="text-sm text-neutral-600">Hormone changes may increase libido around ovulation</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Optimizing Conception</CardTitle>
                <CardDescription>Tips for increasing chances of pregnancy</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">1</div>
                    <div>
                      <span className="font-medium">Time intercourse correctly</span>
                      <p className="text-sm text-neutral-600">Have sex every 1-2 days during your fertile window</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">2</div>
                    <div>
                      <span className="font-medium">Maintain a healthy lifestyle</span>
                      <p className="text-sm text-neutral-600">Balanced diet, regular exercise, adequate sleep</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">3</div>
                    <div>
                      <span className="font-medium">Take prenatal vitamins</span>
                      <p className="text-sm text-neutral-600">Especially folic acid, at least 3 months before conception</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">4</div>
                    <div>
                      <span className="font-medium">Limit caffeine and alcohol</span>
                      <p className="text-sm text-neutral-600">Reduce or eliminate these substances when trying to conceive</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">5</div>
                    <div>
                      <span className="font-medium">Manage stress</span>
                      <p className="text-sm text-neutral-600">Practice relaxation techniques like meditation or yoga</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
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
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>First Trimester (Weeks 1-12)</CardTitle>
                <CardDescription>Baby's development in the first 12 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Weeks 1-4</h4>
                    <p className="text-sm text-neutral-600">Fertilization occurs and the fertilized egg implants in the uterus. The embryo begins to form basic structures.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Weeks 5-8</h4>
                    <p className="text-sm text-neutral-600">All major organs begin to form. The heart starts to beat. Tiny limb buds appear.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Weeks 9-12</h4>
                    <p className="text-sm text-neutral-600">Baby's face is forming with features becoming more distinct. Tiny fingernails develop. Gender becomes distinguishable.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Common First Trimester Symptoms</CardTitle>
                <CardDescription>Physical changes you might experience</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Morning sickness (nausea, sometimes with vomiting)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Fatigue and increased need for sleep</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Tender, swollen breasts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Food aversions or cravings</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Frequent urination</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Mood swings</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Headaches</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2 mt-1.5"></div>
                    <span>Constipation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleTracking;