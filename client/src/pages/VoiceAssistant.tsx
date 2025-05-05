import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import SpeechWave from "@/components/SpeechWave";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Message } from "@/types";

export default function VoiceAssistant() {
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MediSage AI. How can I assist you with your medical questions today? You can ask about symptoms, medications, or general health advice."
    }
  ]);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { settings } = useUserSettings();
  
  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useVoiceRecognition();
  const { speak, speaking, cancel } = useSpeechSynthesis({ rate: settings.voiceSpeed });

  // Scroll to bottom when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Process transcript when voice recognition stops
  useEffect(() => {
    if (!isListening && transcript && isListeningActive) {
      processVoiceInput(transcript);
    }
  }, [isListening, transcript, isListeningActive]);

  // Read the first assistant message when component mounts
  useEffect(() => {
    if (settings.voiceInterface && conversation.length > 0 && conversation[0].role === "assistant") {
      setTimeout(() => {
        speak(conversation[0].content);
      }, 1000);
    }
  }, []);

  const voiceAssistantMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await apiRequest("POST", "/api/voice-assistant", { input });
      return res.json();
    },
    onSuccess: (data: { answer: string }) => {
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer
      };
      
      setConversation(prev => [...prev, assistantMessage]);
      
      // Speak the response
      if (settings.voiceInterface) {
        speak(data.answer);
      }
      
      // After response, restart listening
      setTimeout(() => {
        if (isListeningActive && !speaking) {
          startListening();
        }
      }, 1000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your request. Please try again.",
        variant: "destructive"
      });
      
      // After error, restart listening
      setTimeout(() => {
        if (isListeningActive) {
          startListening();
        }
      }, 1000);
    }
  });

  const handleActivate = () => {
    if (!hasRecognitionSupport) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }
    
    setIsListeningActive(prev => {
      const newState = !prev;
      if (newState) {
        if (speaking) {
          cancel();
        }
        startListening();
        
        toast({
          title: "Voice Assistant Activated",
          description: "I'm listening. Speak clearly to ask your medical question.",
        });
      } else {
        stopListening();
        
        toast({
          title: "Voice Assistant Deactivated",
          description: "Voice input has been turned off.",
        });
      }
      return newState;
    });
  };

  const processVoiceInput = (input: string) => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: "user",
      content: input
    };
    
    setConversation(prev => [...prev, userMessage]);
    
    // Process the voice input
    voiceAssistantMutation.mutate(input);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Voice Assistant</h2>
        <p className="text-sm text-gray-600">Interact with MediSage using your voice. Ideal for visually impaired users.</p>
      </div>
      
      <div className="p-4 text-center">
        <div className="mb-8">
          <button 
            onClick={handleActivate}
            className={`h-24 w-24 rounded-full flex items-center justify-center mx-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary-100 ${
              isListeningActive ? 'bg-primary-200 speech-recognition-active' : 'bg-primary-100'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-12 w-12 ${isListeningActive ? 'text-primary-800' : 'text-primary'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <p className="mt-2 text-sm text-gray-600">
            {isListeningActive 
              ? (isListening 
                 ? "Listening... Speak clearly" 
                 : "Processing your request...")
              : "Tap the microphone to start speaking"}
          </p>
          {isListeningActive && isListening && (
            <div className="flex justify-center mt-2">
              <SpeechWave isActive={true} />
            </div>
          )}
        </div>
        
        <div className="max-w-lg mx-auto bg-gray-50 rounded-lg p-4 text-left h-64 overflow-y-auto mb-4">
          {conversation.map((message, index) => (
            <div key={index} className="flex items-start mb-4">
              <div className="flex-shrink-0">
                {message.role === "assistant" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-800">{message.content}</p>
                {message.role === "assistant" && message.content.includes("\n") && (
                  <ul className="list-disc pl-5 text-sm mt-1 text-gray-800">
                    {message.content.split("\n").filter(line => line.trim().startsWith("-")).map((line, i) => (
                      <li key={i}>{line.trim().substring(1)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>
        
        <div className="bg-primary-50 rounded-lg p-4 max-w-lg mx-auto text-left">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Voice Commands Guide</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">Ask</span>
              <span>"What are the symptoms of [condition]?"</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">Ask</span>
              <span>"How do I treat [symptom]?"</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">Say</span>
              <span>"Check my symptoms: [describe symptoms]"</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">Say</span>
              <span>"Scan medicine" to activate the medicine scanner</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
