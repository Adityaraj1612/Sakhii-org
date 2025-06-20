import { 
  users, User, InsertUser,
  doctors, Doctor, InsertDoctor,
  periodData, PeriodData, InsertPeriodData,
  healthMetrics, HealthMetric, InsertHealthMetric,
  educationalResources, EducationalResource, InsertEducationalResource,
  consultations, Consultation, InsertConsultation
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctor operations
  getDoctor(id: number): Promise<Doctor | undefined>;
  getAllDoctors(): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  
  // Period data operations
  getPeriodData(userId: number, startDate: Date, endDate: Date): Promise<PeriodData[]>;
  createPeriodData(data: InsertPeriodData): Promise<PeriodData>;
  updatePeriodData(id: number, data: Partial<InsertPeriodData>): Promise<PeriodData | undefined>;
  
  // Health metrics operations
  getHealthMetrics(userId: number, date: Date): Promise<HealthMetric | undefined>;
  getAllHealthMetrics(userId: number): Promise<HealthMetric[]>;
  createHealthMetrics(metrics: InsertHealthMetric): Promise<HealthMetric>;
  updateHealthMetrics(id: number, metrics: Partial<InsertHealthMetric>): Promise<HealthMetric | undefined>;
  
  // Educational resources operations
  getEducationalResource(id: number): Promise<EducationalResource | undefined>;
  getAllEducationalResources(): Promise<EducationalResource[]>;
  getEducationalResourcesByCategory(category: string): Promise<EducationalResource[]>;
  createEducationalResource(resource: InsertEducationalResource): Promise<EducationalResource>;
  
  // Consultation operations
  getConsultation(id: number): Promise<Consultation | undefined>;
  getUserConsultations(userId: number): Promise<Consultation[]>;
  getDoctorConsultations(doctorId: number): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private periodData: Map<number, PeriodData>;
  private healthMetrics: Map<number, HealthMetric>;
  private educationalResources: Map<number, EducationalResource>;
  private consultations: Map<number, Consultation>;
  
  private userCurrentId: number;
  private doctorCurrentId: number;
  private periodDataCurrentId: number;
  private healthMetricsCurrentId: number;
  private educationalResourcesCurrentId: number;
  private consultationsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.periodData = new Map();
    this.healthMetrics = new Map();
    this.educationalResources = new Map();
    this.consultations = new Map();

    this.userCurrentId = 1;
    this.doctorCurrentId = 1;
    this.periodDataCurrentId = 1;
    this.healthMetricsCurrentId = 1;
    this.educationalResourcesCurrentId = 1;
    this.consultationsCurrentId = 1;
    
    // Initialize with some demo doctors and resources
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Add demo doctors
    const demoDoctor1: InsertDoctor = {
      name: "Dr. Sarah Green",
      specialty: "OB/GYN Specialist",
      experience: "8+ years experience",
      profilePicture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=60",
      availability: ["Monday", "Wednesday", "Friday"]
    };
    
    const demoDoctor2: InsertDoctor = {
      name: "Dr. Emily Chen",
      specialty: "Fertility Specialist",
      experience: "10+ years experience",
      profilePicture: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&auto=format&fit=crop&q=60",
      availability: ["Tuesday", "Thursday", "Saturday"]
    };
    
    const demoDoctor3: InsertDoctor = {
      name: "Dr. Maria Rodriguez",
      specialty: "Endocrinologist",
      experience: "12+ years experience",
      profilePicture: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=60",
      availability: ["Monday", "Tuesday", "Friday"]
    };
    
    const demoDoctor4: InsertDoctor = {
      name: "Dr. Lisa Johnson",
      specialty: "Nutritionist",
      experience: "6+ years experience",
      profilePicture: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800&auto=format&fit=crop&q=60",
      availability: ["Wednesday", "Thursday", "Saturday"]
    };
    
    this.createDoctor(demoDoctor1);
    this.createDoctor(demoDoctor2);
    this.createDoctor(demoDoctor3);
    this.createDoctor(demoDoctor4);

    // Add demo educational resources
    const demoResources = [
      {
        title: "Reproductive Health Guide",
        description: "Comprehensive guide covering all aspects of reproductive health and wellness.",
        category: "Reproductive Health",
        content: "Lorem ipsum content about reproductive health...",
        imageUrl: "/images/reproductive-health.jpg"
      },
      {
        title: "Hormonal Health Education",
        description: "Learn about hormonal balance and how it affects your overall well-being.",
        category: "Hormonal Health",
        content: "Lorem ipsum content about hormonal health...",
        imageUrl: "/images/hormonal-health.jpg"
      },
      {
        title: "Mental & Emotional Wellness",
        description: "Resources to support your mental health through different life stages.",
        category: "Mental Health",
        content: "Lorem ipsum content about mental health...",
        imageUrl: "/images/mental-health.jpg"
      },
      {
        title: "Maternal Health Care",
        description: "Everything you need to know about pregnancy and postnatal care.",
        category: "Maternal Health",
        content: "Lorem ipsum content about maternal health...",
        imageUrl: "/images/maternal-health.jpg"
      },
      {
        title: "Sexual & Physical Health",
        description: "Guidance on maintaining optimal sexual and physical health.",
        category: "Sexual Health",
        content: "Lorem ipsum content about sexual health...",
        imageUrl: "/images/sexual-health.jpg"
      },
      {
        title: "Nutrition & Exercise",
        description: "Tips and advice for women's nutrition and fitness at every stage.",
        category: "Nutrition",
        content: "Lorem ipsum content about nutrition and exercise...",
        imageUrl: "/images/nutrition.jpg"
      }
    ];
    
    demoResources.forEach(resource => {
      this.createEducationalResource(resource as InsertEducationalResource);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      ...insertUser, 
      id,
      dateOfBirth: insertUser.dateOfBirth ?? null,
      profilePicture: insertUser.profilePicture ?? null
    };
    this.users.set(id, user);
    return user;
  }

  // Doctor operations
  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }
  
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }
  
  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.doctorCurrentId++;
    const doctor: Doctor = {
      ...insertDoctor,
      id,
      profilePicture: insertDoctor.profilePicture ?? null,
      availability: Array.isArray(insertDoctor.availability) ? insertDoctor.availability as string[] : null
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  // Period data operations
  async getPeriodData(userId: number, startDate: Date, endDate: Date): Promise<PeriodData[]> {
    return Array.from(this.periodData.values()).filter(
      (data) => 
        data.userId === userId && 
        new Date(data.date) >= startDate && 
        new Date(data.date) <= endDate
    );
  }
  
  async createPeriodData(insertPeriodData: InsertPeriodData): Promise<PeriodData> {
    const id = this.periodDataCurrentId++;
    const data: PeriodData = {
      id,
      date: insertPeriodData.date,
      userId: insertPeriodData.userId,
      periodDay: insertPeriodData.periodDay ?? null,
      isOvulation: insertPeriodData.isOvulation ?? null,
      symptoms: insertPeriodData.symptoms ? Array.from(insertPeriodData.symptoms) as string[] : null,
      notes: insertPeriodData.notes ?? null
    };
    this.periodData.set(id, data);
    return data;
  }
  
  async updatePeriodData(id: number, data: Partial<InsertPeriodData>): Promise<PeriodData | undefined> {
    const existingData = this.periodData.get(id);
    if (!existingData) return undefined;

    const updatedData: PeriodData = {
      ...existingData,
      ...data,
      symptoms: data.symptoms !== undefined
        ? (data.symptoms ? Array.from(data.symptoms) as string[] : null)
        : existingData.symptoms
    };
    this.periodData.set(id, updatedData);
    return updatedData;
  }

  // Health metrics operations
  async getHealthMetrics(userId: number, date: Date): Promise<HealthMetric | undefined> {
    return Array.from(this.healthMetrics.values()).find(
      (metric) => 
        metric.userId === userId && 
        new Date(metric.date).toDateString() === date.toDateString()
    );
  }
  
  async getAllHealthMetrics(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      (metric) => metric.userId === userId
    );
  }
  
  async createHealthMetrics(insertHealthMetrics: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricsCurrentId++;
    const metrics: HealthMetric = {
      id,
      date: insertHealthMetrics.date,
      userId: insertHealthMetrics.userId,
      weight: insertHealthMetrics.weight ?? null,
      bmi: insertHealthMetrics.bmi ?? null,
      sleepHours: insertHealthMetrics.sleepHours ?? null,
      waterIntake: insertHealthMetrics.waterIntake ?? null,
      exercise: insertHealthMetrics.exercise ?? null,
      sleepQuality: insertHealthMetrics.sleepQuality ?? null
    };
    this.healthMetrics.set(id, metrics);
    return metrics;
  }
  
  async updateHealthMetrics(id: number, metrics: Partial<InsertHealthMetric>): Promise<HealthMetric | undefined> {
    const existingMetrics = this.healthMetrics.get(id);
    if (!existingMetrics) return undefined;
    
    const updatedMetrics = { ...existingMetrics, ...metrics };
    this.healthMetrics.set(id, updatedMetrics);
    return updatedMetrics;
  }

  // Educational resources operations
  async getEducationalResource(id: number): Promise<EducationalResource | undefined> {
    return this.educationalResources.get(id);
  }
  
  async getAllEducationalResources(): Promise<EducationalResource[]> {
    return Array.from(this.educationalResources.values());
  }
  
  async getEducationalResourcesByCategory(category: string): Promise<EducationalResource[]> {
    return Array.from(this.educationalResources.values()).filter(
      (resource) => resource.category === category
    );
  }
  
  async createEducationalResource(insertResource: InsertEducationalResource): Promise<EducationalResource> {
    const id = this.educationalResourcesCurrentId++;
    const resource: EducationalResource = { 
      ...insertResource, 
      id, 
      imageUrl: insertResource.imageUrl ?? null 
    };
    this.educationalResources.set(id, resource);
    return resource;
  }

  // Consultation operations
  async getConsultation(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }
  
  async getUserConsultations(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.userId === userId
    );
  }
  
  async getDoctorConsultations(doctorId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      (consultation) => consultation.doctorId === doctorId
    );
  }
  
  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.consultationsCurrentId++;
    const consultation: Consultation = { 
      ...insertConsultation, 
      id, 
      notes: insertConsultation.notes ?? null 
    };
    this.consultations.set(id, consultation);
    return consultation;
  }
  
  async updateConsultationStatus(id: number, status: string): Promise<Consultation | undefined> {
    const consultation = this.consultations.get(id);
    if (!consultation) return undefined;
    
    const updatedConsultation = { ...consultation, status };
    this.consultations.set(id, updatedConsultation);
    return updatedConsultation;
  }
}

export const storage = new MemStorage();
