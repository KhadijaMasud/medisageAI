import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import MedicalChat from "@/pages/MedicalChat";
import SymptomChecker from "@/pages/SymptomChecker";
import MedicineScanner from "@/pages/MedicineScanner";
import VoiceAssistant from "@/pages/VoiceAssistant";
import InfoPanel from "@/components/InfoPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Model types
type Model = {
  id: string;
  name: string;
  description: string;
  tier: "personal" | "corporate";
  features: string[];
};

// Available models
const AVAILABLE_MODELS: Model[] = [
  {
    id: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    name: "Mixtral-8x7B",
    description: "Cost-efficient model for personal use",
    tier: "personal",
    features: ["medical-chat", "symptom-checker"]
  },
  {
    id: "meta-llama/Llama-3-70b-chat-hf",
    name: "Llama-3-70B",
    description: "High-quality model for corporate users",
    tier: "corporate",
    features: ["medical-chat", "symptom-checker", "medicine-scanner", "voice-interface"]
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Premium model for corporate users",
    tier: "corporate",
    features: ["medical-chat", "symptom-checker", "medicine-scanner", "voice-interface"]
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("welcome");
  const [selectedModel, setSelectedModel] = useState<Model>(AVAILABLE_MODELS[0]);
  const [subscriptionTier, setSubscriptionTier] = useState<"personal" | "corporate">("personal");
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Filter models based on subscription tier
  const filteredModels = AVAILABLE_MODELS.filter(
    (model) => model.tier === subscriptionTier
  );

  // Update selected model when subscription tier changes
  useEffect(() => {
    const defaultModelForTier = filteredModels[0];
    if (defaultModelForTier && selectedModel.tier !== subscriptionTier) {
      setSelectedModel(defaultModelForTier);
    }
  }, [subscriptionTier, filteredModels, selectedModel.tier]);

  // Handle model switching
  const handleModelChange = (modelId: string) => {
    const newModel = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (newModel) {
      setSelectedModel(newModel);
      
      // If current active tab isn't available for the new model, switch to welcome
      if (!newModel.features.includes(activeTab)) {
        setActiveTab("welcome");
      }
    }
  };

  // Check if current active tab is available for selected model
  const isCurrentTabAvailable = selectedModel.features.includes(activeTab) || activeTab === "welcome";

  // Listen for the reset-to-home event
  useEffect(() => {
    const handleResetToHome = () => {
      setActiveTab("welcome");
    };

    window.addEventListener("reset-to-home", handleResetToHome);

    return () => {
      window.removeEventListener("reset-to-home", handleResetToHome);
    };
  }, []);

  // Handle navigation to authentication page
  const navigateToAuth = () => {
    setLocation("/auth");
  };

  // Navigate to a feature page with model availability check
  const navigateToFeature = (featureId: string) => {
    if (selectedModel.features.includes(featureId) || featureId === "welcome") {
      setActiveTab(featureId);
    } else {
      // If feature isn't available for current model, show warning and switch to welcome
      alert(`This feature is not available with the ${selectedModel.name} model.`);
      setActiveTab("welcome");
    }
  };

  const renderWelcomePage = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-80"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
            Your AI-Powered Health Assistant
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            MediSage AI provides intelligent healthcare support with medical information, symptom analysis, 
            medication identification, and accessible voice interaction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigateToFeature("medical-chat")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Ask a Medical Question
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigateToFeature("symptom-checker")}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Check Your Symptoms
            </Button>
            {subscriptionTier === "corporate" && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigateToFeature("medicine-scanner")}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Scan Medicine
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigateToFeature("voice-interface")}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Voice Assistant
                </Button>
              </>
            )}
            {!isAuthenticated && (
              <Button
                size="lg"
                variant="secondary"
                onClick={navigateToAuth}
                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              >
                Create an Account
              </Button>
            )}
          </div>
        </div>
      </section>
{/* Subscription and Model Selection */}
<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="bg-white p-6 rounded-lg shadow-md space-y-8">

    {/* Subscription Tier Selection */}
    <div>
      <h2 className="text-2xl font-semibold mb-4">Subscription Tier</h2>
      <div className="flex gap-4">
        <Button
          variant={subscriptionTier === "personal" ? "default" : "outline"}
          onClick={() => setSubscriptionTier("personal")}
        >
          Personal Tier
        </Button>
        <Button
          variant={subscriptionTier === "corporate" ? "default" : "outline"}
          onClick={() => setSubscriptionTier("corporate")}
        >
          Corporate Tier
        </Button>
      </div>
    </div>

    {/* Subscription Tier Descriptions */}
    <div>
      <h2 className="text-2xl font-semibold mb-6">Available Subscription Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Corporate Tier Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💼</span>
            <h3 className="text-xl font-bold">Corporate Tier</h3>
          </div>
          <p className="text-gray-700 mb-4">
            High-performance, enterprise-grade AI models with advanced capabilities for professional healthcare environments.
          </p>
          <h4 className="font-semibold mb-2">Available Models:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
            <li><strong>GPT-4 Turbo</strong> — Advanced medical knowledge and nuanced understanding of health queries.</li>
            <li><strong>Claude 3 Opus</strong> — Comprehensive biomedical knowledge with accurate healthcare responses.</li>
            <li><strong>Gemini Pro</strong> — Multimodal healthcare analysis combining text and image diagnostics.</li>
          </ul>
        </div>

        {/* Personal Tier Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👤</span>
            <h3 className="text-xl font-bold">Personal Tier</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Cost-efficient AI models optimized for individual use with good performance and lower resource requirements.
          </p>
          <h4 className="font-semibold mb-2">Available Models:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
            <li><strong>Mistral Medium</strong> — Good medical knowledge with lower computational requirements.</li>
            <li><strong>Llama 3</strong> — Basic medical assistance for personal queries with efficient resource use.</li>
          </ul>
        </div>
      </div>
    </div>

    {/* Model Selector */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Select AI Model</h2>
      <Select value={selectedModel.id} onValueChange={handleModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {filteredModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                <span className="text-sm text-gray-500">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* Selected Model Summary */}
    <div className="bg-blue-50 p-4 rounded-md">
      <p className="font-medium">
        Current Model: <span className="text-blue-600">{selectedModel.name}</span>
      </p>
      <p className="text-sm text-gray-600 mt-1">
        {selectedModel.description} ({subscriptionTier} tier)
      </p>
      <p className="text-sm mt-2">
        <span className="font-medium">Available Features:</span>{" "}
        {selectedModel.features
          .map((f) => {
            switch (f) {
              case "medical-chat":
                return "Medical Chat";
              case "symptom-checker":
                return "Symptom Checker";
              case "medicine-scanner":
                return "Medicine Scanner";
              case "voice-interface":
                return "Voice Assistant";
              default:
                return f;
            }
          })
          .join(", ")}
      </p>
    </div>

  </div>
</section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoPanel 
              title="Medical Chat" 
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
            >
              <p className="mb-4">Get accurate, evidence-based answers to your medical questions from our AI assistant.</p>
              <Button 
                onClick={() => navigateToFeature("medical-chat")} 
                className="w-full mt-2"
              >
                Start Chat
              </Button>
            </InfoPanel>

            <InfoPanel 
              title="Symptom Checker" 
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <p className="mb-4">Describe your symptoms and receive an analysis of potential conditions and recommended actions.</p>
              <Button 
                onClick={() => navigateToFeature("symptom-checker")} 
                className="w-full mt-2"
              >
                Check Symptoms
              </Button>
            </InfoPanel>

            {subscriptionTier === "corporate" && (
              <>
                <InfoPanel 
                  title="Medicine Scanner" 
                  icon={
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  }
                >
                  <p className="mb-4">Upload an image of your medication to identify it and learn about its uses, dosage, and warnings.</p>
                  <Button 
                    onClick={() => navigateToFeature("medicine-scanner")} 
                    className="w-full mt-2"
                  >
                    Scan Medicine
                  </Button>
                </InfoPanel>

                <InfoPanel 
                  title="Voice Assistant" 
                  icon={
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  }
                >
                  <p className="mb-4">Hands-free interaction with our medical assistant using voice commands and speech responses.</p>
                  <Button 
                    onClick={() => navigateToFeature("voice-interface")} 
                    className="w-full mt-2"
                  >
                    Use Voice Assistant
                  </Button>
                </InfoPanel>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Medical Disclaimer</h2>
          <p className="text-gray-700">
            MediSage AI is designed to provide general information and is not a substitute for professional 
            medical advice, diagnosis, or treatment. Always seek the advice of your physician or other 
            qualified health provider with any questions you may have regarding a medical condition. 
            Never disregard professional medical advice or delay in seeking it because of something you 
            have read on this website.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <div>
      <Navigation activeTab={activeTab} onTabChange={navigateToFeature} />
      
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isCurrentTabAvailable ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Feature Not Available</h2>
            <p className="text-gray-600 mb-6">
              The {activeTab.replace("-", " ")} feature is not available with the {selectedModel.name} model.
            </p>
            <Button onClick={() => setActiveTab("welcome")}>Return to Home</Button>
          </div>
        ) : (
          <>
            {activeTab === "welcome" && renderWelcomePage()}
            {activeTab === "medical-chat" && <MedicalChat model={selectedModel} />}
            {activeTab === "symptom-checker" && <SymptomChecker model={selectedModel} />}
            {activeTab === "medicine-scanner" && <MedicineScanner model={selectedModel} />}
            {activeTab === "voice-interface" && <VoiceAssistant model={selectedModel} />}
          </>
        )}
      </main>
    </div>
  );
}