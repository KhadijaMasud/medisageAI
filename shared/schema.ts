import { pgTable, text, serial, timestamp, json, uuid, boolean, date, integer, varchar, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("user").notNull(),
  auth_token: text("auth_token"),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow().notNull()
});

// User profiles table for medical information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id).notNull().unique(),
  date_of_birth: date("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  blood_type: varchar("blood_type", { length: 10 }),
  allergies: text("allergies"),
  chronic_conditions: text("chronic_conditions"),
  medications: text("medications"),
  emergency_contact: text("emergency_contact"),
  medical_notes: text("medical_notes"),
  last_updated: timestamp("last_updated").defaultNow().notNull()
});

// Medical records for tracking appointments, tests, etc.
export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id).notNull(),
  record_type: varchar("record_type", { length: 50 }).notNull(), // "appointment", "test", "prescription", etc.
  title: text("title").notNull(),
  record_date: date("record_date").notNull(),
  doctor_name: text("doctor_name"),
  facility_name: text("facility_name"),
  notes: text("notes"),
  attachments: json("attachments"), // Array of attachment metadata
  created_at: timestamp("created_at").defaultNow().notNull()
});

// Vital signs tracking
export const vitalSigns = pgTable("vital_signs", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id).notNull(),
  measurement_date: timestamp("measurement_date").defaultNow().notNull(),
  heart_rate: integer("heart_rate"),
  blood_pressure_systolic: integer("blood_pressure_systolic"),
  blood_pressure_diastolic: integer("blood_pressure_diastolic"),
  temperature: numeric("temperature", { precision: 4, scale: 1 }), // in Celsius
  respiratory_rate: integer("respiratory_rate"),
  oxygen_saturation: integer("oxygen_saturation"),
  notes: text("notes")
});

// Medical Queries table
export const medicalQueries = pgTable("medical_queries", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id),
  question: text("question").notNull(),
  context: text("context"),
  answer: text("answer"),
  saved: boolean("saved").default(false), // Flag for saving important queries to history
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Symptom Checks table
export const symptomChecks = pgTable("symptom_checks", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id),
  usersymptom: text("usersymptom").notNull(),
  agegroup: text("agegroup"),
  result: json("result"),
  saved: boolean("saved").default(false), // Flag for saving to history
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Medicine Scans table
export const medicineScans = pgTable("medicine_scans", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id),
  image_data: text("image_data").notNull(),
  image_type: text("image_type").notNull(),
  analysis_result: json("analysis_result"),
  saved: boolean("saved").default(false), // Flag for saving to history
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Voice Interactions table
export const voiceInteractions = pgTable("voice_interactions", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id").references(() => users.id),
  user_input: text("user_input").notNull(),
  system_response: text("system_response").notNull(),
  saved: boolean("saved").default(false), // Flag for saving important interactions
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.user_id]
  }),
  medicalRecords: many(medicalRecords),
  vitalSigns: many(vitalSigns),
  medicalQueries: many(medicalQueries),
  symptomChecks: many(symptomChecks),
  medicineScans: many(medicineScans),
  voiceInteractions: many(voiceInteractions)
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.user_id],
    references: [users.id]
  })
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one }) => ({
  user: one(users, {
    fields: [medicalRecords.user_id],
    references: [users.id]
  })
}));

export const vitalSignsRelations = relations(vitalSigns, ({ one }) => ({
  user: one(users, {
    fields: [vitalSigns.user_id],
    references: [users.id]
  })
}));

export const medicalQueriesRelations = relations(medicalQueries, ({ one }) => ({
  user: one(users, {
    fields: [medicalQueries.user_id],
    references: [users.id]
  })
}));

export const symptomChecksRelations = relations(symptomChecks, ({ one }) => ({
  user: one(users, {
    fields: [symptomChecks.user_id],
    references: [users.id]
  })
}));

export const medicineScansRelations = relations(medicineScans, ({ one }) => ({
  user: one(users, {
    fields: [medicineScans.user_id],
    references: [users.id]
  })
}));

export const voiceInteractionsRelations = relations(voiceInteractions, ({ one }) => ({
  user: one(users, {
    fields: [voiceInteractions.user_id],
    references: [users.id]
  })
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  email: (schema) => schema.email("Must provide a valid email")
});

export const insertUserProfileSchema = createInsertSchema(userProfiles);

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters")
});

export const insertVitalSignSchema = createInsertSchema(vitalSigns);

export const insertMedicalQuerySchema = createInsertSchema(medicalQueries, {
  question: (schema) => schema.min(5, "Question must be at least 5 characters")
});

export const insertSymptomCheckSchema = createInsertSchema(symptomChecks, {
  usersymptom: (schema) => schema.min(5, "Symptoms must be at least 5 characters")
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type InsertVitalSign = z.infer<typeof insertVitalSignSchema>;

export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type VitalSign = typeof vitalSigns.$inferSelect;
export type MedicalQuery = typeof medicalQueries.$inferSelect;
export type SymptomCheck = typeof symptomChecks.$inferSelect;
export type MedicineScan = typeof medicineScans.$inferSelect;
export type VoiceInteraction = typeof voiceInteractions.$inferSelect;
