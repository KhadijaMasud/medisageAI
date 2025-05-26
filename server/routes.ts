import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import multer from "multer";
import * as AI from "./together";
import fs from "fs";
import path from "path";
import { ParsedQs } from "qs";
import session from "express-session";
import { db } from "../db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

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
  // Medical Query API - Handles general medical questions
  app.post("/api/medical-query", async (req: RequestWithSession, res: Response) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Save the query with user ID if authenticated
      const userId = req.session.userId;
      
      try {
        // Log the query before processing
        await storage.logMedicalQuery(question, userId?.toString());
      } catch (dbError) {
        console.error("Error logging medical query:", dbError);
        // Continue processing even if logging fails
      }
      
      // Get response from AI service
      const answer = await AI.getMedicalQueryResponse(question);
      
      try {
        // Save the query result
        await storage.saveQueryResult(question, answer, userId?.toString());
      } catch (dbError) {
        console.error("Error saving query result:", dbError);
        // Continue processing even if saving fails
      }
      
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
      
      // Get analysis from AI service
      const analysisResult = await AI.analyzeSymptoms(symptoms, age, gender, conditions);
      
      // Skip database operations for now
      // await storage.saveSymptomCheck(symptoms, age, analysisResult);
      
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
      
      // Get medicine info using AI Vision
      const medicineInfo = await AI.analyzeMedicineImage(base64Image, req.file.mimetype);
      
      // Skip database operations for now
      // await storage.saveMedicineAnalysis(
      //   base64Image, 
      //   req.file.mimetype, 
      //   medicineInfo
      // );
      
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
      const answer = await AI.processVoiceCommand(input);
      
      // Skip database operations for now
      // await storage.saveVoiceInteraction(input, answer);
      
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
      console.log("Created session for user:", user.id);
      console.log("Session after login:", req.session);
      
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
      const { username, password, email, name } = req.body;
      
      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }

      // Basic validation
      if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least 3 characters" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      
      if (!email.includes('@')) {
        return res.status(400).json({ message: "Please provide a valid email address" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      try {
        // Create new user
        const newUser = await storage.createUser(username, password, email, name);
        
        // Create a session
        req.session.userId = newUser.id;
        
        return res.status(201).json({ 
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
          name: newUser.name
        });
      } catch (createError) {
        console.error("Error creating user:", createError);
        return res.status(500).json({ message: "Failed to create user account" });
      }
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

  // Health Check API
  app.get("/api/health", (_req: Request, res: Response) => {
    return res.json({ status: "ok" });
  });

  // Get authenticated user status
  app.get("/api/auth/status", async (req: RequestWithSession, res: Response) => {
    try {
      console.log("Session info:", req.session);
      console.log("Session userId:", req.session.userId);
      
      if (!req.session || !req.session.userId) {
        console.log("No session or userId found");
        return res.status(401).json({ message: "Not authenticated" });
      }

      console.log("Looking for user with ID:", req.session.userId);
      
      // Retrieve user from database
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.session.userId)
      });
      
      console.log("User found:", user ? "Yes" : "No");
      
      if (!user) {
        // Session exists but user doesn't - clear session
        console.log("Session exists but user not found - clearing session");
        req.session.destroy((err) => {
          if (err) console.error("Error destroying invalid session:", err);
        });
        return res.status(401).json({ message: "User not found" });
      }
      
      // Return user data without sensitive information
      return res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      });
    } catch (error) {
      console.error("Error getting user status:", error);
      return res.status(500).json({ message: "Failed to retrieve user status" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
