
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import BBTChart from "@/components/BBTChart";
const [bbtEntries, setBbtEntries] = useState<{ date: string; temperature: number }[]>([]);

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
  parse
} from "date-fns";
import { 
  fetchPeriodData, 
  addPeriodData as addPeriodDataToFirestore,
  calculateCycleStats, 
  CycleStats 
} from "@/lib/periodTracking";
import { PeriodData } from "@/lib/calendar-utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Types for our cycle calculator form
interface CycleCalculatorForm {
  lastPeriodDate: Date | null;
  cycleLength: number;
  periodLength: number;
}

const Tracker = () => {
  const [activeTab, setActiveTab] = useState("period");
  const [loading, setLoading] = useState(true);
  const [cycleStats, setCycleStats] = useState<CycleStats | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [cycleForm, setCycleForm] = useState<CycleCalculatorForm>({
    lastPeriodDate: new Date(),
    cycleLength: 28,
    periodLength: 5
  });
  const [periodData, setPeriodData] = useState<PeriodData[]>([]);
  const [cycleDays, setCycleDays] = useState<{[key: string]: 'period' | 'ovulation' | 'fertile' | null}>({});
  const [flowIntensity, setFlowIntensity] = useState<'light' | 'medium' | 'heavy' | null>('medium');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isPredictionGenerated, setIsPredictionGenerated] = useState(false);
  const [bbtValue, setBbtValue] = useState<number | null>(null);
  const [cervicalMucus, setCervicalMucus] = useState<string>("creamy");
  const [fertilityChecks, setFertilityChecks] = useState({
    mittelschmerz: false,
    increasedLibido: false,
    breastTenderness: false,
    bloating: false
  });
  const [isFertilitySigns, setIsFertilitySigns] = useState(false);
  
  // Pregnancy tracker states
  const [lastPeriodDatePregnancy, setLastPeriodDatePregnancy] = useState<Date | null>(null);
  const [isPregnant, setIsPregnant] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [gestationWeeks, setGestationWeeks] = useState<number | null>(null);
  const [pregnancyMilestones, setPregnancyMilestones] = useState<{week: number, milestone: string}[]>([]);
  
  const commonSymptoms = [
    "Cramps", "Headache", "Bloating", "Fatigue", 
    "Mood Swings", "Backache", "Acne", "Tender Breasts"
  ];

  const { user } = useAuth();
  const { toast } = useToast();

  // Load period data when the component mounts or user changes
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
        setPeriodData(data);
        setCycleStats(stats);
        
        if (stats.lastPeriodStartDate) {
          setCycleForm({
            lastPeriodDate: stats.lastPeriodStartDate,
            cycleLength: stats.averageCycleLength,
            periodLength: stats.averagePeriodLength
          });
        }
        
        // Transform data for calendar display
        const transformedData: {[key: string]: 'period' | 'ovulation' | 'fertile' | null} = {};
        
        data.forEach(entry => {
          const dateStr = format(entry.date, 'yyyy-MM-dd');
          
          if (entry.isPeriod) {
            transformedData[dateStr] = 'period';
          } else if (entry.isOvulation) {
            transformedData[dateStr] = 'ovulation';
          } else if (entry.notes?.includes('Fertile')) {
            transformedData[dateStr] = 'fertile';
          }
        });
        
        setCycleDays(transformedData);
      } catch (error) {
        console.error("Error loading cycle data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // When selected date changes, update the form values
  useEffect(() => {
    if (selectedDate) {
      // Find if there's data for this date
      const dateData = periodData.find(data => 
        isSameDay(data.date, selectedDate)
      );
      
      if (dateData) {
        setFlowIntensity(dateData.flow || null);
        setSymptoms(dateData.symptoms || []);
        setNotes(dateData.notes || '');
      } else {
        // Reset form for a new entry
        setFlowIntensity('medium');
        setSymptoms([]);
        setNotes('');
      }
    }
  }, [selectedDate, periodData]);

  // Save period entry
  const savePeriodEntry = async () => {
    if (!user?.uid || !selectedDate) {
      toast({
        title: "Error",
        description: "You must be logged in and select a date to save an entry.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const entry: PeriodData = {
        date: selectedDate,
        isPeriod: true,
        isOvulation: false,
        flow: flowIntensity,
        symptoms,
        notes
      };
      
      await addPeriodDataToFirestore(user.uid, entry);
      
      toast({
        title: "Success",
        description: "Your period data has been saved.",
      });
      
      // Refresh data
      const today = new Date();
      const startDate = subMonths(startOfMonth(today), 3);
      const endDate = addMonths(endOfMonth(today), 3);
      
      const data = await fetchPeriodData(user.uid, startDate, endDate);
      const stats = calculateCycleStats(data);
      setPeriodData(data);
      setCycleStats(stats);
      
      // Update transformedData
      const transformedData: {[key: string]: 'period' | 'ovulation' | 'fertile' | null} = {};
      
      data.forEach(entry => {
        const dateStr = format(entry.date, 'yyyy-MM-dd');
        
        if (entry.isPeriod) {
          transformedData[dateStr] = 'period';
        } else if (entry.isOvulation) {
          transformedData[dateStr] = 'ovulation';
        } else if (entry.notes?.includes('Fertile')) {
          transformedData[dateStr] = 'fertile';
        }
      });
      
      setCycleDays(transformedData);
    } catch (error) {
      console.error("Error saving period data:", error);
      toast({
        title: "Error",
        description: "Failed to save your period data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate predictions based on form input
  const calculatePredictions = () => {
    if (!cycleForm.lastPeriodDate) {
      toast({
        title: "Missing Information",
        description: "Please select your last period start date.",
        variant: "destructive",
      });
      return;
    }
    
    // Get the current date
    const today = new Date();
    
    // Calculate days since last period
    const daysSinceLastPeriod = differenceInDays(today, cycleForm.lastPeriodDate);
    
    // First, find the most recent completed cycle
    const cyclesCompleted = Math.floor(daysSinceLastPeriod / cycleForm.cycleLength);
    
    // Calculate the start of the current cycle
    const currentCycleStartDate = addDays(cycleForm.lastPeriodDate, cyclesCompleted * cycleForm.cycleLength);
    
    // Next expected period is one cycle length after the current cycle start
    const nextPeriodDate = addDays(currentCycleStartDate, cycleForm.cycleLength);
    
    // Calculate ovulation (typically 14 days before next period)
    const ovulationStartDate = subDays(nextPeriodDate, 14);
    const ovulationEndDate = addDays(ovulationStartDate, 1);
    
    // Calculate fertile window (typically 5 days before and 1 day after ovulation)
    const fertileWindowStart = subDays(ovulationStartDate, 5);
    const fertileWindowEnd = addDays(ovulationStartDate, 1);
    
    return {
      nextPeriodDate,
      ovulationStartDate,
      ovulationEndDate,
      fertileWindowStart,
      fertileWindowEnd
    };
  };

  // Calendar rendering functions
  const renderCalendarHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentMonth(prevMonth => subMonths(prevMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          &lt;
        </button>
        <div className="text-base font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button 
          onClick={() => setCurrentMonth(prevMonth => addMonths(prevMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          &gt;
        </button>
      </div>
    );
  };

  const renderDayNames = () => {
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarDays = () => {
    // Get first day of the month
    const firstDayOfMonth = startOfMonth(currentMonth);
    
    // Get last day of the month
    const lastDayOfMonth = endOfMonth(currentMonth);
    
    // Get day of the week of the first day (0-6, where 0 is Sunday)
    const firstDayOfWeek = getDay(firstDayOfMonth);
    
    // Get all days in the month
    const daysInMonth = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth
    });
    
    // Get days from the previous month to fill the first week
    const prevMonthDays = firstDayOfWeek > 0 
      ? eachDayOfInterval({
          start: subDays(firstDayOfMonth, firstDayOfWeek),
          end: subDays(firstDayOfMonth, 1)
        }) 
      : [];
    
    // Calculate how many days from the next month we need to fill the last row
    const totalDaysDisplayed = Math.ceil((daysInMonth.length + prevMonthDays.length) / 7) * 7;
    const nextMonthDaysCount = totalDaysDisplayed - daysInMonth.length - prevMonthDays.length;
    
    // Get days from the next month
    const nextMonthDays = nextMonthDaysCount > 0
      ? eachDayOfInterval({
          start: addDays(lastDayOfMonth, 1),
          end: addDays(lastDayOfMonth, nextMonthDaysCount)
        })
      : [];
    
    // Combine all days
    const allDays = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day, i) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const isPeriodDay = cycleDays[dateKey] === 'period';
          const isOvulationDay = cycleDays[dateKey] === 'ovulation';
          const isFertileDay = cycleDays[dateKey] === 'fertile';
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          
          // Style based on day type
          let dayClassName = "h-8 w-8 flex items-center justify-center rounded-full text-sm";
          
          if (!isSameMonth(day, currentMonth)) {
            dayClassName += " text-gray-300";
          } else if (isSelected) {
            dayClassName += " bg-rose-600 text-white";
          } else if (isPeriodDay) {
            dayClassName += " bg-rose-500 text-white";
          } else if (isOvulationDay) {
            dayClassName += " bg-primary text-white";
          } else if (isFertileDay) {
            dayClassName += " bg-primary/20 text-primary";
          } else if (isToday(day)) {
            dayClassName += " border border-primary";
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

  // Toggle symptom selection
  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };
  
  // Helper function to check if a date is between two dates (inclusive)
  const isDateBetween = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  };
  
  // Handle predict button click for period tracker
  const handlePredictClick = () => {
    if (!cycleForm.lastPeriodDate) {
      toast({
        title: "Missing Information",
        description: "Please select your last period start date to generate predictions.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate cycle stats based on the form inputs
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, cycleForm.lastPeriodDate);
    const currentCycleDay = (daysSinceLastPeriod % cycleForm.cycleLength) + 1;
    
    // Determine current phase
    let currentPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | null = null;
    
    if (currentCycleDay <= cycleForm.periodLength) {
      currentPhase = 'menstrual';
    } else if (currentCycleDay <= cycleForm.cycleLength - 16) {
      currentPhase = 'follicular';
    } else if (currentCycleDay >= cycleForm.cycleLength - 15 && currentCycleDay <= cycleForm.cycleLength - 13) {
      currentPhase = 'ovulation';
    } else {
      currentPhase = 'luteal';
    }
    
    // Calculate next period and ovulation
    // First, find the most recent completed cycle
    const cyclesCompleted = Math.floor(daysSinceLastPeriod / cycleForm.cycleLength);
    
    // Calculate the start of the current cycle
    const currentCycleStartDate = addDays(cycleForm.lastPeriodDate, cyclesCompleted * cycleForm.cycleLength);
    
    // Next expected period is one cycle length after the current cycle start
    const nextPeriodStartDate = addDays(currentCycleStartDate, cycleForm.cycleLength);
    
    // Ovulation typically occurs 14 days before next period start
    const nextOvulationDate = subDays(nextPeriodStartDate, 14);
    
    // Fertile window is typically 5 days before and 1 day after ovulation
    const fertileWindowStart = subDays(nextOvulationDate, 5);
    const fertileWindowEnd = addDays(nextOvulationDate, 1);
    
    // Update cycle stats
    setCycleStats({
      averageCycleLength: cycleForm.cycleLength,
      averagePeriodLength: cycleForm.periodLength,
      lastPeriodStartDate: cycleForm.lastPeriodDate,
      nextPeriodStartDate: nextPeriodStartDate,
      fertileWindowStart: fertileWindowStart,
      fertileWindowEnd: fertileWindowEnd,
      nextOvulationDate: nextOvulationDate,
      currentCycleDay: currentCycleDay,
      currentCyclePhase: currentPhase
    });
    
    setIsPredictionGenerated(true);
    
    toast({
      title: "Predictions Generated",
      description: "Your cycle predictions have been calculated based on the information provided.",
    });
  };
  
  // Handle predict button click for ovulation tracker
  const handleOvulationPredict = () => {
    if (!cycleForm.lastPeriodDate) {
      toast({
        title: "Missing Information",
        description: "Please set your last period start date in the Period Tracker tab first.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if any fertility signs are present
    const hasFertilitySigns = Object.values(fertilityChecks).some(value => value);
    setIsFertilitySigns(hasFertilitySigns);
    
    // Calculate fertility window based on cycle information
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, cycleForm.lastPeriodDate);
    const currentCycleDay = (daysSinceLastPeriod % cycleForm.cycleLength) + 1;
    
    // Determine current phase with focus on fertility
    let currentPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | null = null;
    
    if (currentCycleDay <= cycleForm.periodLength) {
      currentPhase = 'menstrual';
    } else if (currentCycleDay <= cycleForm.cycleLength - 16) {
      currentPhase = 'follicular';
    } else if (currentCycleDay >= cycleForm.cycleLength - 15 && currentCycleDay <= cycleForm.cycleLength - 13) {
      currentPhase = 'ovulation';
    } else {
      currentPhase = 'luteal';
    }
    
    // Calculate ovulation and fertile window using correct prediction method
    // First, find the most recent completed cycle
    const cyclesCompleted = Math.floor(daysSinceLastPeriod / cycleForm.cycleLength);
    
    // Calculate the start of the current cycle
    const currentCycleStartDate = addDays(cycleForm.lastPeriodDate, cyclesCompleted * cycleForm.cycleLength);
    
    // Next expected period is one cycle length after the current cycle start
    const nextPeriodStartDate = addDays(currentCycleStartDate, cycleForm.cycleLength);
    
    // Ovulation typically occurs 14 days before next period start
    const nextOvulationDate = subDays(nextPeriodStartDate, 14);
    
    // Fertile window is typically 5 days before and 1 day after ovulation
    const fertileWindowStart = subDays(nextOvulationDate, 5);
    const fertileWindowEnd = addDays(nextOvulationDate, 1);
    
    // Update cycle stats with fertility focus
    setCycleStats({
      averageCycleLength: cycleForm.cycleLength,
      averagePeriodLength: cycleForm.periodLength,
      lastPeriodStartDate: cycleForm.lastPeriodDate,
      nextPeriodStartDate: nextPeriodStartDate,
      fertileWindowStart: fertileWindowStart,
      fertileWindowEnd: fertileWindowEnd,
      nextOvulationDate: nextOvulationDate,
      currentCycleDay: currentCycleDay,
      currentCyclePhase: currentPhase
    });
    
    // Additional fertility scoring based on BBT and cervical mucus
    let fertilityScore = 0;
    
    if (bbtValue && bbtValue > 98.6) fertilityScore += 2;
    if (cervicalMucus === 'eggWhite') fertilityScore += 3;
    if (cervicalMucus === 'watery') fertilityScore += 2;
    if (fertilityChecks.mittelschmerz) fertilityScore += 2;
    
    // Show feedback based on fertility score
    if (fertilityScore >= 5) {
      toast({
        title: "High Fertility Detected",
        description: "Your symptoms indicate you may be in your fertile window.",
      });
    } else {
      toast({
        title: "Fertility Prediction Generated",
        description: "Your fertility prediction has been calculated based on your cycle and symptoms.",
      });
    }
  };
  
  // Handle predict button click for pregnancy tracker
  const handlePregnancyPredict = () => {
    if (!lastPeriodDatePregnancy) {
      toast({
        title: "Missing Information",
        description: "Please select the first day of your last period.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate due date (280 days or 40 weeks from LMP)
    const calculatedDueDate = addDays(lastPeriodDatePregnancy, 280);
    setDueDate(calculatedDueDate);
    
    // Calculate current gestation (in weeks)
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodDatePregnancy);
    const weeksPregnant = Math.floor(daysSinceLastPeriod / 7);
    setGestationWeeks(weeksPregnant);
    
    // Generate pregnancy milestones
    const milestones = [
      { week: 4, milestone: "Your baby's heart begins to beat" },
      { week: 8, milestone: "All essential organs have begun to form" },
      { week: 12, milestone: "End of first trimester" },
      { week: 16, milestone: "You may begin to feel baby movements" },
      { week: 20, milestone: "Halfway point; anatomy scan ultrasound" },
      { week: 24, milestone: "Baby's hearing is developing" },
      { week: 28, milestone: "Baby's eyes can open and close" },
      { week: 32, milestone: "Baby practices breathing movements" },
      { week: 36, milestone: "Baby is considered full term" },
      { week: 40, milestone: "Your due date" }
    ];
    
    setPregnancyMilestones(milestones);
    setIsPregnant(true);
    
    toast({
      title: "Pregnancy Information Generated",
      description: `Your due date is ${format(calculatedDueDate, 'MMMM d, yyyy')}. You are ${weeksPregnant} weeks pregnant.`,
    });
  };

  const predictions = cycleForm.lastPeriodDate ? calculatePredictions() : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Health Cycle Tracker</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="w-full bg-gray-100 p-1">
          <TabsTrigger value="period" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" /> Period Tracker
          </TabsTrigger>
          <TabsTrigger value="ovulation" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CalendarIcon2 className="mr-2 h-4 w-4 text-violet-500" /> Ovulation Tracker
          </TabsTrigger>
          <TabsTrigger value="pregnancy" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" /> Pregnancy Tracker
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="period" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Cycle Calculator */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Calculate Your Cycle</h2>
                <p className="text-sm text-gray-500 mb-4">Enter your cycle details to predict future periods and fertile windows</p>
                
                <div className="space-y-4">
                  <div>
                    <Label>First day of last period</Label>
                    <div className="mt-2 flex flex-col">
                      {renderCalendarHeader()}
                      {renderDayNames()}
                      {renderCalendarDays()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cycleLength">Average cycle length (days)</Label>
                    <Select
                      value={cycleForm.cycleLength.toString()}
                      onValueChange={(value) => setCycleForm({...cycleForm, cycleLength: parseInt(value)})}
                    >
                      <SelectTrigger id="cycleLength">
                        <SelectValue placeholder="28 days" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 15}, (_, i) => i + 21).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} days
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="periodLength">Average period duration (days)</Label>
                    <Select
                      value={cycleForm.periodLength.toString()}
                      onValueChange={(value) => setCycleForm({...cycleForm, periodLength: parseInt(value)})}
                    >
                      <SelectTrigger id="periodLength">
                        <SelectValue placeholder="5 days" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 10}, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} days
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full mt-4 bg-rose-500 hover:bg-rose-600 text-white"
                    onClick={handlePredictClick}
                  >
                    Predict Cycle
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Column: Predictions */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Your Predictions</h2>
                <p className="text-sm text-gray-500 mb-4">Important dates in your cycle</p>
                
                {!cycleForm.lastPeriodDate ? (
                  <div className="text-center py-6">
                    <p>Please select your last period date to see predictions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Next Period</span>
                      <span className="text-rose-500 font-medium">
                        {predictions ? format(predictions.nextPeriodDate, 'MMM do, yyyy') : 'May 7th, 2025'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Ovulation</span>
                      <span className="text-violet-500 font-medium">
                        {predictions 
                          ? `${format(predictions.ovulationStartDate, 'MMM do')} - ${format(predictions.ovulationEndDate, 'MMM do, yyyy')}`
                          : 'April 21st, 2025 - April 25th, 2025'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Fertile Window</span>
                      <span className="text-green-500 font-medium">
                        {predictions 
                          ? `${format(predictions.fertileWindowStart, 'MMM do')} - ${format(predictions.fertileWindowEnd, 'MMM do, yyyy')}`
                          : 'April 18th, 2025 - April 24th, 2025'}
                      </span>
                    </div>
                    
                    <div className={cn(
                      "p-4 rounded-lg mt-4",
                      cycleStats?.currentCyclePhase === 'menstrual' && "bg-rose-50",
                      cycleStats?.currentCyclePhase === 'follicular' && "bg-amber-50",
                      cycleStats?.currentCyclePhase === 'ovulation' && "bg-green-50",
                      cycleStats?.currentCyclePhase === 'luteal' && "bg-blue-50",
                      !cycleStats?.currentCyclePhase && "bg-gray-50"
                    )}>
                      <h3 className="font-medium mb-2">
                        Current Phase: {cycleStats?.currentCyclePhase ? (
                          <span className="capitalize">{cycleStats.currentCyclePhase}</span>
                        ) : (
                          <span>Unknown</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cycleStats?.currentCyclePhase === 'menstrual' && 
                          "During menstruation, your body sheds the uterine lining. Track your flow, symptoms, and self-care practices."}
                        {cycleStats?.currentCyclePhase === 'follicular' && 
                          "During the follicular phase, your body is preparing for ovulation. Energy levels typically rise during this time."}
                        {cycleStats?.currentCyclePhase === 'ovulation' && 
                          "During ovulation, an egg is released from your ovary. This is your most fertile time."}
                        {cycleStats?.currentCyclePhase === 'luteal' && 
                          "During the luteal phase, your body prepares for possible pregnancy. You may experience PMS symptoms."}
                        {!cycleStats?.currentCyclePhase && 
                          "Click 'Predict Cycle' to determine your current cycle phase."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Period Data Logger */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Log Your Period Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Track symptoms, flow, and notes for each day</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Select Date</h3>
                  <div className="mt-2 flex flex-col">
                    {renderCalendarHeader()}
                    {renderDayNames()}
                    {renderCalendarDays()}
                  </div>
                </div>
                
                {selectedDate && (
                  <>
                    <div>
                      <h3 className="text-base font-medium mb-2">Flow Intensity</h3>
                      <RadioGroup 
                        value={flowIntensity || ''} 
                        onValueChange={(value) => setFlowIntensity(value as 'light' | 'medium' | 'heavy')}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="light" id="light" />
                          <Label htmlFor="light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="heavy" id="heavy" />
                          <Label htmlFor="heavy">Heavy</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2">Symptoms</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {commonSymptoms.map(symptom => (
                          <div key={symptom} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`symptom-${symptom}`} 
                              checked={symptoms.includes(symptom)}
                              onCheckedChange={() => toggleSymptom(symptom)}
                            />
                            <Label htmlFor={`symptom-${symptom}`}>{symptom}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-2">Notes</h3>
                      <Textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about how you're feeling today..."
                      />
                    </div>
                    
                    <Button onClick={savePeriodEntry}>Save Entry</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Educational Content */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">tracker.education.title</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">tracker.education.cycleBasics</h3>
                  <div className="aspect-video bg-gray-200 mb-4 rounded-md overflow-hidden">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/WOi2Bwvp6hw" 
                      title="Understanding Menstrual Cycle" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">tracker.education.cycleBasicsDesc</p>
                  <Button variant="link" className="text-rose-500 p-0">Learn more</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">tracker.education.hormoneHealth</h3>
                  <div className="aspect-video bg-gray-200 mb-4 rounded-md overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Video unavailable
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">tracker.education.hormoneHealthDesc</p>
                  <Button variant="link" className="text-rose-500 p-0">Learn more</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-2">Nutrition & Your Cycle</h3>
                  <div className="aspect-video bg-gray-200 mb-4 rounded-md overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Video unavailable
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Discover how to maintain optimal hormonal balance through nutrition</p>
                  <Button variant="link" className="text-rose-500 p-0">Learn more</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ovulation" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Fertility Inputs */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Fertility Tracking</h2>
                <p className="text-sm text-gray-500 mb-4">Track your fertile window and ovulation to optimize conception chances</p>
                
                <div className="space-y-6">
                  <div>
                  
                <Label htmlFor="bbt">Basal Body Temperature (°F)</Label>
<Input 
  id="bbt" 
  type="number" 
  step="0.01"
  value={bbtValue ?? ""}
  onChange={(e) => setBbtValue(parseFloat(e.target.value))}
  placeholder="97.8"
  className="mt-1"
/>
<p className="text-xs text-gray-500 mt-1">Temperature above 98.6°F may indicate ovulation</p>

<Button
  variant="secondary"
  className="mt-2"
  onClick={() => {
    if (!selectedDate || !bbtValue) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const updated = [
      ...bbtEntries.filter(entry => entry.date !== dateStr),
      {
        date: dateStr,
        temperature: bbtValue,
      }
    ];

    setBbtEntries(updated);

    toast({
      title: "BBT Logged",
      description: `Temperature ${bbtValue}°F saved for ${dateStr}.`,
    });
  }}
>
  Save BBT
</Button>

                  </div>
                  
                  <div>
                    <Label htmlFor="cervicalMucus">Cervical Mucus Consistency</Label>
                    <Select defaultValue="creamy">
                      <SelectTrigger id="cervicalMucus" className="mt-1">
                        <SelectValue placeholder="Select consistency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dry">Dry or None</SelectItem>
                        <SelectItem value="sticky">Sticky</SelectItem>
                        <SelectItem value="creamy">Creamy</SelectItem>
                        <SelectItem value="watery">Watery</SelectItem>
                        <SelectItem value="eggWhite">Egg White (Stretchy)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Egg white consistency indicates peak fertility</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Other Fertility Signs</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="mittelschmerz" />
                        <Label htmlFor="mittelschmerz">Mittelschmerz (Ovulation Pain)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="increasedLibido" />
                        <Label htmlFor="increasedLibido">Increased Libido</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="breastTenderness" />
                        <Label htmlFor="breastTenderness">Breast Tenderness</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bloating" />
                        <Label htmlFor="bloating">Bloating</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white"
                    onClick={() => handleOvulationPredict()}
                  >
                    Predict Fertility Window
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Column: Fertility Results */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fertility Status</CardTitle>
                  <CardDescription>Your current fertility prediction based on your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cycleStats?.currentCyclePhase === 'ovulation' ? (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h3 className="font-medium text-green-700 mb-1">Peak Fertility</h3>
                        <p className="text-sm text-green-600">
                          You are currently in your ovulation window. This is your most fertile time if you're trying to conceive.
                        </p>
                      </div>
                    ) : cycleStats?.fertileWindowStart && cycleStats?.fertileWindowEnd && (
                      isDateBetween(new Date(), cycleStats.fertileWindowStart, cycleStats.fertileWindowEnd) ? (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <h3 className="font-medium text-green-700 mb-1">Fertile Window</h3>
                          <p className="text-sm text-green-600">
                            You are in your fertile window. Your fertility is high during this time.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                          <h3 className="font-medium text-gray-700 mb-1">Not in Fertile Window</h3>
                          <p className="text-sm text-gray-600">
                            You are not currently in your fertile window based on the data provided.
                          </p>
                        </div>
                      )
                    )}
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Next Ovulation Date:</span>
                      <span className="font-medium text-violet-500">
                        {cycleStats?.nextOvulationDate ? format(cycleStats.nextOvulationDate, 'MMM d, yyyy') : '—'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Fertile Window:</span>
                      <span className="font-medium text-green-500">
                        {(cycleStats?.fertileWindowStart && cycleStats?.fertileWindowEnd) 
                          ? `${format(cycleStats.fertileWindowStart, 'MMM d')} - ${format(cycleStats.fertileWindowEnd, 'MMM d, yyyy')}` 
                          : '—'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm">Fertility Signs:</span>
                      <span className="font-medium">
                        {isFertilitySigns ? "Present" : "Not Present"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>BBT Chart</CardTitle>
                  <CardDescription>Track your temperature changes to identify ovulation</CardDescription>
                </CardHeader>
                <CardContent className="border-t">
  <BBTChart data={[
    { date: '2025-06-14', temperature: 97.7 },
    { date: '2025-06-15', temperature: 97.8 },
    { date: '2025-06-16', temperature: 98.2 },
    { date: '2025-06-17', temperature: 98.6 },
    { date: '2025-06-18', temperature: 98.4 },
  ]} />
</CardContent>

              </Card>
            </div>
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Fertility Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-violet-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-violet-700">Maximizing Your Chances</h3>
                  <ul className="list-disc pl-5 text-sm text-violet-600 space-y-1">
                    <li>Have intercourse every 1-2 days during your fertile window</li>
                    <li>Track your basal body temperature each morning before getting out of bed</li>
                    <li>Monitor changes in cervical mucus - egg white consistency indicates peak fertility</li>
                    <li>Maintain a healthy lifestyle and reduce stress</li>
                    <li>Consider using ovulation predictor kits for more precise timing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pregnancy" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Pregnancy Calculator */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Pregnancy Calculator</h2>
                <p className="text-sm text-gray-500 mb-4">Track your pregnancy journey and important milestones</p>
                
                <div className="space-y-6">
                  <div>
                    <Label>First day of last menstrual period</Label>
                    <div className="mt-2 space-y-2">
                      <Input 
                        type="date" 
                        value={lastPeriodDatePregnancy ? format(lastPeriodDatePregnancy, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null;
                          setLastPeriodDatePregnancy(date);
                        }}
                        max={format(new Date(), 'yyyy-MM-dd')}
                        min={format(subMonths(new Date(), 10), 'yyyy-MM-dd')}
                      />
                      <p className="text-xs text-gray-500">
                        {lastPeriodDatePregnancy 
                          ? `Selected: ${format(lastPeriodDatePregnancy, 'MMMM d, yyyy')}`
                          : "Please select the first day of your last period"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Are you pregnant?</Label>
                    <RadioGroup 
                      value={isPregnant ? "yes" : "no"} 
                      onValueChange={(value) => setIsPregnant(value === "yes")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pregnant-yes" />
                        <Label htmlFor="pregnant-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pregnant-no" />
                        <Label htmlFor="pregnant-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={handlePregnancyPredict}
                  >
                    Calculate Due Date
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Right Column: Pregnancy Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pregnancy Details</CardTitle>
                  {dueDate ? (
                    <CardDescription>Your pregnancy information based on your last period date</CardDescription>
                  ) : (
                    <CardDescription>Enter your last period date to calculate your due date</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {!dueDate ? (
                    <div className="text-center py-6">
                      <p>Please enter your last period date and click "Calculate Due Date"</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2 text-blue-700">Due Date</h3>
                        <p className="text-xl font-semibold text-blue-600">
                          {format(dueDate, 'MMMM d, yyyy')}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Current Week:</span>
                        <span className="text-blue-500 font-medium">
                          {gestationWeeks !== null ? `${gestationWeeks} weeks` : '—'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">Trimester:</span>
                        <span className="text-blue-500 font-medium">
                          {gestationWeeks !== null 
                            ? gestationWeeks < 13 
                              ? "First" 
                              : gestationWeeks < 27 
                                ? "Second" 
                                : "Third"
                            : '—'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Development Milestones</CardTitle>
                  <CardDescription>Key milestones in your baby's development</CardDescription>
                </CardHeader>
                <CardContent className="max-h-64 overflow-y-auto">
                  {pregnancyMilestones.length > 0 ? (
                    <div className="space-y-4">
                      {pregnancyMilestones.map((milestone, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "p-3 rounded-lg border",
                            gestationWeeks && gestationWeeks >= milestone.week 
                              ? "bg-blue-50 border-blue-200" 
                              : "bg-gray-50 border-gray-200"
                          )}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">Week {milestone.week}</span>
                            {gestationWeeks && gestationWeeks >= milestone.week && (
                              <span className="text-green-500 text-sm">✓ Reached</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{milestone.milestone}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p>Milestones will appear here after you calculate your due date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {isPregnant && dueDate && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Pregnancy Wellness Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-blue-700">Health Recommendations</h3>
                    <ul className="list-disc pl-5 text-sm text-blue-600 space-y-1">
                      <li>Take prenatal vitamins with folic acid daily</li>
                      <li>Stay hydrated by drinking 8-10 glasses of water daily</li>
                      <li>Maintain a balanced diet rich in fruits, vegetables, and proteins</li>
                      <li>Get regular exercise as recommended by your healthcare provider</li>
                      <li>Attend all scheduled prenatal appointments</li>
                      <li>Get adequate rest and manage stress</li>
                    </ul>
                  </div>
                  
                  {gestationWeeks !== null && (
                    <div className={cn(
                      "p-4 rounded-lg",
                      gestationWeeks < 13 ? "bg-green-50" : 
                      gestationWeeks < 27 ? "bg-amber-50" : "bg-orange-50"
                    )}>
                      <h3 className="font-medium mb-2">
                        {gestationWeeks < 13 
                          ? "First Trimester Tips" 
                          : gestationWeeks < 27 
                            ? "Second Trimester Tips" 
                            : "Third Trimester Tips"
                        }
                      </h3>
                      <p className="text-sm text-gray-600">
                        {gestationWeeks < 13 
                          ? "Combat morning sickness with small, frequent meals. Rest when tired and take your prenatal vitamins." 
                          : gestationWeeks < 27 
                            ? "Enjoy this typically more comfortable trimester. Stay active with pregnancy-safe exercises and begin planning for baby's arrival." 
                            : "Sleep on your side, not your back. Practice breathing exercises for labor and watch for signs of preterm labor."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tracker;
