import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/chatbot/ChatMessage";
import VoiceToggle from "@/components/VoiceToggle";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import SpeechWave from "@/components/SpeechWave";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Message } from "@/types";

export default function MedicalChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MediSage AI, your virtual medical assistant. I can answer general medical questions and provide information about symptoms, treatments, and medications. How can I help you today?"
    }
  ]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { settings } = useUserSettings();
  
  const { isListening, transcript, startListening, stopListening, hasRecognitionSupport } = useVoiceRecognition();
  const { speak, cancel, speaking } = useSpeechSynthesis({ rate: settings.voiceSpeed });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set transcript to input when voice recognition is active
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Automatically submit if transcript is complete and we're in voice mode
  useEffect(() => {
    if (isVoiceMode && transcript && !isListening && transcript !== '') {
      sendMessage(transcript);
    }
  }, [isListening, transcript, isVoiceMode]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ question }: { question: string }) => {
      const res = await apiRequest("POST", "/api/medical-query", { question });
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      const newMessage: Message = {
        role: "assistant",
        content: data.answer
      };
      setMessages(prev => [...prev, newMessage]);
      
      // If voice mode is enabled, read the response
      if (settings.voiceInterface && isVoiceMode) {
        speak(data.answer);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/medical-query'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    }
  });

  const sendMessage = (messageText: string = input) => {
    if (!messageText.trim()) return;
    
    // Cancel any ongoing speech
    if (speaking) {
      cancel();
    }
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: messageText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Send to API
    sendMessageMutation.mutate({ question: messageText });
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
      } else {
        stopListening();
      }
      return newState;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Medical Chatbot</h2>
        <p className="text-sm text-gray-600">Ask any general medical questions you may have.</p>
      </div>
      
      <div className="p-4 h-96 overflow-y-auto flex flex-col space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <VoiceToggle 
            isActive={isVoiceMode} 
            onClick={handleVoiceToggle} 
            disabled={!hasRecognitionSupport}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 ml-2 mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="Type your medical question here..."
            disabled={sendMessageMutation.isPending}
          />
          <button
            onClick={() => sendMessage()}
            disabled={sendMessageMutation.isPending || !input.trim()}
            className="p-2 rounded-md bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {sendMessageMutation.isPending ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
        
        {isVoiceMode && (
          <div className="mt-2 p-2 bg-primary-50 rounded-md text-center text-primary-700 text-sm">
            <div className="flex items-center justify-center">
              <SpeechWave isActive={isListening} />
              {isListening ? "Listening... Speak your question" : "Voice input ready. Click the microphone to speak."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
