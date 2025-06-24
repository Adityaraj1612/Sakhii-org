import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  format, 
  addDays, 
  subDays,
  differenceInDays,
  subMonths, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  isToday,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  getDay,
  parseISO
} from "date-fns";
import { 
  fetchPeriodData, 
  addPeriodData as addPeriodDataToFirestore,
  calculateCycleStats, 
  CycleStats 
} from "@/lib/periodTracking";
import { PeriodData } from "@/lib/calendar-utils";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Info, 
  Baby, 
  Target, 
  Thermometer,
  Droplets,
  Heart,
  TrendingUp,
  Clock,
  Scale,
  CheckCircle
} from "lucide-react";

// Phase guidance data
const phaseGuidance = {
  menstrual: {
    title: "Menstrual Phase (Days 1-5)",
    description: "Your period is here. Focus on rest and self-care.",
    toDo: [
      "Rest and get adequate sleep",
      "Stay hydrated with warm water",
      "Use heat therapy for cramps",
      "Practice gentle yoga or stretching",
      "Track your flow and symptoms"
    ],
    nutrition: [
      "Iron-rich foods (spinach, lentils, red meat)",
      "Magnesium for cramps (dark chocolate, nuts)",
      "Anti-inflammatory foods (ginger, turmeric)",
      "Vitamin C to aid iron absorption",
      "Warm herbal teas (chamomile, peppermint)"
    ],
    color: "bg-red-100 border-red-300 text-red-800"
  },
  follicular: {
    title: "Follicular Phase (Days 6-13)", 
    description: "Energy is rising. Great time for new activities and challenges.",
    toDo: [
      "Start new workout routines",
      "Plan important meetings or projects",
      "Try new recipes or activities",
      "Focus on learning and skill building",
      "Schedule social activities"
    ],
    nutrition: [
      "Protein for energy (eggs, fish, beans)",
      "Complex carbs (quinoa, oats, sweet potato)",
      "Fresh fruits and vegetables",
      "Healthy fats (avocado, olive oil)",
      "Probiotics for gut health"
    ],
    color: "bg-yellow-100 border-yellow-300 text-yellow-800"
  },
  ovulation: {
    title: "Ovulation Phase (Days 14-16)",
    description: "Peak fertility and energy. You're at your most social and confident.",
    toDo: [
      "Schedule important presentations",
      "Plan romantic dates or social events",
      "Take on challenging workouts",
      "Network and make connections",
      "Track ovulation signs if trying to conceive"
    ],
    nutrition: [
      "Antioxidant-rich foods (berries, leafy greens)",
      "Fiber for hormone balance (vegetables, fruits)",
      "Zinc for reproductive health (pumpkin seeds)",
      "B-vitamins (whole grains, leafy greens)",
      "Stay well hydrated"
    ],
    color: "bg-green-100 border-green-300 text-green-800"
  },
  luteal: {
    title: "Luteal Phase (Days 17-28)",
    description: "Energy may decline. Focus on completing projects and self-care.",
    toDo: [
      "Finish ongoing projects",
      "Practice stress management",
      "Maintain regular sleep schedule",
      "Do moderate exercise",
      "Prepare for next cycle"
    ],
    nutrition: [
      "Complex carbs for mood stability",
      "Calcium for PMS symptoms (dairy, leafy greens)",
      "Omega-3 for inflammation (fish, walnuts)",
      "Limit caffeine and alcohol",
      "Magnesium-rich foods for mood"
    ],
    color: "bg-purple-100 border-purple-300 text-purple-800"
  }
};

