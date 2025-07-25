import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertPeriodDataSchema, 
  insertHealthMetricsSchema, 
  insertConsultationSchema
} from "@shared/schema";
import { askSakhii } from "./gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";

  // User routes
  app.post(`${apiPrefix}/users/register`, async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if user with username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post(`${apiPrefix}/users/login`, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Doctor routes
  app.get(`${apiPrefix}/doctors`, async (_req: Request, res: Response) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.status(200).json(doctors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  app.get(`${apiPrefix}/doctors/:id`, async (req: Request, res: Response) => {
    try {
      const doctorId = parseInt(req.params.id);
      const doctor = await storage.getDoctor(doctorId);
      
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  });

  // Period data routes
  app.get(`${apiPrefix}/periodData`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      if (isNaN(userId) || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid query parameters" });
      }
      
      const periodData = await storage.getPeriodData(userId, startDate, endDate);
      res.status(200).json(periodData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch period data" });
    }
  });

  app.post(`${apiPrefix}/periodData`, async (req: Request, res: Response) => {
    try {
      const periodData = insertPeriodDataSchema.parse(req.body);
      const newPeriodData = await storage.createPeriodData(periodData);
      res.status(201).json(newPeriodData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid period data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create period data" });
    }
  });

  app.put(`${apiPrefix}/periodData/:id`, async (req: Request, res: Response) => {
    try {
      const periodDataId = parseInt(req.params.id);
      const periodData = req.body;
      
      const updatedPeriodData = await storage.updatePeriodData(periodDataId, periodData);
      
      if (!updatedPeriodData) {
        return res.status(404).json({ message: "Period data not found" });
      }
      
      res.status(200).json(updatedPeriodData);
    } catch (error) {
      res.status(500).json({ message: "Failed to update period data" });
    }
  });

  // Health metrics routes
  app.get(`${apiPrefix}/healthMetrics`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // If date is provided, get metrics for that date
      if (req.query.date) {
        const date = new Date(req.query.date as string);
        
        if (isNaN(date.getTime())) {
          return res.status(400).json({ message: "Invalid date" });
        }
        
        const metrics = await storage.getHealthMetrics(userId, date);
        return res.status(200).json(metrics || null);
      }
      
      // Otherwise, get all metrics for the user
      const allMetrics = await storage.getAllHealthMetrics(userId);
      res.status(200).json(allMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health metrics" });
    }
  });

  app.post(`${apiPrefix}/healthMetrics`, async (req: Request, res: Response) => {
    try {
      const healthMetrics = insertHealthMetricsSchema.parse(req.body);
      const newHealthMetrics = await storage.createHealthMetrics(healthMetrics);
      res.status(201).json(newHealthMetrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid health metrics", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create health metrics" });
    }
  });

  app.put(`${apiPrefix}/healthMetrics/:id`, async (req: Request, res: Response) => {
    try {
      const healthMetricsId = parseInt(req.params.id);
      const healthMetrics = req.body;
      
      const updatedHealthMetrics = await storage.updateHealthMetrics(healthMetricsId, healthMetrics);
      
      if (!updatedHealthMetrics) {
        return res.status(404).json({ message: "Health metrics not found" });
      }
      
      res.status(200).json(updatedHealthMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to update health metrics" });
    }
  });

  // Educational resources routes
  app.get(`${apiPrefix}/educationalResources`, async (req: Request, res: Response) => {
    try {
      // If category is provided, filter by category
      if (req.query.category) {
        const category = req.query.category as string;
        const resources = await storage.getEducationalResourcesByCategory(category);
        return res.status(200).json(resources);
      }
      
      // Otherwise, get all resources
      const allResources = await storage.getAllEducationalResources();
      res.status(200).json(allResources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational resources" });
    }
  });

  app.get(`${apiPrefix}/educationalResources/:id`, async (req: Request, res: Response) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getEducationalResource(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: "Educational resource not found" });
      }
      
      res.status(200).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational resource" });
    }
  });

  // Consultation routes
  app.get(`${apiPrefix}/consultations/user/:userId`, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const consultations = await storage.getUserConsultations(userId);
      res.status(200).json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.get(`${apiPrefix}/consultations/doctor/:doctorId`, async (req: Request, res: Response) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      
      if (isNaN(doctorId)) {
        return res.status(400).json({ message: "Invalid doctor ID" });
      }
      
      const consultations = await storage.getDoctorConsultations(doctorId);
      res.status(200).json(consultations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch consultations" });
    }
  });

  app.post(`${apiPrefix}/consultations`, async (req: Request, res: Response) => {
    try {
      const consultation = insertConsultationSchema.parse(req.body);
      const newConsultation = await storage.createConsultation(consultation);
      res.status(201).json(newConsultation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid consultation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create consultation" });
    }
  });

  app.put(`${apiPrefix}/consultations/:id/status`, async (req: Request, res: Response) => {
    try {
      const consultationId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedConsultation = await storage.updateConsultationStatus(consultationId, status);
      
      if (!updatedConsultation) {
        return res.status(404).json({ message: "Consultation not found" });
      }
      
      res.status(200).json(updatedConsultation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update consultation status" });
    }
  });

  // Ask Sakhii AI endpoint
  app.post(`${apiPrefix}/ask-sakhii`, async (req: Request, res: Response) => {
    try {
      const { message, language = 'en' } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await askSakhii(message.trim(), language);
      res.status(200).json({ response });
      
    } catch (error) {
      console.error('Ask Sakhii error:', error);
      res.status(500).json({ 
        message: "Sorry, I'm having trouble processing your request right now." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
