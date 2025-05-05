import { useState, useEffect } from 'react';

// Define the tour steps with their positions and content
export const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to MediSage AI',
    content: 'This quick tour will help you navigate the application. Click "Next" to continue or "Skip" to exit the tour.',
    placement: 'center',
    target: 'body'
  },
  {
    id: 'medical-chat',
    title: 'Medical Chat',
    content: 'Ask any medical questions here. Our AI will provide you with helpful information based on reliable medical resources.',
    placement: 'bottom',
    target: '[data-tour-id="medical-chat"]'
  },
  {
    id: 'symptom-checker',
    title: 'Symptom Checker',
    content: 'Describe your symptoms and get an analysis of possible conditions. Remember, this is not a diagnosis but a guide to help you understand your symptoms.',
    placement: 'bottom',
    target: '[data-tour-id="symptom-checker"]'
  },
  {
    id: 'medicine-scanner',
    title: 'Medicine Scanner',
    content: 'Upload an image of a medicine and get information about its uses, dosage, and warnings.',
    placement: 'bottom',
    target: '[data-tour-id="medicine-scanner"]'
  },
  {
    id: 'voice-interface',
    title: 'Voice Assistant',
    content: 'Interact with the application using voice commands. Perfect for hands-free operation and accessibility.',
    placement: 'bottom',
    target: '[data-tour-id="voice-interface"]'
  },
  {
    id: 'accessibility',
    title: 'Accessibility Features',
    content: 'Customize text size, contrast, and voice settings to make the application more accessible to your needs.',
    placement: 'left',
    target: '[data-tour-id="accessibility"]'
  },
  {
    id: 'finish',
    title: 'You\'re All Set!',
    content: 'You\'ve completed the tour. You can always access this guide again from the help menu. Enjoy using MediSage AI!',
    placement: 'center',
    target: 'body'
  }
];

export function useTourGuide() {
  // Check if it's the first visit
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    // Check localStorage to see if user has seen the tour before
    const tourSeen = localStorage.getItem('medisage-tour-seen');
    setHasSeenTour(!!tourSeen);
    
    // If this is their first visit, start the tour automatically after a short delay
    if (!tourSeen) {
      const timer = setTimeout(() => {
        setIsTourActive(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setCurrentStep(0);
    setIsTourActive(true);
  };

  const endTour = () => {
    setIsTourActive(false);
    // Mark tour as seen in localStorage
    localStorage.setItem('medisage-tour-seen', 'true');
    setHasSeenTour(true);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    isTourActive,
    currentStep,
    hasSeenTour,
    currentTourStep: tourSteps[currentStep],
    startTour,
    endTour,
    nextStep,
    prevStep,
    totalSteps: tourSteps.length
  };
}