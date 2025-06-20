import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from "date-fns";
import { getCalendarDays, type CalendarDay } from "@/lib/calendar-utils";
import { CYCLE_SYMPTOMS } from "@/lib/constants";
import { Link } from "wouter";

const PeriodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Mocked period data for demo
  const mockPeriodData = [
    { date: new Date(2023, 2, 6), isPeriod: true, isOvulation: false, symptoms: ["Cramps"], notes: "Period day 1" },
    { date: new Date(2023, 2, 7), isPeriod: true, isOvulation: false, symptoms: ["Cramps", "Fatigue"], notes: "Period day 2" },
    { date: new Date(2023, 2, 8), isPeriod: true, isOvulation: false, symptoms: ["Cramps"], notes: "Period day 3" },
    { date: new Date(2023, 2, 9), isPeriod: true, isOvulation: false, symptoms: [], notes: "Period day 4" },
    { date: new Date(2023, 2, 21), isPeriod: false, isOvulation: true, symptoms: [], notes: "Ovulation day" },
  ];
  
  const calendarDays = getCalendarDays(currentDate, mockPeriodData);
  
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
  };
  
  // Find selected date info
  const selectedDateInfo = selectedDate 
    ? mockPeriodData.find(data => 
        data.date.getDate() === selectedDate.getDate() && 
        data.date.getMonth() === selectedDate.getMonth() && 
        data.date.getFullYear() === selectedDate.getFullYear())
    : null;

  return (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <h2 className="text-2xl font-bold mb-4 font-heading">Track Your Cycle</h2>
            <p className="text-neutral-600 mb-6">
              Keep track of your menstrual cycle, symptoms, and get personalized predictions for your next period.
            </p>
            
            {/* Features List */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                  <ChevronRight className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Accurate Predictions</h4>
                  <p className="text-sm text-neutral-600">Personalized predictions based on your data</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                  <ChevronRight className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Symptom Tracking</h4>
                  <p className="text-sm text-neutral-600">Monitor your symptoms and mood changes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 shadow-sm">
                  <ChevronRight className="text-primary h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Smart Reminders</h4>
                  <p className="text-sm text-neutral-600">Get notifications for upcoming periods and fertile windows</p>
                </div>
              </div>
            </div>
            
              <Link to="/tracker" onClick={() => window.scrollTo(0, 0)}>
                  <Button>Start Tracking</Button>
                </Link>
          </div>
          
          <div className="md:w-2/3 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold font-heading">My Period Calendar</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full bg-purple-100"
                  onClick={handlePreviousMonth}
                >
                  <ChevronLeft className="text-primary h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 rounded-full bg-purple-100"
                  onClick={handleNextMonth}
                >
                  <ChevronRight className="text-primary h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Calendar */}
            <div className="mb-4">
              <h4 className="text-center font-medium mb-4">
                {format(currentDate, 'MMMM yyyy')}
              </h4>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                <div className="text-sm font-medium text-neutral-600">Sun</div>
                <div className="text-sm font-medium text-neutral-600">Mon</div>
                <div className="text-sm font-medium text-neutral-600">Tue</div>
                <div className="text-sm font-medium text-neutral-600">Wed</div>
                <div className="text-sm font-medium text-neutral-600">Thu</div>
                <div className="text-sm font-medium text-neutral-600">Fri</div>
                <div className="text-sm font-medium text-neutral-600">Sat</div>
                
                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <div 
                    key={index}
                    className={`
                      w-10 h-10 flex items-center justify-center cursor-pointer rounded-full mx-auto
                      ${!day.isCurrentMonth ? 'text-neutral-400' : ''}
                      ${day.isPeriod ? 'bg-rose-500 text-white' : ''}
                      ${day.isOvulation ? 'bg-primary text-white' : ''}
                      ${day.isToday && !day.isPeriod && !day.isOvulation ? 'border-2 border-primary' : ''}
                      ${selectedDate && day.date.getDate() === selectedDate.getDate() && 
                         day.date.getMonth() === selectedDate.getMonth() && 
                         day.date.getFullYear() === selectedDate.getFullYear() && 
                         !day.isPeriod && !day.isOvulation ? 'ring-2 ring-primary' : ''}
                    `}
                    onClick={() => handleDateClick(day)}
                  >
                    {format(day.date, 'd')}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-rose-500 mr-2"></span>
                <span>Period Days</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-primary mr-2"></span>
                <span>Today</span>
              </div>
              <Link to="/tracker" onClick={() => window.scrollTo(0, 0)}>
                <Button>View Full Calender</Button></Link>
            </div>
            
            {/* Selected Day Info */}
            {selectedDate && (
              <div className="mt-6 border-t pt-4">
                <div className="text-sm">
                  <p className="font-medium">Selected Date: {format(selectedDate, 'MMMM d, yyyy')}</p>
                  {selectedDateInfo ? (
                    <>
                      <p className="text-neutral-600">
                        {selectedDateInfo.isPeriod ? `Period Day` : selectedDateInfo.isOvulation ? 'Ovulation Day' : ''}
                      </p>
                      {selectedDateInfo.symptoms && selectedDateInfo.symptoms.length > 0 && (
                        <p className="text-neutral-600 text-sm">
                          Symptoms: {selectedDateInfo.symptoms.join(', ')}
                        </p>
                      )}
                      {selectedDateInfo.notes && (
                        <p className="text-neutral-600 text-sm">Notes: {selectedDateInfo.notes}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-neutral-600">No data recorded for this date</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeriodCalendar;
