import { pgTable, text, serial, integer, boolean, date, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  profilePicture: text("profile_picture"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Doctor model
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  experience: text("experience").notNull(),
  profilePicture: text("profile_picture"),
  availability: json("availability").$type<string[]>(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

// Period data model
export const periodData = pgTable("period_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  periodDay: integer("period_day"),
  isOvulation: boolean("is_ovulation").default(false),
  symptoms: json("symptoms").$type<string[]>(),
  notes: text("notes"),
});

export const insertPeriodDataSchema = createInsertSchema(periodData).omit({
  id: true,
});

// Health metrics model
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  weight: integer("weight"),
  bmi: integer("bmi"),
  sleepHours: integer("sleep_hours"),
  waterIntake: integer("water_intake"),
  exercise: integer("exercise"),
  sleepQuality: integer("sleep_quality"),
});

export const insertHealthMetricsSchema = createInsertSchema(healthMetrics).omit({
  id: true,
});

// Educational resources model
export const educationalResources = pgTable("educational_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
});

export const insertEducationalResourceSchema = createInsertSchema(educationalResources).omit({
  id: true,
});

// Consultation bookings model
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: date("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
});

// Export Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type PeriodData = typeof periodData.$inferSelect;
export type InsertPeriodData = z.infer<typeof insertPeriodDataSchema>;

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricsSchema>;

export type EducationalResource = typeof educationalResources.$inferSelect;
export type InsertEducationalResource = z.infer<typeof insertEducationalResourceSchema>;

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