const Tracker = () => {
  const [cycleStats, setCycleStats] = useState<CycleStats | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [periodData, setPeriodData] = useState<PeriodData[]>([]);
  const [cycleDays, setCycleDays] = useState<{[key: string]: 'period' | 'ovulation' | 'fertile' | 'luteal' | null}>({});
  const [flowIntensity, setFlowIntensity] = useState<'light' | 'medium' | 'heavy' | null>('medium');
  const [painLevel, setPainLevel] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [moodRating, setMoodRating] = useState<string>('neutral');
  
  // Period logging states
  const [periodStartDate, setPeriodStartDate] = useState<string>('');
  const [periodEndDate, setPeriodEndDate] = useState<string>('');
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [averageCycleLength, setAverageCycleLength] = useState<number>(28);
  const [currentPhase, setCurrentPhase] = useState<'menstrual' | 'follicular' | 'ovulation' | 'luteal'>('luteal');
  const [nextPeriodDate, setNextPeriodDate] = useState<Date | null>(null);
  const [showPhaseGuidance, setShowPhaseGuidance] = useState(true);
  
  // Pregnancy tracking states
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyStartDate, setPregnancyStartDate] = useState<string>('');
  const [lastPeriodDatePregnancy, setLastPeriodDatePregnancy] = useState<Date | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [gestationWeeks, setGestationWeeks] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [pregnancyMilestones, setPregnancyMilestones] = useState<Array<{week: number, milestone: string}>>([]);
  const [babyKicks, setBabyKicks] = useState(0);
  const [pregnancyWeight, setPregnancyWeight] = useState<number | null>(null);
  const [pregnancySymptoms, setPregnancySymptoms] = useState<string[]>([]);
  const [pregnancyNotes, setPregnancyNotes] = useState('');
  
  // Ovulation tracking states
  const [bbt, setBbt] = useState<number>(98.2);
  const [cervicalMucus, setCervicalMucus] = useState<string>('dry');
  const [cervicalPosition, setCervicalPosition] = useState<string>('low');
  const [ovulationTest, setOvulationTest] = useState<string>('negative');
  const [fertilitySigns, setFertilitySigns] = useState<string[]>([]);
  const [ovulationNotes, setOvulationNotes] = useState('');
  const [nextOvulation, setNextOvulation] = useState<Date | null>(null);
  const [fertileWindow, setFertileWindow] = useState<{start: Date, end: Date} | null>(null);
  
  // Mucus types for ovulation tracker
  const mucusTypes = [
    { value: "dry", label: "Dry" },
    { value: "sticky", label: "Sticky" },
    { value: "creamy", label: "Creamy" },
    { value: "watery", label: "Watery" },
    { value: "egg-white", label: "Egg White (Most Fertile)" }
  ];

  // Fertility signs options for ovulation tracker
  const fertilitySignsOptions = [
    "Increased libido",
    "Breast tenderness",
    "Mild cramping",
    "Spotting",
    "Energy increase",
    "Mood changes",
    "Heightened senses"
  ];

  // Pregnancy weeks data
  const pregnancyWeeks = {
    1: { babySize: "Poppy Seed", development: "Fertilization occurs" },
    2: { babySize: "Poppy Seed", development: "Implantation begins" },
    3: { babySize: "Sesame Seed", development: "Neural tube forms" },
    4: { babySize: "Lentil", development: "Heart begins to beat" },
    5: { babySize: "Apple Seed", development: "Brain and spinal cord develop" },
    6: { babySize: "Sweet Pea", development: "Facial features form" },
    7: { babySize: "Blueberry", development: "Arms and legs develop" },
    8: { babySize: "Raspberry", development: "Fingers and toes form" },
    9: { babySize: "Cherry", development: "All major organs present" },
    10: { babySize: "Strawberry", development: "Joints can bend" },
    11: { babySize: "Lime", development: "Baby can hiccup" },
    12: { babySize: "Plum", development: "Reflexes develop" },
    13: { babySize: "Peach", development: "Vocal cords form" },
    14: { babySize: "Lemon", development: "Baby can make facial expressions" },
    15: { babySize: "Apple", development: "Baby can sense light" },
    16: { babySize: "Avocado", development: "Baby can hear sounds" },
    17: { babySize: "Pear", development: "Baby develops fat" },
    18: { babySize: "Sweet Potato", development: "Baby can yawn" },
    19: { babySize: "Mango", development: "Vernix forms" },
    20: { babySize: "Banana", development: "Halfway point!" },
    21: { babySize: "Carrot", development: "Baby can swallow" },
    22: { babySize: "Papaya", development: "Lips and eyelids form" },
    23: { babySize: "Grapefruit", development: "Baby can hear your voice" },
    24: { 
      babySize: "Corn", 
      development: "Baby's brain grows rapidly",
      motherChanges: [
        "You may notice increased fetal movement",
        "Back pain and leg cramps can occur",
        "Possible swelling in feet and ankles"
      ]
    },
    25: { babySize: "Rutabaga", development: "Baby responds to touch" },
    26: { babySize: "Lettuce", development: "Eyes begin to open" },
    27: { babySize: "Cauliflower", development: "Brain tissue develops" },
    28: { babySize: "Eggplant", development: "Baby can blink" },
    29: { babySize: "Butternut Squash", development: "Muscles and lungs mature" },
    30: { babySize: "Cabbage", development: "Baby practices breathing" },
    31: { babySize: "Coconut", development: "All five senses work" },
    32: { babySize: "Jicama", development: "Bones harden" },
    33: { babySize: "Pineapple", development: "Baby's immune system develops" },
    34: { babySize: "Cantaloupe", development: "Central nervous system matures" },
    35: { babySize: "Honeydew", development: "Kidneys are fully developed" },
    36: { babySize: "Romaine Lettuce", development: "Baby is gaining weight" },
    37: { babySize: "Swiss Chard", development: "Baby is considered full-term" },
    38: { babySize: "Leek", development: "Organs are mature" },
    39: { babySize: "Mini Watermelon", development: "Baby is ready for birth" },
    40: { babySize: "Pumpkin", development: "Due date!" }
  };

  // Calculate fertility score based on various factors
  const calculateFertilityScore = (): number => {
    let score = 0;
    
    // BBT scoring (higher temperature indicates post-ovulation)
    if (bbt >= 98.6) score += 3;
    else if (bbt >= 98.0) score += 2;
    else score += 1;
    
    // Cervical mucus scoring
    if (cervicalMucus === 'egg-white') score += 4;
    else if (cervicalMucus === 'watery') score += 3;
    else if (cervicalMucus === 'creamy') score += 2;
    else if (cervicalMucus === 'sticky') score += 1;
    
    // Ovulation test scoring
    if (ovulationTest === 'positive') score += 3;
    else if (ovulationTest === 'faint') score += 2;
    
    return Math.min(score, 10); // Cap at 10
  };
  
  const { user } = useAuth();
  const { toast } = useToast();

  const commonSymptoms = [
    "Headache", "Cramps", "Nausea", "Bloating", "Fatigue", "Backache"
  ];

  const moodOptions = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'irritable', label: 'Irritable', emoji: '😤' },
    { value: 'tired', label: 'Tired', emoji: '😴' }
  ];

  // Calculate cycle phases and predictions
  useEffect(() => {
    if (periodStartDate && periodLength && averageCycleLength) {
      const startDate = parseISO(periodStartDate);
      const today = new Date();
      const daysSinceStart = differenceInDays(today, startDate);
      const currentCycleDay = (daysSinceStart % averageCycleLength) + 1;
      
      // Calculate next period
      const cyclesCompleted = Math.floor(daysSinceStart / averageCycleLength);
      const nextPeriod = addDays(startDate, (cyclesCompleted + 1) * averageCycleLength);
      setNextPeriodDate(nextPeriod);
      
      // Determine current phase
      let phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
      if (currentCycleDay <= periodLength) {
        phase = 'menstrual';
      } else if (currentCycleDay <= 13) {
        phase = 'follicular';
      } else if (currentCycleDay >= 14 && currentCycleDay <= 16) {
        phase = 'ovulation';
      } else {
        phase = 'luteal';
      }
      setCurrentPhase(phase);
      
      // Generate calendar data
      const calendarData: {[key: string]: 'period' | 'ovulation' | 'fertile' | 'luteal' | null} = {};
      
      // Mark multiple cycles for better visualization
      for (let cycle = 0; cycle < 3; cycle++) {
        const cycleStartDate = addDays(startDate, cycle * averageCycleLength);
        
        // Period days
        for (let day = 0; day < periodLength; day++) {
          const date = addDays(cycleStartDate, day);
          calendarData[format(date, 'yyyy-MM-dd')] = 'period';
        }
        
        // Ovulation (around day 14)
        const ovulationDate = addDays(cycleStartDate, 13);
        calendarData[format(ovulationDate, 'yyyy-MM-dd')] = 'ovulation';
        calendarData[format(addDays(ovulationDate, 1), 'yyyy-MM-dd')] = 'ovulation';
        
        // Fertile window (5 days before ovulation + ovulation day)
        for (let day = -5; day <= 1; day++) {
          const fertileDate = addDays(ovulationDate, day);
          if (!calendarData[format(fertileDate, 'yyyy-MM-dd')]) {
            calendarData[format(fertileDate, 'yyyy-MM-dd')] = 'fertile';
          }
        }
        
        // Luteal phase
        for (let day = 17; day < averageCycleLength; day++) {
          const lutealDate = addDays(cycleStartDate, day);
          if (!calendarData[format(lutealDate, 'yyyy-MM-dd')]) {
            calendarData[format(lutealDate, 'yyyy-MM-dd')] = 'luteal';
          }
        }
      }
      
      setCycleDays(calendarData);
      
      // Update cycle stats
      setCycleStats({
        averageCycleLength,
        averagePeriodLength: periodLength,
        lastPeriodStartDate: startDate,
        nextPeriodStartDate: nextPeriod,
        fertileWindowStart: addDays(nextPeriod, -14 - 5),
        fertileWindowEnd: addDays(nextPeriod, -14 + 1),
        nextOvulationDate: addDays(nextPeriod, -14),
        currentCycleDay,
        currentCyclePhase: phase
      });
    }
  }, [periodStartDate, periodLength, averageCycleLength]);

  // Calendar rendering functions
  const renderCalendarHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prevMonth => subMonths(prevMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <Button 
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prevMonth => addMonths(prevMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderDayNames = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const firstDayOfWeek = getDay(firstDayOfMonth);
    
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth
    });
    
    const prevMonthDays = firstDayOfWeek > 0 
      ? eachDayOfInterval({
          start: subDays(firstDayOfMonth, firstDayOfWeek),
          end: subDays(firstDayOfMonth, 1)
        }) 
      : [];
    
    const totalDaysDisplayed = Math.ceil((daysInMonth.length + prevMonthDays.length) / 7) * 7;
    const nextMonthDaysCount = totalDaysDisplayed - daysInMonth.length - prevMonthDays.length;
    
    const nextMonthDays = nextMonthDaysCount > 0
      ? eachDayOfInterval({
          start: addDays(lastDayOfMonth, 1),
          end: addDays(lastDayOfMonth, nextMonthDaysCount)
        })
      : [];
    
    const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day, i) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isPeriodDay = cycleDays[dateKey] === 'period';
          const isOvulationDay = cycleDays[dateKey] === 'ovulation';
          const isFertileDay = cycleDays[dateKey] === 'fertile';
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          
          const phaseType = cycleDays[dateKey];
          
          let dayClassName = "h-10 w-10 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors";
          
          if (!isSameMonth(day, currentMonth)) {
            dayClassName += " text-gray-300";
          } else if (isSelected) {
            dayClassName += " bg-pink-600 text-white ring-2 ring-pink-300";
          } else if (phaseType === 'period') {
            dayClassName += " bg-red-500 text-white";
          } else if (phaseType === 'ovulation') {
            dayClassName += " bg-green-500 text-white";
          } else if (phaseType === 'fertile') {
            dayClassName += " bg-blue-200 text-blue-800";
          } else if (phaseType === 'luteal') {
            dayClassName += " bg-purple-200 text-purple-800";
          } else if (isToday(day)) {
            dayClassName += " border-2 border-pink-500 text-pink-600";
          } else {
            dayClassName += " hover:bg-gray-100";
          }
          
          return (
            <button 
              key={i} 
              className={dayClassName}
              onClick={() => setSelectedDate(day)}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    );
  };

  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const savePeriodEntry = async () => {
    if (!periodStartDate) {
      toast({
        title: "Error",
        description: "Please select when your period started.",
        variant: "destructive"
      });
      return;
    }
    
    if (periodEndDate && parseISO(periodEndDate) < parseISO(periodStartDate)) {
      toast({
        title: "Error", 
        description: "End date cannot be before start date.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate period length if end date is provided
    if (periodEndDate) {
      const length = differenceInDays(parseISO(periodEndDate), parseISO(periodStartDate)) + 1;
      setPeriodLength(length);
    }
    
    toast({
      title: "Success",
      description: "Your period data has been saved and calendar updated.",
    });
  };

  const saveSymptoms = async () => {
    toast({
      title: "Success", 
      description: "Your symptoms have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Tracker</h1>
          <p className="text-gray-600">Track your menstrual cycle, pregnancy, ovulation, and health patterns</p>
        </div>

        {/* Tracker Tabs */}
        <Tabs defaultValue="period" className="w-full">
          {/* Enhanced Tab Navigation - Smaller Size */}
          <div className="mb-8">
            <TabsList className="w-full h-auto bg-white shadow-lg rounded-xl p-2 border border-pink-100 flex flex-row justify-center items-center gap-1">
              <TabsTrigger 
                value="period" 
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-pink-50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                <span>Period Tracker</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pregnancy" 
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-purple-50"
              >
                <Baby className="h-4 w-4 mr-2" />
                <span>Pregnancy Tracker</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ovulation" 
                className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-green-50"
              >
                <Target className="h-4 w-4 mr-2" />
                <span>Ovulation Tracker</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Period Tracker Tab - Full Display */}
          <TabsContent value="period" className="min-h-[900px]">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 w-full h-full">
          {/* Left Column - Phase Information */}
          <div className="space-y-8 min-h-[750px]">
            {/* Current Cycle Phase */}
            <Card className="border-l-4 border-l-pink-500 shadow-xl min-h-[200px]">
              <CardHeader>
                <CardTitle>Current Cycle Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center ${phaseGuidance[currentPhase].color}`}>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase</div>
                      <div className="text-sm">Day {cycleStats?.currentCycleDay || 1}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Next Period: {nextPeriodDate ? differenceInDays(nextPeriodDate, new Date()) : 0} days</span>
                    <span>Cycle Length: {averageCycleLength} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Average Cycle</div>
                    <div className="text-xl font-semibold">{averageCycleLength} days</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Period Length</div>
                    <div className="text-xl font-semibold">{periodLength} days</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Last Period</div>
                    <div className="text-xl font-semibold">
                      {periodStartDate ? format(parseISO(periodStartDate), 'MMM d') : 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Next Period</div>
                    <div className="text-xl font-semibold">
                      {nextPeriodDate ? format(nextPeriodDate, 'MMM d') : 'Not calculated'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  My Period Calendar
                </CardTitle>
                <Select value="cycle">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cycle">Cycle View</SelectItem>
                    <SelectItem value="month">Month View</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {renderCalendarHeader()}
                {renderDayNames()}
                {renderCalendarDays()}
                
                {/* Calendar Legend */}
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Calendar Legend:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                      <span>Period Days</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span>Ovulation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-200 rounded-full mr-2"></div>
                      <span>Fertile Window</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-200 rounded-full mr-2"></div>
                      <span>Luteal Phase</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Data Entry */}
          <div className="space-y-8 min-h-[850px]">
            {/* Period Logging */}
            <Card>
              <CardHeader>
                <CardTitle>When Did Your Period Start?</CardTitle>
                <p className="text-sm text-gray-600">Log your period dates to track your cycle</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Period Start Date</Label>
                  <Input 
                    type="date" 
                    value={periodStartDate}
                    onChange={(e) => setPeriodStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Period End Date (Optional)</Label>
                  <Input 
                    type="date" 
                    value={periodEndDate}
                    onChange={(e) => setPeriodEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Typical Period Length: {periodLength} days</Label>
                  <Slider 
                    value={[periodLength]}
                    max={10}
                    min={2}
                    step={1}
                    className="mt-2"
                    onValueChange={(value) => setPeriodLength(value[0])}
                  />
                </div>
                
                <div>
                  <Label>Average Cycle Length: {averageCycleLength} days</Label>
                  <Slider 
                    value={[averageCycleLength]}
                    max={35}
                    min={21}
                    step={1}
                    className="mt-2"
                    onValueChange={(value) => setAverageCycleLength(value[0])}
                  />
                </div>

                <Button onClick={savePeriodEntry} className="w-full bg-pink-500 hover:bg-pink-600">
                  Save & Update Calendar
                </Button>
              </CardContent>
            </Card>
            
            {/* Phase Guidance */}
            {showPhaseGuidance && (
              <Card className={`border-2 ${phaseGuidance[currentPhase].color}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      {phaseGuidance[currentPhase].title}
                    </CardTitle>
                    <p className="text-sm mt-1">{phaseGuidance[currentPhase].description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowPhaseGuidance(false)}
                  >
                    ×
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">What to do:</h4>
                    <ul className="text-sm space-y-1">
                      {phaseGuidance[currentPhase].toDo.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Nutrition focus:</h4>
                    <ul className="text-sm space-y-1">
                      {phaseGuidance[currentPhase].nutrition.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Track Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>Track Symptoms</CardTitle>
                <p className="text-sm text-gray-600">How are you feeling today?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mood Selection */}
                <div>
                  <Label className="text-sm font-medium">Mood</Label>
                  <div className="flex space-x-2 mt-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setMoodRating(mood.value)}
                        className={`p-3 rounded-full border-2 transition-colors ${
                          moodRating === mood.value 
                            ? 'border-pink-500 bg-pink-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pain Level */}
                <div>
                  <Label>Pain Level</Label>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">None</span>
                    <Slider 
                      value={[painLevel]}
                      max={10}
                      step={1}
                      className="flex-1 mx-4"
                      onValueChange={(value) => setPainLevel(value[0])}
                    />
                    <span className="text-sm text-gray-600">Severe</span>
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-pink-600 font-medium">{painLevel}/10</span>
                  </div>
                </div>

                {/* Other Symptoms */}
                <div>
                  <Label>Other Symptoms</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox 
                          id={symptom}
                          checked={symptoms.includes(symptom)}
                          onCheckedChange={() => toggleSymptom(symptom)}
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <Textarea 
                    placeholder="Feeling more tired than usual today. Cramps started in the afternoon."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button onClick={saveSymptoms} className="w-full bg-pink-500 hover:bg-pink-600">
                  Save Symptoms
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

          {/* Pregnancy Tracker Tab */}
          <TabsContent value="pregnancy" className="flex-1 flex flex-col">
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 w-full min-h-0">
              {/* Main Pregnancy Content */}
              <div className="xl:col-span-2 flex flex-col space-y-6 lg:space-y-8 h-full">
                {/* Pregnancy Setup */}
                {!isPregnant ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Start Pregnancy Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Are you currently pregnant?</Label>
                        <div className="flex space-x-4 mt-2">
                          <Button 
                            variant={isPregnant ? "default" : "outline"}
                            onClick={() => setIsPregnant(true)}
                          >
                            Yes
                          </Button>
                          <Button 
                            variant={!isPregnant ? "default" : "outline"}
                            onClick={() => setIsPregnant(false)}
                          >
                            No
                          </Button>
                        </div>
                      </div>
                      
                      {isPregnant && (
                        <div>
                          <Label>Last Menstrual Period Date</Label>
                          <Input 
                            type="date" 
                            value={pregnancyStartDate}
                            onChange={(e) => {
                              setPregnancyStartDate(e.target.value);
                              if (e.target.value) {
                                const startDate = parseISO(e.target.value);
                                const due = addDays(startDate, 280); // 40 weeks
                                setDueDate(due);
                                const weeks = Math.floor(differenceInDays(new Date(), startDate) / 7);
                                setCurrentWeek(weeks);
                              }
                            }}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Current Week Display */}
                    <Card>
                      <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-2xl">Week {currentWeek}</CardTitle>
                            <p className="text-gray-600">{currentWeek} weeks pregnant</p>
                          </div>
                          <Progress value={(currentWeek / 40) * 100} className="w-32" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🥭</span>
                            </div>
                            <h3 className="font-semibold text-lg">{pregnancyWeeks[24]?.babySize || "Growing Baby"}</h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600">Weight: Developing</p>
                              <p className="text-sm text-gray-600">Length: Measuring</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Mother's Changes</h4>
                            <ul className="text-sm space-y-1">
                              {pregnancyWeeks[24]?.motherChanges?.map((change, index) => (
                                <li key={index}>• {change}</li>
                              )) || <li>• Body adapting to pregnancy</li>}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Baby's Development</h4>
                            <ul className="text-sm space-y-1">
                              <li>• {pregnancyWeeks[24]?.development || "Growing and developing"}</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Daily Pregnancy Tracking */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Tracking</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Current Weight (lbs)</Label>
                          <Input 
                            type="number" 
                            value={pregnancyWeight || ''}
                            onChange={(e) => setPregnancyWeight(parseFloat(e.target.value))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label>Baby Kicks Today</Label>
                          <div className="flex items-center space-x-4 mt-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setBabyKicks(Math.max(0, babyKicks - 1))}
                            >
                              -
                            </Button>
                            <span className="text-lg font-semibold">{babyKicks}</span>
                            <Button 
                              variant="outline" 
                              onClick={() => setBabyKicks(babyKicks + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Today's Symptoms</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {['Morning sickness', 'Fatigue', 'Back pain', 'Heartburn', 'Leg cramps', 'Mood swings'].map((symptom) => (
                              <div key={symptom} className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={pregnancySymptoms.includes(symptom)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setPregnancySymptoms([...pregnancySymptoms, symptom]);
                                    } else {
                                      setPregnancySymptoms(pregnancySymptoms.filter(s => s !== symptom));
                                    }
                                  }}
                                />
                                <Label className="text-sm">{symptom}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Notes</Label>
                          <Textarea 
                            value={pregnancyNotes}
                            onChange={(e) => setPregnancyNotes(e.target.value)}
                            placeholder="How are you feeling today?"
                            className="mt-1"
                          />
                        </div>
                        
                        <Button className="w-full bg-pink-500 hover:bg-pink-600">
                          Save Pregnancy Data
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              {/* Pregnancy Sidebar */}
              <div className="space-y-6 w-full">
                {isPregnant && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Due Date</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-600 mb-2">
                            {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Not calculated'}
                          </div>
                          <p className="text-sm text-gray-600">
                            {dueDate ? `${differenceInDays(dueDate, new Date())} days to go` : ''}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Tools</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Due Date Calculator
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Hospital Bag Checklist
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Scale className="h-4 w-4 mr-2" />
                          Weight Tracker
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Ovulation Tracker Tab */}
          <TabsContent value="ovulation" className="flex-1 flex flex-col">
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 w-full min-h-0">
              {/* Ovulation Main Content */}
              <div className="xl:col-span-2 flex flex-col space-y-6 lg:space-y-8 h-full">
                {/* Ovulation Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Ovulation Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderCalendarHeader()}
                    {renderDayNames()}
                    {renderCalendarDays()}
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium mb-2">Ovulation Legend:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                          <span>Ovulation Day</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-200 rounded-full mr-2"></div>
                          <span>Fertile Window</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-orange-400 rounded-full mr-2"></div>
                          <span>BBT Rise</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                          <span>Period</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Ovulation Tracking */}
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Ovulation Signs - {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-2" />
                          Basal Body Temperature (°F)
                        </Label>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="96"
                          max="100"
                          value={bbt}
                          onChange={(e) => setBbt(parseFloat(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Cervical Mucus</Label>
                        <Select value={cervicalMucus} onValueChange={setCervicalMucus}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mucusTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Ovulation Test Result</Label>
                      <RadioGroup value={ovulationTest} onValueChange={setOvulationTest} className="mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="negative" id="negative" />
                          <Label htmlFor="negative">Negative</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="positive" id="positive" />
                          <Label htmlFor="positive">Positive (Peak)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>Fertility Signs</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {fertilitySignsOptions.map((sign) => (
                          <div key={sign} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={fertilitySigns.includes(sign)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFertilitySigns([...fertilitySigns, sign]);
                                } else {
                                  setFertilitySigns(fertilitySigns.filter(s => s !== sign));
                                }
                              }}
                            />
                            <Label className="text-sm">{sign}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Notes</Label>
                      <Textarea 
                        value={ovulationNotes}
                        onChange={(e) => setOvulationNotes(e.target.value)}
                        placeholder="Any additional observations..."
                        className="mt-1"
                      />
                    </div>
                    
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                      Save Ovulation Data
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Ovulation Sidebar */}
              <div className="space-y-6 w-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Fertility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-pink-600 mb-2">{calculateFertilityScore()}/10</div>
                      <Progress value={calculateFertilityScore() * 10} className="mb-4" />
                      <p className="text-sm text-gray-600">
                        {calculateFertilityScore() >= 7 ? 'High fertility!' : 
                         calculateFertilityScore() >= 4 ? 'Moderate fertility' : 'Low fertility'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Predictions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Next Ovulation</h4>
                      <p className="text-green-700">
                        {nextOvulation ? format(nextOvulation, 'MMM d, yyyy') : 'Set cycle info to predict'}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Fertile Window</h4>
                      {fertileWindow ? (
                        <p className="text-blue-700">
                          {format(fertileWindow.start, 'MMM d')} - {format(fertileWindow.end, 'MMM d')}
                        </p>
                      ) : (
                        <p className="text-blue-700">Set cycle info to predict</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tracker;