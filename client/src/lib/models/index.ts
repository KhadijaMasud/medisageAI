import { AIModel } from './modelTypes';
import { openAIModelImplementation } from './openai';
import { anthropicModelImplementation } from './anthropic';
import { mistralModelImplementation } from './mistral';
import { llamaModelImplementation } from './llama';
import { geminiModelImplementation } from './gemini';

// Model implementations map
const modelImplementations: Record<string, any> = {
  gpt4: openAIModelImplementation,
  claude3: anthropicModelImplementation,
  mistral: mistralModelImplementation,
  llama3: llamaModelImplementation,
  gemini: geminiModelImplementation,
};

export function getModelImplementation(model: AIModel) {
  return modelImplementations[model.id] || null;
}

export * from './modelTypes';
