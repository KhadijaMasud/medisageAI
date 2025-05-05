import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Process medical queries - for general medical questions
export async function getMedicalQueryResponse(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are MediSage AI, a medical assistant that provides accurate, helpful information about medical topics.
                   Your responses should be informative, evidence-based, and easy to understand for the general public.
                   Always include appropriate disclaimers where necessary and never provide definitive medical diagnoses.
                   Always encourage consulting healthcare professionals for personalized advice.`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error in getMedicalQueryResponse:", error);
    throw new Error("Failed to get response from OpenAI");
  }
}

// Analyze symptoms and provide possible conditions and recommendations
export async function analyzeSymptoms(
  symptoms: string,
  ageGroup?: string,
  gender?: string,
  conditions?: Record<string, boolean>
): Promise<any> {
  try {
    // Format pre-existing conditions
    const preExistingConditionsList = conditions
      ? Object.entries(conditions)
          .filter(([_, value]) => value)
          .map(([condition]) => condition)
      : [];

    const preExistingConditionsText = preExistingConditionsList.length > 0
      ? `Pre-existing conditions: ${preExistingConditionsList.join(", ")}.`
      : "No known pre-existing conditions.";

    // Demographic information
    const demographicInfo = `
      ${ageGroup ? `Age group: ${ageGroup}.` : "Age: Unknown."}
      ${gender ? `Biological sex: ${gender}.` : "Biological sex: Unknown."}
      ${preExistingConditionsText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are MediSage AI, a medical assistant that analyzes symptoms and provides information about possible conditions.
                   Based on the symptoms described, provide a list of potential conditions along with probability levels (high, medium, low)
                   and recommendations. Your response should be structured as JSON with 'conditions' (array of objects with name, probability, and description)
                   and 'recommendations' (array of strings). Do not include personal commentary or introductions in your response.
                   Always include a disclaimer about seeking professional medical advice.`
        },
        {
          role: "user",
          content: `Analyze these symptoms: ${symptoms}\n\nAdditional information:\n${demographicInfo}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error in analyzeSymptoms:", error);
    throw new Error("Failed to analyze symptoms");
  }
}

// Analyze medicine images and provide information about identified medications
export async function analyzeMedicineImage(base64Image: string, mimeType: string): Promise<any> {
  try {
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are MediSage AI, a medical assistant specialized in identifying medications from images.
                   When presented with an image of a medication, identify it and provide detailed information about it.
                   Format your response as JSON with the following structure:
                   {
                     "name": "Full medication name with dosage",
                     "primaryUse": "Primary purpose of the medication",
                     "commonUses": ["List", "of", "common", "uses"],
                     "dosage": "Typical dosage information",
                     "warnings": "Important warnings and side effects"
                   }
                   If you cannot identify the medication with confidence, be honest about limitations and suggest getting professional verification.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this medication and provide information about it:" },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error in analyzeMedicineImage:", error);
    throw new Error("Failed to analyze medicine image");
  }
}

// Process voice commands and provide appropriate responses
export async function processVoiceCommand(command: string): Promise<string> {
  try {
    // Check for specific command patterns
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("check my symptoms") || lowerCommand.includes("symptom check")) {
      return "I'll help you check your symptoms. Could you describe them in detail? Include when they started and any other relevant information.";
    }
    
    if (lowerCommand.includes("scan medicine") || lowerCommand.includes("identify medicine")) {
      return "To scan a medicine, please go to the Medicine Scanner tab and upload a clear image of the medication.";
    }

    // For general medical queries, use the regular medical query function
    return await getMedicalQueryResponse(command);
  } catch (error) {
    console.error("Error in processVoiceCommand:", error);
    throw new Error("Failed to process voice command");
  }
}
