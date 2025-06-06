import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay, addDays, isToday, getDay, startOfDay, endOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchPeriodData, 
  addPeriodData as addPeriodDataToFirestore, 
  calculateCycleStats, 
  generatePredictions
} from "@/lib/periodTracking";
import { PeriodData } from "@/lib/calendar-utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PeriodCalendarWidgetProps {
  fullWidth?: boolean;
}

const PeriodCalendarWidget = ({ fullWidth = false }: PeriodCalendarWidgetProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [periodData, setPeriodData] = useState<PeriodData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<PeriodData>({
    date: new Date(),
    isPeriod: false,
    isOvulation: false,
    symptoms: [],
    notes: '',
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Transform period data into a format for the calendar
  const [cycleDays, setCycleDays] = useState<{[key: string]: 'period' | 'ovulation' | 'fertile' | null}>({});

  // Load period data on component mount and when month changes
  useEffect(() => {
    if (!user?.uid) return;
    
    const loadPeriodData = async () => {
      setLoadingData(true);
      try {
        // Calculate start and end dates for the query (we'll fetch 3 months of data)
        const startDate = subMonths(startOfMonth(currentDate), 1);
        const endDate = addMonths(endOfMonth(currentDate), 1);
        
        // Fetch the user's period data
        const data = await fetchPeriodData(user.uid, startDate, endDate);
        
        // Calculate cycle stats
        const stats = calculateCycleStats(data);
        
        // Generate predictions
        const predictions = generatePredictions(user.uid, stats);
        
        // Combine actual data with predictions
        const allData = [...data, ...predictions];
        setPeriodData(allData);
        
        // Transform data for calendar display
        const transformedData: {[key: string]: 'period' | 'ovulation' | 'fertile' | null} = {};
        
        allData.forEach(entry => {
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
        console.error("Error loading period data:", error);
        toast({
          title: "Error loading period data",
          description: "Could not load your period data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    loadPeriodData();
  }, [user, currentDate, toast]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    
    // If adding a new entry, set the date in the form
    if (openDialog) {
      setNewEntry(prev => ({ ...prev, date: day }));
    }
  };

  const getDayClass = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayType = cycleDays[dateStr];
    
    let className = "h-10 w-10 flex items-center justify-center rounded-full cursor-pointer ";
    
    if (!isSameMonth(day, currentDate)) {
      className += "text-gray-300 ";
    } else if (dayType === 'period') {
      className += "bg-rose-500 text-white ";
    } else if (dayType === 'ovulation') {
      className += "bg-primary text-white ";
    } else if (dayType === 'fertile') {
      className += "bg-primary/20 text-primary ";
    } else if (selectedDate && isSameDay(day, selectedDate)) {
      className += "ring-2 ring-primary ";
    } else if (isToday(day)) {
      className += "border-2 border-primary ";
    }
    
    return className;
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = monthStart;
    const startDay = getDay(startDate);
    
    // Create an array for days of the week
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Calculate days to display (including days from previous/next months to fill the grid)
    const days = [];
    let day = startDate;
    
    // Add days from previous month to fill the first row
    for (let i = 0; i < startDay; i++) {
      days.push(addDays(startDate, i - startDay));
    }
    
    // Add days of current month
    while (day <= monthEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    
    // Add days from next month to fill the last row
    const daysNeeded = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= daysNeeded; i++) {
      days.push(addDays(monthEnd, i));
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((weekday) => (
            <div key={weekday} className="text-center text-sm font-medium text-gray-500">
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className={getDayClass(day)}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getSelectedDateInfo = () => {
    if (!selectedDate) return null;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayType = cycleDays[dateStr];
    
    // Find the selected date in the period data
    const selectedDateData = periodData.find(data => 
      isSameDay(data.date, selectedDate)
    );
    
    return (
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <p className="font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
          </p>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setNewEntry({
                date: selectedDate,
                isPeriod: dayType === 'period',
                isOvulation: dayType === 'ovulation',
                symptoms: selectedDateData?.symptoms || [],
                notes: selectedDateData?.notes || '',
                flow: selectedDateData?.flow,
              });
              setOpenDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            {selectedDateData ? 'Edit' : 'Add'}
          </Button>
        </div>
        
        {dayType === 'period' && (
          <p className="text-rose-500 text-sm">Period day</p>
        )}
        {dayType === 'ovulation' && (
          <p className="text-primary text-sm">Ovulation day</p>
        )}
        {dayType === 'fertile' && (
          <p className="text-primary/80 text-sm">Fertile window</p>
        )}
        
        {selectedDateData?.symptoms && selectedDateData.symptoms.length > 0 && (
          <p className="text-neutral-600 text-sm mt-1">
            <span className="font-medium">Symptoms:</span> {selectedDateData.symptoms.join(', ')}
          </p>
        )}
        
        {selectedDateData?.flow && (
          <p className="text-neutral-600 text-sm mt-1">
            <span className="font-medium">Flow:</span> {selectedDateData.flow}
          </p>
        )}
        
        {selectedDateData?.notes && (
          <p className="text-neutral-600 text-sm mt-1">
            <span className="font-medium">Notes:</span> {selectedDateData.notes}
          </p>
        )}
        
        {selectedDateData?.isPrediction && (
          <p className="text-neutral-500 text-xs mt-1 italic">
            This is a prediction based on your cycle history
          </p>
        )}
        
        {!dayType && !selectedDateData && (
          <p className="text-neutral-600 text-sm mt-1">
            No data recorded for this date
          </p>
        )}
      </div>
    );
  };

  // Handle entry submission
  const handleSubmitEntry = async () => {
    if (!user?.uid) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save entries.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save the entry to Firestore
      await addPeriodDataToFirestore(user.uid, newEntry);
      
      toast({
        title: "Entry Saved",
        description: "Your period data has been saved successfully.",
      });
      
      // Close the dialog and refresh the data
      setOpenDialog(false);
      
      // Refresh the calendar data
      const startDate = subMonths(startOfMonth(currentDate), 1);
      const endDate = addMonths(endOfMonth(currentDate), 1);
      const data = await fetchPeriodData(user.uid, startDate, endDate);
      
      // Calculate cycle stats
      const stats = calculateCycleStats(data);
      
      // Generate predictions
      const predictions = generatePredictions(user.uid, stats);
      
      // Combine actual data with predictions
      const allData = [...data, ...predictions];
      setPeriodData(allData);
      
      // Transform data for calendar display
      const transformedData: {[key: string]: 'period' | 'ovulation' | 'fertile' | null} = {};
      
      allData.forEach(entry => {
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
      console.error("Error saving entry:", error);
      toast({
        title: "Error Saving Entry",
        description: "Could not save your entry. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Common symptoms options
  const commonSymptoms = [
    "Cramps", "Headache", "Bloating", "Fatigue", 
    "Mood Swings", "Breast Tenderness", "Backache", "Acne"
  ];
  
  const updateSymptom = (symptom: string, checked: boolean) => {
    if (!checked) {
      setNewEntry(prev => ({
        ...prev,
        symptoms: prev.symptoms?.filter(s => s !== symptom) || []
      }));
    } else {
      setNewEntry(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), symptom]
      }));
    }
  };

  return (
    <>
      <Card className={`${fullWidth ? 'w-full' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              My Period Calendar
            </CardTitle>
            
            {fullWidth && (
              <Select defaultValue="cycle">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cycle">Cycle View</SelectItem>
                  <SelectItem value="symptoms">Symptom Tracking</SelectItem>
                  <SelectItem value="predictions">Predictions</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {renderCalendar()}
          
          {getSelectedDateInfo()}
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-rose-500 mr-2"></span>
              <span>Period</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-2"></span>
              <span>Ovulation</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-primary/20 mr-2"></span>
              <span>Fertile</span>
            </div>
          </div>
          
          {fullWidth && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">Log Symptoms</Button>
              <Button className="w-full">View Predictions</Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog for adding/editing entries */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {format(newEntry.date, 'MMMM d, yyyy')}
            </DialogTitle>
            <DialogDescription>
              Enter your menstrual cycle information for this date.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Cycle Status</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="period" 
                    checked={newEntry.isPeriod}
                    onCheckedChange={(checked) => 
                      setNewEntry(prev => ({...prev, isPeriod: !!checked}))
                    }
                  />
                  <Label htmlFor="period" className="text-sm">Period</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ovulation" 
                    checked={newEntry.isOvulation}
                    onCheckedChange={(checked) => 
                      setNewEntry(prev => ({...prev, isOvulation: !!checked}))
                    }
                  />
                  <Label htmlFor="ovulation" className="text-sm">Ovulation</Label>
                </div>
              </div>
            </div>
            
            {newEntry.isPeriod && (
              <div className="space-y-2">
                <Label>Flow Intensity</Label>
                <RadioGroup 
                  value={newEntry.flow || ''} 
                  onValueChange={(value) => 
                    setNewEntry(prev => ({
                      ...prev, 
                      flow: value as 'light' | 'medium' | 'heavy' | null
                    }))
                  }
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
            )}
            
            <div className="space-y-2">
              <Label>Symptoms</Label>
              <div className="grid grid-cols-2 gap-2">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`symptom-${symptom}`} 
                      checked={newEntry.symptoms?.includes(symptom)}
                      onCheckedChange={(checked) => updateSymptom(symptom, !!checked)}
                    />
                    <Label htmlFor={`symptom-${symptom}`} className="text-sm">{symptom}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newEntry.notes || ''} 
                onChange={(e) => setNewEntry(prev => ({...prev, notes: e.target.value}))}
                placeholder="Add any notes about how you're feeling today..."
                className="h-20"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitEntry}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeriodCalendarWidget;
