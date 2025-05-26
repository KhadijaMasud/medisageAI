import { pgTable, text, serial, timestamp, json, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Sessions table for express-session with connect-pg-simple
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  })
);

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

// Medical Queries table
export const medicalQueries = pgTable("medical_queries", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id"),
  question: text("question").notNull(),
  context: text("context"),
  answer: text("answer"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Symptom Checks table
export const symptomChecks = pgTable("symptom_checks", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id"),
  usersymptom: text("usersymptom").notNull(),
  agegroup: text("agegroup"),
  result: json("result"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Medicine Scans table
export const medicineScans = pgTable("medicine_scans", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id"),
  image_data: text("image_data").notNull(),
  image_type: text("image_type").notNull(),
  analysis_result: json("analysis_result"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Voice Interactions table
export const voiceInteractions = pgTable("voice_interactions", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id"),
  user_input: text("user_input").notNull(),
  system_response: text("system_response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  medicalQueries: many(medicalQueries),
  symptomChecks: many(symptomChecks),
  medicineScans: many(medicineScans),
  voiceInteractions: many(voiceInteractions)
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

export const insertMedicalQuerySchema = createInsertSchema(medicalQueries, {
  question: (schema) => schema.min(5, "Question must be at least 5 characters")
});

export const insertSymptomCheckSchema = createInsertSchema(symptomChecks, {
  usersymptom: (schema) => schema.min(5, "Symptoms must be at least 5 characters")
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MedicalQuery = typeof medicalQueries.$inferSelect;
export type SymptomCheck = typeof symptomChecks.$inferSelect;
export type MedicineScan = typeof medicineScans.$inferSelect;
export type VoiceInteraction = typeof voiceInteractions.$inferSelect;
