import { addDays, format, startOfMonth, endOfMonth, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPeriod: boolean;
  isOvulation: boolean;
  isPrediction?: boolean;
  isFertile?: boolean;
};

export type PeriodData = {
  date: Date;
  isPeriod: boolean;
  isOvulation: boolean;
  symptoms?: string[];
  notes?: string;
  flow?: 'light' | 'medium' | 'heavy' | null;
  isPrediction?: boolean;
};

/**
 * Generate calendar days for a given month
 */
export const getCalendarDays = (
  currentDate: Date,
  periodData: PeriodData[] = []
): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const today = new Date();
  
  // Start from the first day of the week that contains the first day of the month
  let startDate = monthStart;
  const day = startDate.getDay();
  startDate = addDays(startDate, -day);
  
  // Calculate 42 days (6 weeks) from the start date
  const calendarDays: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(startDate, i);
    
    const periodInfo = periodData.find((p) => isSameDay(p.date, date));
    
    calendarDays.push({
      date,
      isCurrentMonth: isSameMonth(date, monthStart),
      isToday: isSameDay(date, today),
      isPeriod: !!periodInfo?.isPeriod,
      isOvulation: !!periodInfo?.isOvulation,
      isPrediction: !!periodInfo?.isPrediction,
      isFertile: !!periodInfo?.notes?.includes('Fertile')
    });
  }
  
  return calendarDays;
};

/**
 * Format the date as YYYY-MM-DD (to use as keys in maps or for API requests)
 */
export const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get a date's information from the period data array
 */
export const getDateInfo = (date: Date, periodData: PeriodData[]): PeriodData | undefined => {
  return periodData.find((p) => isSameDay(p.date, date));
};

/**
 * Predict future periods based on past data
 */
export const predictFuturePeriods = (
  periodData: PeriodData[],
  cycleLength: number = 28,
  periodLength: number = 5,
  monthsToPredict: number = 3
): PeriodData[] => {
  if (periodData.length === 0) {
    return [];
  }
  
  // Sort period data by date
  const sortedData = [...periodData].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Find the most recent period start date
  const recentPeriodStarts = sortedData
    .filter(data => data.isPeriod)
    .map(data => data.date);
  
  if (recentPeriodStarts.length === 0) {
    return [];
  }
  
  const lastPeriodStart = recentPeriodStarts[recentPeriodStarts.length - 1];
  const predictions: PeriodData[] = [];
  
  // Predict future periods
  for (let i = 1; i <= monthsToPredict; i++) {
    const nextPeriodStart = addDays(lastPeriodStart, i * cycleLength);
    
    // Add each day of the predicted period
    for (let j = 0; j < periodLength; j++) {
      predictions.push({
        date: addDays(nextPeriodStart, j),
        isPeriod: true,
        isOvulation: false,
        symptoms: [],
        notes: 'Predicted period',
        isPrediction: true
      });
    }
    
    // Add ovulation day (typically 14 days before the next period)
    const ovulationDay = addDays(nextPeriodStart, -14);
    predictions.push({
      date: ovulationDay,
      isPeriod: false,
      isOvulation: true,
      symptoms: [],
      notes: 'Predicted ovulation',
      isPrediction: true
    });
    
    // Add fertile window (typically 5 days before ovulation and the day of ovulation)
    for (let k = 5; k >= 0; k--) {
      // Skip ovulation day as it's already added
      if (k === 0) continue;
      
      const fertileDay = addDays(ovulationDay, -k);
      predictions.push({
        date: fertileDay,
        isPeriod: false,
        isOvulation: false,
        symptoms: [],
        notes: 'Fertile window',
        isPrediction: true
      });
    }
    
    // Add the day after ovulation to the fertile window
    predictions.push({
      date: addDays(ovulationDay, 1),
      isPeriod: false,
      isOvulation: false,
      symptoms: [],
      notes: 'Fertile window',
      isPrediction: true
    });
  }
  
  return predictions;
};
