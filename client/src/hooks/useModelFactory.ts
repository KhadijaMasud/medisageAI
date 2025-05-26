import { AIModel, ModelTier } from '@/lib/models/modelTypes';

// Factory Pattern Implementation
export function useModelFactory() {
  // Model creation method
  const createModel = (id: string, name: string, tier: ModelTier, description: string): AIModel => {
    return {
      id,
      name,
      tier,
      description,
      // Additional properties could be set based on the model type
      capabilities: {
        textGeneration: true,
        imageAnalysis: tier === 'corporate',
        voiceProcessing: tier === 'corporate',
      },
      apiConfig: {
        baseUrl: `https://api.example.com/${id}`,
        version: '1.0',
      }
    };
  };
  
  return { createModel };
}
