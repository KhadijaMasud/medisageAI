import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import multer from "multer";
import * as OpenAI from "./openai";
import fs from "fs";
import path from "path";
import { ParsedQs } from "qs";
import session from "express-session";
import { setupAuth } from "./auth";

// Extend the Express Request type to include session
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Define RequestWithSession type
interface RequestWithSession extends Request {
  session: session.Session & Partial<session.SessionData> & { userId?: number };
}

// Extend the Request type with multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // Medical Query API - Handles general medical questions
  app.post("/api/medical-query", async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Log query for future reference
      await storage.logMedicalQuery(question);
      
      // Get response from OpenAI
      const answer = await OpenAI.getMedicalQueryResponse(question);
      
      // Save the response
      await storage.saveQueryResult(question, answer);
      
      return res.json({ answer });
    } catch (error) {
      console.error("Error processing medical query:", error);
      return res.status(500).json({ message: "Failed to process medical query" });
    }
  });

  // Symptom Checker API - Analyzes user symptoms and predicts possible conditions
  app.post("/api/symptom-checker", async (req: Request, res: Response) => {
    try {
      const { symptoms, age, gender, conditions } = req.body;
      
      if (!symptoms || typeof symptoms !== "string") {
        return res.status(400).json({ message: "Symptoms description is required" });
      }
      
      // Get analysis from OpenAI
      const analysisResult = await OpenAI.analyzeSymptoms(symptoms, age, gender, conditions);
      
      // Save result
      await storage.saveSymptomCheck(symptoms, age, analysisResult);
      
      return res.json(analysisResult);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      return res.status(500).json({ message: "Failed to analyze symptoms" });
    }
  });

  // Medicine Scanner API - Analyzes an image of a medicine and returns information
  app.post("/api/medicine-scanner", upload.single("image"), async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      
      // Convert image to Base64
      const imageBuffer = req.file.buffer;
      const base64Image = imageBuffer.toString("base64");
      
      // Get medicine info using OpenAI Vision
      const medicineInfo = await OpenAI.analyzeMedicineImage(base64Image, req.file.mimetype);
      
      // Save the image analysis result
      await storage.saveMedicineAnalysis(
        base64Image, 
        req.file.mimetype, 
        medicineInfo
      );
      
      return res.json(medicineInfo);
    } catch (error) {
      console.error("Error analyzing medicine image:", error);
      return res.status(500).json({ message: "Failed to analyze medicine image" });
    }
  });

  // Voice Assistant API - Processes voice commands and returns responses
  app.post("/api/voice-assistant", async (req: Request, res: Response) => {
    try {
      const { input } = req.body;
      
      if (!input || typeof input !== "string") {
        return res.status(400).json({ message: "Voice input is required" });
      }
      
      // Process the voice command
      const answer = await OpenAI.processVoiceCommand(input);
      
      // Save the voice interaction
      await storage.saveVoiceInteraction(input, answer);
      
      return res.json({ answer });
    } catch (error) {
      console.error("Error processing voice command:", error);
      return res.status(500).json({ message: "Failed to process voice command" });
    }
  });

  // User Authentication API
  app.post("/api/auth/login", async (req: RequestWithSession, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.authenticateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create a session
      req.session.userId = user.id;
      
      return res.json({ 
        id: user.id,
        username: user.username,
        role: user.role
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });

  // User Registration API
  app.post("/api/auth/register", async (req: RequestWithSession, res: Response) => {
    try {
      const { username, password, email } = req.body;
      
      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(username, password, email);
      
      // Create a session
      req.session.userId = newUser.id;
      
      return res.status(201).json({ 
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  // Logout API
  app.post("/api/auth/logout", (req: RequestWithSession, res: Response) => {
    req.session.destroy((err: Error | null) => {
      if (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      
      res.clearCookie("connect.sid");
      return res.json({ message: "Logged out successfully" });
    });
  });

  // User Profile Management API
  app.get("/api/user/profile", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Fetch user profile from database
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.user_id, req.user.id)
      });
      
      if (!userProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      return res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  app.post("/api/user/profile", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const profileData = req.body;
      
      // Check if profile already exists
      const existingProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.user_id, req.user.id)
      });
      
      if (existingProfile) {
        // Update existing profile
        const updatedProfile = await db.update(userProfiles)
          .set({
            ...profileData,
            last_updated: new Date()
          })
          .where(eq(userProfiles.user_id, req.user.id))
          .returning();
          
        return res.json(updatedProfile[0]);
      } else {
        // Create new profile
        const newProfile = await db.insert(userProfiles)
          .values({
            ...profileData,
            user_id: req.user.id,
            last_updated: new Date()
          })
          .returning();
          
        return res.status(201).json(newProfile[0]);
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
      return res.status(500).json({ message: "Failed to save user profile" });
    }
  });
  
  // Medical Records API
  app.get("/api/user/medical-records", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Fetch all medical records for the user
      const records = await db.query.medicalRecords.findMany({
        where: eq(medicalRecords.user_id, req.user.id),
        orderBy: [desc(medicalRecords.record_date)]
      });
      
      return res.json(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      return res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });
  
  app.post("/api/user/medical-records", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const recordData = req.body;
      
      // Create new medical record
      const newRecord = await db.insert(medicalRecords)
        .values({
          ...recordData,
          user_id: req.user.id,
          created_at: new Date()
        })
        .returning();
        
      return res.status(201).json(newRecord[0]);
    } catch (error) {
      console.error("Error creating medical record:", error);
      return res.status(500).json({ message: "Failed to create medical record" });
    }
  });
  
  // Vital Signs API
  app.get("/api/user/vital-signs", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Fetch all vital signs for the user
      const vitalSignRecords = await db.query.vitalSigns.findMany({
        where: eq(vitalSigns.user_id, req.user.id),
        orderBy: [desc(vitalSigns.measurement_date)]
      });
      
      return res.json(vitalSignRecords);
    } catch (error) {
      console.error("Error fetching vital signs:", error);
      return res.status(500).json({ message: "Failed to fetch vital signs" });
    }
  });
  
  app.post("/api/user/vital-signs", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const vitalSignData = req.body;
      
      // Create new vital sign record
      const newVitalSign = await db.insert(vitalSigns)
        .values({
          ...vitalSignData,
          user_id: req.user.id,
          measurement_date: new Date()
        })
        .returning();
        
      return res.status(201).json(newVitalSign[0]);
    } catch (error) {
      console.error("Error recording vital signs:", error);
      return res.status(500).json({ message: "Failed to record vital signs" });
    }
  });
  
  // Medical History API - Return all saved medical interactions
  app.get("/api/user/medical-history", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Fetch all saved queries
      const savedQueries = await db.query.medicalQueries.findMany({
        where: and(
          eq(medicalQueries.user_id, req.user.id),
          eq(medicalQueries.saved, true)
        ),
        orderBy: [desc(medicalQueries.timestamp)]
      });
      
      // Fetch all saved symptom checks
      const savedSymptomChecks = await db.query.symptomChecks.findMany({
        where: and(
          eq(symptomChecks.user_id, req.user.id),
          eq(symptomChecks.saved, true)
        ),
        orderBy: [desc(symptomChecks.timestamp)]
      });
      
      // Fetch all saved medicine scans
      const savedMedicineScans = await db.query.medicineScans.findMany({
        where: and(
          eq(medicineScans.user_id, req.user.id),
          eq(medicineScans.saved, true)
        ),
        orderBy: [desc(medicineScans.timestamp)]
      });
      
      // Return combined history
      return res.json({
        medicalQueries: savedQueries,
        symptomChecks: savedSymptomChecks,
        medicineScans: savedMedicineScans
      });
    } catch (error) {
      console.error("Error fetching medical history:", error);
      return res.status(500).json({ message: "Failed to fetch medical history" });
    }
  });
  
  // Toggle save status for various items
  app.post("/api/user/save-item", async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const { itemType, itemId, saved } = req.body;
      
      if (!itemType || !itemId) {
        return res.status(400).json({ message: "Item type and ID are required" });
      }
      
      let result;
      
      // Update save status based on item type
      switch (itemType) {
        case "medical-query":
          result = await db.update(medicalQueries)
            .set({ saved })
            .where(and(
              eq(medicalQueries.id, itemId),
              eq(medicalQueries.user_id, req.user.id)
            ))
            .returning();
          break;
          
        case "symptom-check":
          result = await db.update(symptomChecks)
            .set({ saved })
            .where(and(
              eq(symptomChecks.id, itemId),
              eq(symptomChecks.user_id, req.user.id)
            ))
            .returning();
          break;
          
        case "medicine-scan":
          result = await db.update(medicineScans)
            .set({ saved })
            .where(and(
              eq(medicineScans.id, itemId),
              eq(medicineScans.user_id, req.user.id)
            ))
            .returning();
          break;
          
        default:
          return res.status(400).json({ message: "Invalid item type" });
      }
      
      if (result.length === 0) {
        return res.status(404).json({ message: "Item not found or not owned by user" });
      }
      
      return res.json(result[0]);
    } catch (error) {
      console.error("Error toggling save status:", error);
      return res.status(500).json({ message: "Failed to update save status" });
    }
  });

  // Health Check API
  app.get("/api/health", (_req: Request, res: Response) => {
    return res.json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
