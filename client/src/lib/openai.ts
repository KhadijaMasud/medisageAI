// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// Client-side implementation for handling OpenAI calls through our API
export async function analyzeMedicalQuery(question: string): Promise<string> {
  try {
    const response = await fetch('/api/medical-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Error analyzing medical query:', error);
    throw error;
  }
}

export async function analyzeSymptoms(symptoms: string, age?: string, gender?: string, conditions?: Record<string, boolean>): Promise<any> {
  try {
    const response = await fetch('/api/symptom-checker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms, age, gender, conditions }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
}

export async function analyzeMedicineImage(imageData: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('image', imageData);

    const response = await fetch('/api/medicine-scanner', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing medicine image:', error);
    throw error;
  }
}

export async function processVoiceCommand(command: string): Promise<string> {
  try {
    const response = await fetch('/api/voice-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: command }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
}
