import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { format } from "date-fns";
import { PeriodData, CalendarDay } from "./calendar-utils";

// Types for Firestore data
export interface PeriodDataFirestore {
  userId: string;
  date: Timestamp;
  periodDay: number | null;
  isOvulation: boolean;
  symptoms: string[];
  notes: string;
  flow?: "light" | "medium" | "heavy" | null;
  isPrediction?: boolean;
}

// Convert Firestore data to application data
export const fromFirestore = (data: PeriodDataFirestore): PeriodData => {
  return {
    date: data.date.toDate(),
    isPeriod: data.periodDay !== null,
    isOvulation: data.isOvulation,
    symptoms: data.symptoms,
    notes: data.notes,
    flow: data.flow,
    isPrediction: data.isPrediction || false
  };
};

// Convert application data to Firestore data
export const toFirestore = (userId: string, data: PeriodData): PeriodDataFirestore => {
  return {
    userId,
    date: Timestamp.fromDate(data.date),
    periodDay: data.isPeriod ? 1 : null, // You might want to track which day of period it is (1-5 typically)
    isOvulation: data.isOvulation,
    symptoms: data.symptoms || [],
    notes: data.notes || "",
    flow: data.flow || null,
    isPrediction: data.isPrediction || false
  };
};

// Fetch period data for a user in a date range
export const fetchPeriodData = async (
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<PeriodData[]> => {
  try {
    const periodDataRef = collection(db, "periodData");
    
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    const q = query(
      periodDataRef,
      where("userId", "==", userId),
      where("date", ">=", startTimestamp),
      where("date", "<=", endTimestamp),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    
    const periodData: PeriodData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as PeriodDataFirestore;
      periodData.push(fromFirestore(data));
    });
    
    return periodData;
  } catch (error) {
    console.error("Error fetching period data:", error);
    return [];
  }
};

// Add period data
export const addPeriodData = async (
  userId: string,
  periodData: PeriodData
): Promise<string | null> => {
  try {
    // Check if an entry already exists for this date
    const existingData = await fetchPeriodData(
      userId,
      new Date(
        periodData.date.getFullYear(),
        periodData.date.getMonth(),
        periodData.date.getDate(),
        0, 0, 0
      ),
      new Date(
        periodData.date.getFullYear(),
        periodData.date.getMonth(),
        periodData.date.getDate(),
        23, 59, 59
      )
    );
    
    if (existingData.length > 0) {
      throw new Error("An entry already exists for this date");
    }
    
    const periodDataRef = collection(db, "periodData");
    const docRef = await addDoc(periodDataRef, toFirestore(userId, periodData));
    return docRef.id;
  } catch (error) {
    console.error("Error adding period data:", error);
    return null;
  }
};

// Update period data
export const updatePeriodData = async (
  docId: string,
  periodData: Partial<PeriodData>
): Promise<boolean> => {
  try {
    const periodDataRef = doc(db, "periodData", docId);
    
    // Only update the fields that are provided
    const updateData: Partial<PeriodDataFirestore> = {};
    
    if (periodData.date) {
      updateData.date = Timestamp.fromDate(periodData.date);
    }
    
    if (periodData.isPeriod !== undefined) {
      updateData.periodDay = periodData.isPeriod ? 1 : null;
    }
    
    if (periodData.isOvulation !== undefined) {
      updateData.isOvulation = periodData.isOvulation;
    }
    
    if (periodData.symptoms) {
      updateData.symptoms = periodData.symptoms;
    }
    
    if (periodData.notes) {
      updateData.notes = periodData.notes;
    }
    
    if (periodData.flow) {
      updateData.flow = periodData.flow;
    }
    
    await updateDoc(periodDataRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating period data:", error);
    return false;
  }
};

// Delete period data
export const deletePeriodData = async (docId: string): Promise<boolean> => {
  try {
    const periodDataRef = doc(db, "periodData", docId);
    await deleteDoc(periodDataRef);
    return true;
  } catch (error) {
    console.error("Error deleting period data:", error);
    return false;
  }
};

// Calculate stats based on period data
export interface CycleStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStartDate: Date | null;
  nextPeriodStartDate: Date | null;
  fertileWindowStart: Date | null;
  fertileWindowEnd: Date | null;
  nextOvulationDate: Date | null;
  currentCycleDay: number | null;
  currentCyclePhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | null;
}

