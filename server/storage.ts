import { db } from "@db";
import { users, medicalQueries, symptomChecks, medicineScans, voiceInteractions } from "@shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// User Authentication Functions
export async function getUserByUsername(username: string) {
  const results = await db.select().from(users).where(eq(users.username, username));
  return results.length > 0 ? results[0] : null;
}

export async function authenticateUser(username: string, password: string) {
  const user = await getUserByUsername(username);
  
  if (!user) return null;
  
  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return null;
  
  return user;
}

export async function createUser(username: string, password: string, email: string) {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const [newUser] = await db.insert(users)
    .values({
      username,
      password: hashedPassword,
      email,
      role: "user",
      auth_token: randomUUID()
    })
    .returning();
  
  return newUser;
}

// Medical Query Functions
export async function logMedicalQuery(question: string) {
  await db.insert(medicalQueries)
    .values({
      question,
      timestamp: new Date()
    });
}

export async function saveQueryResult(question: string, answer: string) {
  await db.insert(medicalQueries)
    .values({
      question,
      answer,
      timestamp: new Date()
    });
}

// Symptom Check Functions
export async function saveSymptomCheck(
  usersymptom: string,
  agegroup: string | undefined,
  result: any
) {
  await db.insert(symptomChecks)
    .values({
      usersymptom,
      agegroup,
      result: JSON.stringify(result),
      timestamp: new Date()
    });
}

// Medicine Analysis Functions
export async function saveMedicineAnalysis(
  image_data: string,
  image_type: string,
  analysis_result: any
) {
  await db.insert(medicineScans)
    .values({
      image_data,
      image_type,
      analysis_result: JSON.stringify(analysis_result),
      timestamp: new Date()
    });
}

// Voice Interaction Functions
export async function saveVoiceInteraction(input: string, response: string) {
  await db.insert(voiceInteractions)
    .values({
      user_input: input,
      system_response: response,
      timestamp: new Date()
    });
}
