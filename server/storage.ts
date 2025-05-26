import { db } from "../db";
import { users, medicalQueries, symptomChecks, medicineScans, voiceInteractions } from "../shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// User Authentication Functions
export async function getUserByUsername(username: string) {
  try {
    console.log(`Searching for user: ${username}`);
    const results = await db.select().from(users).where(eq(users.username, username));
    
    if (results.length > 0) {
      console.log(`Found user: ${username}, id: ${results[0].id}`);
      return results[0];
    } else {
      console.log(`User not found: ${username}`);
      return null;
    }
  } catch (error) {
    console.error(`Error finding user ${username}:`, error);
    return null;
  }
}

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      console.log(`User not found: ${username}`);
      return null;
    }
    
    // Verify password
    console.log(`Comparing passwords for user: ${username}`);
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      console.log(`Password mismatch for user: ${username}`);
      return null;
    }
    
    console.log(`Authentication successful for user: ${username}`);
    return user;
  } catch (error) {
    console.error(`Authentication error for ${username}:`, error);
    return null;
  }
}

export async function createUser(username: string, password: string, email: string, name?: string) {
  try {
    console.log("Starting user creation...");
    
    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    
    // Create values object for debugging
    const userValues = {
      username,
      password: hashedPassword,
      email,
      role: "user",
      auth_token: randomUUID(),
      name: name || username // Use username as name if not provided
    };
    console.log("User values prepared:", { ...userValues, password: "[REDACTED]" });
    
    // Create new user with name set to username if not provided
    console.log("Attempting database insert...");
    const [newUser] = await db.insert(users)
      .values(userValues)
      .returning();
    
    console.log("User created successfully:", { id: newUser.id, username: newUser.username });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    if (typeof error === 'object' && error !== null) {
      try {
        console.error("Error details:", JSON.stringify(error, null, 2));
      } catch (jsonError) {
        console.error("Error details could not be stringified:", error);
      }
    }
    
    throw new Error("User creation failed");
  }
}

// Medical Query Functions
export async function logMedicalQuery(question: string, userId?: string) {
  try {
    await db.insert(medicalQueries).values({
      question,
      timestamp: new Date(),
      user_id: userId ? parseInt(userId) : undefined
    });
  } catch (error) {
    console.error("Error logging medical query:", error);
    // Continue even if logging fails
  }
}

export async function saveQueryResult(question: string, answer: string, userId?: string) {
  try {
    await db.insert(medicalQueries).values({
      question,
      answer,
      timestamp: new Date(),
      user_id: userId ? parseInt(userId) : undefined
    });
  } catch (error) {
    console.error("Error saving query result:", error);
    // Continue even if saving fails
  }
}

// Symptom Check Functions
export async function saveSymptomCheck(
  usersymptom: string,
  agegroup: string | undefined,
  result: any
) {
  try {
    await db.insert(symptomChecks).values({
      usersymptom,
      agegroup,
      result: JSON.stringify(result),
      timestamp: new Date(),
      user_id: null // Make user_id explicitly null for now
    } as any); // Use type assertion to bypass type check temporarily
  } catch (error) {
    console.error("Error saving symptom check:", error);
    // Continue even if saving fails
  }
}

// Medicine Analysis Functions
export async function saveMedicineAnalysis(
  image_data: string,
  image_type: string,
  analysis_result: any
) {
  try {
    await db.insert(medicineScans).values({
      image_data,
      image_type,
      analysis_result: JSON.stringify(analysis_result),
      timestamp: new Date(),
      user_id: null // Make user_id explicitly null for now
    } as any); // Use type assertion to bypass type check temporarily
  } catch (error) {
    console.error("Error saving medicine analysis:", error);
    // Continue even if saving fails
  }
}

// Voice Interaction Functions
export async function saveVoiceInteraction(input: string, response: string) {
  try {
    await db.insert(voiceInteractions).values({
      user_input: input,
      system_response: response,
      timestamp: new Date(),
      user_id: null // Make user_id explicitly null for now
    } as any); // Use type assertion to bypass type check temporarily
  } catch (error) {
    console.error("Error saving voice interaction:", error);
    // Continue even if saving fails
  }
}