export const calculateCycleStats = (periodData: PeriodData[]): CycleStats => {
  // Filter to only actual period start dates (not predictions)
  const periodStartDates = periodData
    .filter(data => data.isPeriod && !data.isPrediction)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Initialize stats
  const stats: CycleStats = {
    averageCycleLength: 28, // Default
    averagePeriodLength: 5, // Default
    lastPeriodStartDate: null,
    nextPeriodStartDate: null,
    fertileWindowStart: null,
    fertileWindowEnd: null,
    nextOvulationDate: null,
    currentCycleDay: null,
    currentCyclePhase: null
  };
  
  if (periodStartDates.length === 0) {
    return stats;
  }
  
  // Last period start date
  stats.lastPeriodStartDate = periodStartDates[periodStartDates.length - 1].date;
  
  // Calculate average cycle length if we have enough data
  if (periodStartDates.length >= 2) {
    let totalDays = 0;
    let cycles = 0;
    
    for (let i = 1; i < periodStartDates.length; i++) {
      const daysInCycle = Math.round(
        (periodStartDates[i].date.getTime() - periodStartDates[i - 1].date.getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      
      // Only count valid cycles (between 21 and 45 days)
      if (daysInCycle >= 21 && daysInCycle <= 45) {
        totalDays += daysInCycle;
        cycles++;
      }
    }
    
    if (cycles > 0) {
      stats.averageCycleLength = Math.round(totalDays / cycles);
    }
  }
  
  // Calculate average period length
  if (periodData.length > 0) {
    // Group consecutive period days together
    const periodGroups: PeriodData[][] = [];
    let currentGroup: PeriodData[] = [];
    
    const sortedPeriodData = [...periodData]
      .filter(data => !data.isPrediction)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    for (let i = 0; i < sortedPeriodData.length; i++) {
      const data = sortedPeriodData[i];
      
      if (data.isPeriod) {
        // Check if it's a new period
        if (currentGroup.length === 0 || 
            Math.abs(data.date.getTime() - currentGroup[currentGroup.length - 1].date.getTime()) <= 24 * 60 * 60 * 1000) {
          currentGroup.push(data);
        } else {
          // Start a new group
          if (currentGroup.length > 0) {
            periodGroups.push(currentGroup);
          }
          currentGroup = [data];
        }
      }
    }
    
    // Add the last group if it's not empty
    if (currentGroup.length > 0) {
      periodGroups.push(currentGroup);
    }
    
    // Calculate average length of period groups
    if (periodGroups.length > 0) {
      const totalLength = periodGroups.reduce((sum, group) => sum + group.length, 0);
      stats.averagePeriodLength = Math.round(totalLength / periodGroups.length);
    }
  }
  
  // Calculate next period start date
  if (stats.lastPeriodStartDate) {
    const lastPeriodTime = stats.lastPeriodStartDate.getTime();
    const nextPeriodTime = lastPeriodTime + (stats.averageCycleLength * 24 * 60 * 60 * 1000);
    stats.nextPeriodStartDate = new Date(nextPeriodTime);
    
    // Calculate ovulation date (14 days before next period)
    const ovulationTime = nextPeriodTime - (14 * 24 * 60 * 60 * 1000);
    stats.nextOvulationDate = new Date(ovulationTime);
    
    // Calculate fertile window (5 days before and 1 day after ovulation)
    stats.fertileWindowStart = new Date(ovulationTime - (5 * 24 * 60 * 60 * 1000));
    stats.fertileWindowEnd = new Date(ovulationTime + (1 * 24 * 60 * 60 * 1000));
    
    // Calculate current cycle day and phase
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastPeriodTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= stats.averageCycleLength) {
      stats.currentCycleDay = diffDays;
      
      // Determine cycle phase
      if (diffDays <= stats.averagePeriodLength) {
        stats.currentCyclePhase = 'menstrual';
      } else if (diffDays <= stats.averageCycleLength - 15) {
        stats.currentCyclePhase = 'follicular';
      } else if (diffDays >= stats.averageCycleLength - 16 && diffDays <= stats.averageCycleLength - 12) {
        stats.currentCyclePhase = 'ovulation';
      } else {
        stats.currentCyclePhase = 'luteal';
      }
    }
  }
  
  return stats;
};

// Generate predictions for future cycles
export const generatePredictions = (
  userId: string,
  stats: CycleStats,
  monthsToPredict: number = 3
): PeriodData[] => {
  if (!stats.lastPeriodStartDate || !stats.averageCycleLength) {
    return [];
  }
  
  const predictions: PeriodData[] = [];
  const lastPeriodDate = stats.lastPeriodStartDate;
  
  // Generate period predictions for the next few months
  for (let i = 1; i <= monthsToPredict; i++) {
    // Calculate next period start date
    const nextPeriodStart = new Date(
      lastPeriodDate.getTime() + (i * stats.averageCycleLength * 24 * 60 * 60 * 1000)
    );
    
    // Add predicted period days
    for (let j = 0; j < stats.averagePeriodLength; j++) {
      const periodDate = new Date(
        nextPeriodStart.getTime() + (j * 24 * 60 * 60 * 1000)
      );
      
      predictions.push({
        date: periodDate,
        isPeriod: true,
        isOvulation: false,
        symptoms: [],
        notes: 'Predicted period',
        flow: j < 2 ? 'heavy' : j < 4 ? 'medium' : 'light',
        isPrediction: true
      });
    }
    
    // Add predicted ovulation day (14 days before next cycle)
    const nextCycle = new Date(
      nextPeriodStart.getTime() + (stats.averageCycleLength * 24 * 60 * 60 * 1000)
    );
    const ovulationDay = new Date(nextCycle.getTime() - (14 * 24 * 60 * 60 * 1000));
    
    predictions.push({
      date: ovulationDay,
      isPeriod: false,
      isOvulation: true,
      symptoms: [],
      notes: 'Predicted ovulation',
      isPrediction: true
    });
    
    // Add fertile window days (5 days before and 1 day after ovulation)
    for (let k = -5; k <= 1; k++) {
      if (k === 0) continue; // Skip ovulation day as it's already added
      
      const fertileDate = new Date(ovulationDay.getTime() + (k * 24 * 60 * 60 * 1000));
      
      predictions.push({
        date: fertileDate,
        isPeriod: false,
        isOvulation: false,
        symptoms: [],
        notes: 'Fertile window',
        isPrediction: true
      });
    }
  }
  
  return predictions;
};