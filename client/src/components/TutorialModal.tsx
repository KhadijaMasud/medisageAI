import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TutorialModalProps {
  onClose?: () => void;
  forceOpen?: boolean;
}

export default function TutorialModal({ onClose, forceOpen = false }: TutorialModalProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentTab, setCurrentTab] = useState("welcome");
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial before
    const tutorialSeen = localStorage.getItem('medisageTutorialSeen');
    if (!tutorialSeen && !forceOpen) {
      setIsOpen(true);
      setHasSeenTutorial(false);
    } else if (!forceOpen) {
      setHasSeenTutorial(true);
    }
  }, [forceOpen]);

  // If forceOpen changes, update isOpen state
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Mark tutorial as seen
    localStorage.setItem('medisageTutorialSeen', 'true');
    // Call the external onClose if provided
    if (onClose) {
      onClose();
    }
  };

  const handleOpenTutorial = () => {
    setIsOpen(true);
    setCurrentTab("welcome");
  };

  return (
    <>
      {!hasSeenTutorial && (
        <div className="fixed bottom-4 right-4 z-50 animate-bounce">
          <Button 
            onClick={handleOpenTutorial}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            <span className="mr-2 text-xl">💡</span> Tutorial
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Welcome to MediSage AI</DialogTitle>
            <DialogDescription>
              Your personal medical assistant powered by AI
            </DialogDescription>
          </DialogHeader>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="chat">Medical Chat</TabsTrigger>
              <TabsTrigger value="symptoms">Symptom Checker</TabsTrigger>
              <TabsTrigger value="medicine">Medicine Scanner</TabsTrigger>
              <TabsTrigger value="voice">Voice Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="welcome" className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-semibold">Welcome to MediSage AI</h3>
                <p className="text-center mt-2 max-w-md">
                  Your comprehensive health assistant with AI-powered features to help you
                  understand health concerns, analyze symptoms, identify medications, and more.
                </p>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: "💬", title: "Medical Chat", desc: "Ask health questions" },
                    { icon: "🩺", title: "Symptom Checker", desc: "Analyze your symptoms" },
                    { icon: "💊", title: "Medicine Scanner", desc: "Identify medications" },
                    { icon: "🎤", title: "Voice Assistant", desc: "Talk to get answers" },
                  ].map((feature, i) => (
                    <div key={i} className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-sm text-muted-foreground">
                  Click through the tabs above to learn about each feature.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Medical Chat</h3>
                  <p className="mb-4">
                    Have medical questions? Our AI-powered chat can help provide information based on
                    medical knowledge.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How to use:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click on the "Medical Chat" tab</li>
                      <li>Type your health-related question in the chat box</li>
                      <li>Press enter or click the send button</li>
                      <li>Read the AI's response with relevant medical information</li>
                    </ol>
                  </div>
                  <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example questions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>"What are the symptoms of the flu?"</li>
                      <li>"How can I manage my allergies?"</li>
                      <li>"What's the difference between a cold and COVID-19?"</li>
                      <li>"What should I know about blood pressure?"</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-1 bg-card p-4 rounded-lg border">
                  <div className="bg-card rounded-lg flex flex-col h-[300px]">
                    <div className="p-3 bg-primary/10 rounded-t-lg">
                      <h4 className="font-medium">Medical Chat</h4>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      <div className="user-message message">
                        What are common symptoms of dehydration?
                      </div>
                      <div className="bot-message message">
                        Common symptoms of dehydration include:<br/>
                        • Increased thirst<br/>
                        • Dry mouth and tongue<br/>
                        • Feeling tired or fatigued<br/>
                        • Less frequent urination<br/>
                        • Dark-colored urine<br/>
                        • Headache and dizziness<br/><br/>
                        
                        For severe dehydration, seek medical attention if you experience extreme thirst, no urination, 
                        confusion, or rapid heartbeat.
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <div className="flex items-center bg-background rounded-md px-3 py-2">
                        <span className="text-muted-foreground">Type your question here...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Symptom Checker</h3>
                  <p className="mb-4">
                    Describe your symptoms and get information about possible conditions and recommendations.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How to use:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click on the "Symptom Checker" tab</li>
                      <li>Enter your symptoms in detail</li>
                      <li>Provide your age and gender (optional but recommended)</li>
                      <li>Check any pre-existing conditions you may have</li>
                      <li>Click "Analyze Symptoms" to receive possible conditions and recommendations</li>
                    </ol>
                  </div>
                  <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Example input:</h4>
                    <p className="italic">
                      "I've had a headache, fever around 101°F, and sore throat for the past 2 days.
                      I also feel very tired and have some body aches."
                    </p>
                  </div>
                </div>
                <div className="flex-1 bg-card p-4 rounded-lg border">
                  <div className="bg-card rounded-lg flex flex-col h-[300px]">
                    <div className="p-3 bg-primary/10 rounded-t-lg">
                      <h4 className="font-medium">Symptom Analysis</h4>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="mb-4">
                        <div className="font-medium mb-2">Based on your symptoms, possible conditions include:</div>
                        <div className="space-y-2">
                          <div className="p-2 border rounded-md bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900">
                            <div className="font-medium">Influenza (High probability)</div>
                            <p className="text-sm">Flu is a viral infection that attacks the respiratory system.</p>
                          </div>
                          <div className="p-2 border rounded-md bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900">
                            <div className="font-medium">COVID-19 (Medium probability)</div>
                            <p className="text-sm">A respiratory illness that can spread from person to person.</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-2">Recommendations:</div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Get plenty of rest</li>
                          <li>Stay hydrated</li>
                          <li>Take over-the-counter fever reducers if needed</li>
                          <li>Consider getting tested for flu or COVID-19</li>
                          <li>Consult a healthcare provider if symptoms worsen</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medicine" className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Medicine Scanner</h3>
                  <p className="mb-4">
                    Upload an image of a medication, and our AI will identify it and provide useful information.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How to use:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click on the "Medicine Scanner" tab</li>
                      <li>Upload a clear photo of a medicine package or pill</li>
                      <li>Wait for the AI to analyze the image</li>
                      <li>Review the information about the identified medication</li>
                    </ol>
                  </div>
                  <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tips for best results:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ensure good lighting when taking the photo</li>
                      <li>Make sure the medicine name is clearly visible</li>
                      <li>Avoid shadows or glare on the package</li>
                      <li>Include both the brand name and generic name if possible</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-1 bg-card p-4 rounded-lg border">
                  <div className="bg-card rounded-lg flex flex-col h-[300px]">
                    <div className="p-3 bg-primary/10 rounded-t-lg">
                      <h4 className="font-medium">Medicine Information</h4>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="text-center mb-4">
                        <div className="inline-block p-2 bg-muted rounded-lg mb-2">
                          <span className="text-2xl">💊</span>
                        </div>
                        <h3 className="font-medium text-lg">Acetaminophen (Tylenol)</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">PRIMARY USE</h4>
                          <p>Pain reliever and fever reducer</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">COMMON USES</h4>
                          <ul className="list-disc list-inside text-sm">
                            <li>Headaches</li>
                            <li>Muscle aches</li>
                            <li>Arthritis</li>
                            <li>Backache</li>
                            <li>Fever reduction</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">DOSAGE</h4>
                          <p className="text-sm">Adults and children 12 years and over: 2 tablets every 4-6 hours as needed. Do not exceed 12 tablets in 24 hours.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground">WARNINGS</h4>
                          <p className="text-sm">Liver warning: This product contains acetaminophen. Severe liver damage may occur if you take more than the maximum daily amount, with other drugs containing acetaminophen, or if you have 3 or more alcoholic drinks every day.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Voice Assistant</h3>
                  <p className="mb-4">
                    Use your voice to ask health-related questions and receive spoken responses.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">How to use:</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Click on the "Voice Assistant" tab</li>
                      <li>Click the microphone button to start voice recognition</li>
                      <li>Speak your health-related question clearly</li>
                      <li>Wait for the assistant to process your question</li>
                      <li>The assistant will respond both in text and with voice output</li>
                      <li>Click the microphone again to stop listening or ask another question</li>
                    </ol>
                  </div>
                  <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Voice commands examples:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>"What are the best ways to lower cholesterol?"</li>
                      <li>"Tell me about diabetes symptoms"</li>
                      <li>"How many hours of sleep should I get?"</li>
                      <li>"What vitamins should I take daily?"</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-1 bg-card p-4 rounded-lg border">
                  <div className="bg-card rounded-lg flex flex-col h-[300px]">
                    <div className="p-3 bg-primary/10 rounded-t-lg">
                      <h4 className="font-medium">Voice Assistant</h4>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <div className="text-2xl">🎤</div>
                      </div>
                      <div className="text-center mb-2">
                        <div className="font-medium">Press the microphone to speak</div>
                        <p className="text-sm text-muted-foreground">Ask any health-related question</p>
                      </div>
                      <div className="mt-4 speech-wave opacity-50">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ height: '5px' }}></span>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground text-center">
                        <p>Example: "What are the symptoms of dehydration?"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center">
            <div>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (currentTab === "welcome") return;
                  const tabs = ["welcome", "chat", "symptoms", "medicine", "voice"];
                  const currentIndex = tabs.indexOf(currentTab);
                  setCurrentTab(tabs[currentIndex - 1]);
                }}
                disabled={currentTab === "welcome"}
              >
                Previous
              </Button>
              <Button 
                onClick={() => {
                  const tabs = ["welcome", "chat", "symptoms", "medicine", "voice"];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1]);
                  }
                }}
                className="ml-2"
                disabled={currentTab === "voice"}
              >
                Next
              </Button>
            </div>
            <Button variant="secondary" onClick={handleClose}>
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}