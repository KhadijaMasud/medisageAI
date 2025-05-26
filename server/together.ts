import fetch from "node-fetch";

// Environment variables
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || "";
const GEMINI_API_KEY = "AIzaSyCqwPfr9nHLPqybNaPdjw2mWqhS98NmMBA"; // Replace with env variable in production
const BASE_URL = "https://api.together.xyz/v1";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Get the appropriate model config based on tier
function getModelConfig(tier: "personal" | "corporate"): {
  model: string;
  apiKey: string;
  baseUrl: string;
} {
  return tier === "corporate"
    ? {
        model: "gemini-pro", // or "gemini-pro-vision" for multimodal
        apiKey: GEMINI_API_KEY,
        baseUrl: GEMINI_URL,
      }
    : {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        apiKey: TOGETHER_API_KEY,
        baseUrl: BASE_URL,
      };
}

// Process medical queries
export async function getMedicalQueryResponse(
  question: string,
  tier: "personal" | "corporate" = "personal"
): Promise<string> {
  try {
    const config = getModelConfig(tier);

    if (tier === "corporate") {
      // Gemini API call
      const response = await fetch(
        `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are MediSage AI, a medical assistant that provides accurate, helpful information about medical topics.
                      Your responses should be informative, evidence-based, and easy to understand.
                      Always include appropriate disclaimers and encourage consulting professionals.
                      
                      User question: ${question}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } else {
      // Together.ai API call (original implementation)
      const response = await fetch(`${config.baseUrl}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          prompt: `<s>[INST] You are MediSage AI...${question} [/INST]</s>`,
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json() as any;
      return data.choices[0].text || "No response generated.";
    }
  } catch (error: any) {
    console.error("Error in getMedicalQueryResponse:", error);
    throw error;
  }
}

// Analyze medicine image (corporate tier uses Gemini Pro Vision)
export async function analyzeMedicineImage(
  base64Image: string,
  mimeType: string,
  tier: "personal" | "corporate" = "corporate"
): Promise<ApiResponse> {
  if (tier === "personal") {
    return {
      success: false,
      error: "Image analysis requires corporate tier",
    };
  }

  try {
    const config = getModelConfig(tier);
    
    const response = await fetch(
      `${config.baseUrl}/models/gemini-pro-vision:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Identify this medication and provide: 1. Name 2. Primary use 3. Common uses 4. Typical dosage 5. Warnings. Respond in JSON format.",
                },
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini Vision error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Try to parse JSON response
    try {
      const jsonResponse = JSON.parse(responseText);
      return {
        success: true,
        data: jsonResponse,
      };
    } catch {
      return {
        success: true,
        data: {
          response: responseText,
        },
      };
    }
  } catch (error: any) {
    console.error("Error in analyzeMedicineImage:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Process voice commands (corporate tier uses Gemini)
export async function processVoiceCommand(
  command: string,
  tier: "personal" | "corporate" = "corporate"
): Promise<ApiResponse> {
  try {
    if (tier === "personal") {
      // Basic voice command processing for personal tier
      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes("check my symptoms") || lowerCommand.includes("symptom check")) {
        return {
          success: true,
          data: {
            text: "I'll help you check your symptoms. Could you describe them in detail?",
            action: "symptom-checker",
          },
        };
      }
      
      if (lowerCommand.includes("scan medicine") || lowerCommand.includes("identify medicine")) {
        return {
          success: true,
          data: {
            text: "Medicine scanning requires corporate tier subscription.",
            action: "upgrade-prompt",
          },
        };
      }

      // Fallback to medical query
      const response = await getMedicalQueryResponse(command, "personal");
      return {
        success: true,
        data: {
          text: response,
          action: "medical-response",
        },
      };
    } else {
      // Corporate tier uses Gemini for advanced voice processing
      const config = getModelConfig(tier);
      
      const response = await fetch(
        `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Process this voice command and respond with JSON containing:
                    - "action": one of ["medical-query", "symptom-check", "medicine-scan", "general-help"]
                    - "response": appropriate response text
                    - "parameters": any extracted parameters
                    
                    Command: ${command}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini voice processing error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      try {
        // Try to parse JSON response
        const jsonResponse = JSON.parse(responseText);
        return {
          success: true,
          data: jsonResponse,
        };
      } catch {
        return {
          success: true,
          data: {
            text: responseText,
            action: "medical-response",
          },
        };
      }
    }
  } catch (error: any) {
    console.error("Error in processVoiceCommand:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Analyze symptoms (updated for Gemini)
export async function analyzeSymptoms(
  symptoms: string,
  tier: "personal" | "corporate" = "personal",
  ageGroup?: string,
  gender?: string,
  conditions?: Record<string, boolean>
): Promise<any> {
  try {
    const config = getModelConfig(tier);

    if (tier === "corporate") {
      // Gemini API call
      const prompt = `As a medical assistant, analyze these symptoms: ${symptoms}
        ${ageGroup ? `Age: ${ageGroup}` : ""}
        ${gender ? `Gender: ${gender}` : ""}
        ${conditions ? `Existing conditions: ${Object.keys(conditions).join(", ")}` : ""}
        
        Respond with this JSON structure:
        {
          "conditions": [
            {
              "name": "condition name",
              "probability": "high/medium/low",
              "description": "description"
            }
          ],
          "recommendations": []
        }`;

      const response = await fetch(
        `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1500,
            },
          }),
        }
      );

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Try to parse JSON response
      try {
        return JSON.parse(responseText);
      } catch {
        throw new Error("Failed to parse Gemini response");
      }
    } else {
      // Original Together.ai implementation
      // ... (keep your existing implementation)
    }
  } catch (error: any) {
    console.error("Error in analyzeSymptoms:", error);
    throw error;
  }
}