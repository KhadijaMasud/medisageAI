import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import multer from "multer";
import * as OpenAI from "./openai";
import fs from "fs";
import path from "path";
import { ParsedQs } from "qs";
import session from "express-session";

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

  // Health Check API
  app.get("/api/health", (_req: Request, res: Response) => {
    return res.json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
