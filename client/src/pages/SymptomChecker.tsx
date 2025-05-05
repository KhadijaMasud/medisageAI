import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import VoiceToggle from "@/components/VoiceToggle";
import SpeechWave from "@/components/SpeechWave";
import { useUserSettings } from "@/hooks/useUserSettings";

type FormData = {
  symptoms: string;
  age: string;
  gender: string;
  conditions: {
    diabetes: boolean;
    hypertension: boolean;
    heartDisease: boolean;
    asthma: boolean;
  };
};

type ConditionResult = {
  name: string;
  probability: "high" | "medium" | "low";
  description: string;
};

type SymptomAnalysisResult = {
  conditions: ConditionResult[];
  recommendations: string[];
};

export default function SymptomChecker() {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      symptoms: "",
      age: "",
      gender: "",
      conditions: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        asthma: false,
      }
    }
  });
  
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisResult | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { toast } = useToast();
  const { settings } = useUserSettings();
  const symptomsFieldRef = useRef<HTMLTextAreaElement>(null);
  
  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useVoiceRecognition();
  const { speak, cancel, speaking } = useSpeechSynthesis({ rate: settings.voiceSpeed });

  // Watch symptoms field
  const symptoms = watch("symptoms");

  // Update symptoms field when transcript changes
  const handleTranscriptChange = () => {
    if (transcript) {
      setValue("symptoms", transcript);
    }
  };

  const analyzeSymptomsMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/symptom-checker", data);
      return res.json();
    },
    onSuccess: (data: SymptomAnalysisResult) => {
      setAnalysisResult(data);
      
      // If voice interface is enabled, read out a summary
      if (settings.voiceInterface && isVoiceMode) {
        const summary = `
          Based on your symptoms, I've identified ${data.conditions.length} possible conditions.
          ${data.conditions[0]?.name ? `The most likely is ${data.conditions[0].name}.` : ''}
          My top recommendations are: ${data.recommendations.slice(0, 2).join(', ')}.
          Please review the full results on screen.
        `;
        speak(summary);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FormData) => {
    if (speaking) {
      cancel();
    }
    analyzeSymptomsMutation.mutate(data);
  };

  const handleVoiceToggle = () => {
    if (!hasRecognitionSupport) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }
    
    setIsVoiceMode(prev => {
      const newState = !prev;
      if (newState) {
        startListening();
        symptomsFieldRef.current?.focus();
      } else {
        stopListening();
      }
      handleTranscriptChange();
      return newState;
    });
  };

  const getProbabilityBadgeClass = (probability: string) => {
    switch(probability) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Symptom Checker</h2>
        <p className="text-sm text-gray-600">Enter your symptoms to get possible conditions and recommendations.</p>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
              Describe your symptoms
            </label>
            <textarea
              id="symptoms"
              rows={3}
              ref={symptomsFieldRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              placeholder="Example: Headache with fever, sore throat for 2 days"
              {...register("symptoms", { required: true })}
            />
            {isVoiceMode && isListening && (
              <div className="mt-1 flex items-center">
                <SpeechWave isActive={true} />
                <span className="text-xs text-primary-700">Listening...</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <select
                id="age"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                {...register("age")}
              >
                <option value="">Select age range</option>
                <option value="child">0-12 years</option>
                <option value="teen">13-19 years</option>
                <option value="adult">20-64 years</option>
                <option value="senior">65+ years</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Biological Sex
              </label>
              <select
                id="gender"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                {...register("gender")}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other/Prefer not to say</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Do you have any of these pre-existing conditions?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  {...register("conditions.diabetes")}
                />
                <span className="ml-2 text-sm text-gray-700">Diabetes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  {...register("conditions.hypertension")}
                />
                <span className="ml-2 text-sm text-gray-700">Hypertension</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  {...register("conditions.heartDisease")}
                />
                <span className="ml-2 text-sm text-gray-700">Heart Disease</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  {...register("conditions.asthma")}
                />
                <span className="ml-2 text-sm text-gray-700">Asthma</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center">
            <VoiceToggle
              isActive={isVoiceMode}
              onClick={handleVoiceToggle}
              disabled={!hasRecognitionSupport}
            />
            <button
              type="submit"
              disabled={analyzeSymptomsMutation.isPending || !symptoms.trim()}
              className="ml-2 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {analyzeSymptomsMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </button>
          </div>
        </form>
      </div>
      
      {analysisResult && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Analysis Results</h3>
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Possible Conditions</h4>
            <ul className="space-y-2">
              {analysisResult.conditions.map((condition, index) => (
                <li key={index} className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProbabilityBadgeClass(condition.probability)}`}>
                        {condition.probability.charAt(0).toUpperCase() + condition.probability.slice(1)} Probability
                      </span>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{condition.name}</h5>
                      <p className="text-xs text-gray-500 mt-1">{condition.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-primary-50 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Recommendations</h4>
            <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
              {analysisResult.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
            
            <div className="mt-4 pt-3 border-t border-primary-100">
              <p className="text-xs text-gray-500 italic">
                <strong>Disclaimer:</strong> This is not a medical diagnosis. Always consult with a healthcare professional for proper medical advice and treatment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
