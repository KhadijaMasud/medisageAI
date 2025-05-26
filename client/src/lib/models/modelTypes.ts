export type ModelTier = 'corporate' | 'personal';

export interface ModelCapabilities {
  textGeneration: boolean;
  imageAnalysis: boolean;
  voiceProcessing: boolean;
  [key: string]: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  version: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

export interface AIModel {
  id: string;
  name: string;
  tier: ModelTier;
  description: string;
  capabilities: ModelCapabilities;
  apiConfig: ApiConfig;
}

export interface ModelResponse {
  text: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface ModelRequest {
  prompt: string;
  options?: Record<string, any>;
}
