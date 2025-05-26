import { useState, useEffect } from "react";
import { useModel } from "@/contexts/ModelContext";
import { useAuth } from "@/contexts/AuthContext";
import { CircleHelp, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InfoPanel } from "@/components/InfoPanel";

type ModelSelectorProps = {
  onHelpClick?: () => void;
};

export function ModelSelector({ onHelpClick }: ModelSelectorProps) {
  const { userTier } = useAuth();
  const { allModels, activeModel, setActiveModel } = useModel();
  const [selectedModelId, setSelectedModelId] = useState<string>(activeModel.id);
  const [isChanging, setIsChanging] = useState(false);
  
  // Update the selector when activeModel changes externally
  useEffect(() => {
    setSelectedModelId(activeModel.id);
  }, [activeModel]);
  
  // Filter models based on user's tier
  const availableModels = allModels.filter(model => {
    if (userTier === 'corporate') return true;
    return model.tier === 'personal';
  });
  
  const handleApplyModel = () => {
    const newModel = allModels.find(model => model.id === selectedModelId);
    if (newModel) {
      setIsChanging(true);
      
      // Simulate a short delay for the "switching" effect
      setTimeout(() => {
        setActiveModel(newModel);
        setIsChanging(false);
      }, 600);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-secondary-800">AI Model Selection</h2>
            <p className="text-secondary-500">Choose the AI model that best suits your needs</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Select 
                value={selectedModelId} 
                onValueChange={setSelectedModelId}
                disabled={isChanging}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.tier === 'corporate' ? 'Corporate' : 'Personal'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleApplyModel} 
              disabled={selectedModelId === activeModel.id || isChanging}
              className="inline-flex items-center"
            >
              {isChanging ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Apply Model
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Current model info panel */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="flex items-center">
            <CircleHelp className="h-5 w-5 text-primary-500 mr-2" />
            <div>
              <span className="text-secondary-700 font-medium">Current Model:</span>
              <span className="ml-1 text-primary-600 font-semibold">{activeModel.name}</span>
              <span className="ml-2 text-xs bg-primary-100 text-primary-800 py-0.5 px-2 rounded-full">
                {activeModel.tier === 'corporate' ? 'Corporate Tier' : 'Personal Tier'}
              </span>
              {onHelpClick && (
                <button 
                  className="ml-2 text-xs text-primary-600 hover:text-primary-800 underline" 
                  onClick={onHelpClick}
                >
                  How to use?
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-secondary-600">
            {activeModel.description}
          </p>
        </div>
      </div>
    </div>
  );
}
