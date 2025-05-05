export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserSettings {
  highContrast: boolean;
  voiceInterface: boolean;
  textSize: string;
  voiceSpeed: number;
}

export interface SymptomCheckResult {
  conditions: {
    name: string;
    probability: 'high' | 'medium' | 'low';
    description: string;
  }[];
  recommendations: string[];
}

export interface MedicineInfo {
  name: string;
  primaryUse: string;
  commonUses: string[];
  dosage: string;
  warnings: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface MedicalQuery {
  question: string;
  context?: string;
  answer: string;
}

export interface SymptomCheck {
  usersymptom: string;
  agegroup?: string;
  medicalhistory?: string[];
  result?: SymptomCheckResult;
}

export interface MedicineImage {
  image_data: string;
  image_type: string;
  analysis_result?: MedicineInfo;
}
