import React, { createContext, useContext, useState, useEffect } from 'react';
import { useModelFactory } from '@/hooks/useModelFactory';
import { useModelStrategy } from '@/hooks/useModelStrategy';
import { AIModel } from '@/lib/models/modelTypes';
import { useAuth } from './AuthContext';

interface ModelContextType {
  activeModel: AIModel;
  allModels: AIModel[];
  setActiveModel: (model: AIModel) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const { userTier } = useAuth();
  const modelFactory = useModelFactory();
  const modelStrategy = useModelStrategy();
  
  // Initialize available models
  const allModels = [
    // Corporate models
    modelFactory.createModel('gpt4', 'GPT-4 Turbo', 'corporate', 'GPT-4 Turbo offers advanced medical knowledge, high accuracy, and nuanced understanding of complex health queries.'),
    modelFactory.createModel('claude3', 'Claude 3 Opus', 'corporate', 'Claude 3 Opus provides comprehensive biomedical knowledge with precise, nuanced healthcare responses.'),
    modelFactory.createModel('gemini', 'Gemini Pro', 'corporate', 'Gemini Pro excels at multimodal healthcare analysis, combining text and image understanding for diagnostics.'),
    
    // Personal models
    modelFactory.createModel('mistral', 'Mistral Medium', 'personal', 'Mistral Medium offers balanced performance with good medical knowledge at lower computational requirements.'),
    modelFactory.createModel('llama3', 'Llama 3', 'personal', 'Llama 3 provides basic medical assistance with efficient resource usage, ideal for personal queries.')
  ];
  
  // Set default active model based on user tier
  const [activeModel, setActiveModelState] = useState<AIModel>(
    userTier === 'corporate' 
      ? allModels.find(m => m.id === 'gpt4')! 
      : allModels.find(m => m.id === 'mistral')!
  );
  
  // Update active model when user tier changes
  useEffect(() => {
    // If current model is not available in the new tier, switch to default for that tier
    const isModelAvailableForTier = userTier === 'corporate' || activeModel.tier === 'personal';
    
    if (!isModelAvailableForTier) {
      setActiveModelState(allModels.find(m => m.id === 'mistral')!);
    }
  }, [userTier, activeModel, allModels]);
  
  // Switch model implementation using strategy pattern
  const setActiveModel = (model: AIModel) => {
    modelStrategy.switchModel(model);
    setActiveModelState(model);
  };
  
  return (
    <ModelContext.Provider value={{ activeModel, allModels, setActiveModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
