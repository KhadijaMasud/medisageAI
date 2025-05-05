import React, { useEffect, useState } from 'react';
import { useTourGuide } from '@/hooks/useTourGuide';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TourGuide() {
  const { 
    isTourActive, 
    currentTourStep, 
    currentStep,
    nextStep, 
    prevStep, 
    endTour,
    totalSteps
  } = useTourGuide();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [overlayStyles, setOverlayStyles] = useState({});
  const [spotlightStyles, setSpotlightStyles] = useState({});

  // Find target element and calculate position for tooltip
  useEffect(() => {
    if (!isTourActive || !currentTourStep) return;

    // For centered steps
    if (currentTourStep.placement === 'center') {
      setPosition({
        top: window.innerHeight / 2 - 150,
        left: window.innerWidth / 2 - 175
      });
      setOverlayStyles({
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      });
      setSpotlightStyles({
        display: 'none'
      });
      return;
    }

    // For targeted elements
    const targetElement = document.querySelector(currentTourStep.target);
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    
    // Calculate tooltip position based on placement
    let newTop = 0;
    let newLeft = 0;
    
    switch (currentTourStep.placement) {
      case 'top':
        newTop = rect.top - 120; // Above the element
        newLeft = rect.left + rect.width / 2 - 175; // Centered horizontally
        break;
      case 'bottom':
        newTop = rect.bottom + 10; // Below the element
        newLeft = rect.left + rect.width / 2 - 175; // Centered horizontally
        break;
      case 'left':
        newTop = rect.top + rect.height / 2 - 60; // Centered vertically
        newLeft = rect.left - 360; // To the left
        break;
      case 'right':
        newTop = rect.top + rect.height / 2 - 60; // Centered vertically
        newLeft = rect.right + 10; // To the right
        break;
      default:
        newTop = rect.bottom + 10;
        newLeft = rect.left;
    }

    // Make sure tooltip stays within viewport
    if (newLeft < 20) newLeft = 20;
    if (newLeft > window.innerWidth - 370) newLeft = window.innerWidth - 370;
    if (newTop < 20) newTop = 20;
    if (newTop > window.innerHeight - 200) newTop = window.innerHeight - 200;

    setPosition({ top: newTop, left: newLeft });

    // Create spotlight effect - slightly larger than the target element
    const padding = 5;
    setOverlayStyles({
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    });
    setSpotlightStyles({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
      borderRadius: '4px'
    });
  }, [isTourActive, currentTourStep]);

  if (!isTourActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Full screen overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300" 
        style={overlayStyles}
      >
        {/* Spotlight cutout */}
        <div 
          className="absolute bg-transparent box-content" 
          style={{
            ...spotlightStyles,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
          }}
        />
      </div>

      {/* Tooltip */}
      <div 
        className="absolute bg-white rounded-lg shadow-lg p-5 w-[350px] pointer-events-auto z-50 transition-all duration-300"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg text-primary">{currentTourStep.title}</h3>
          <button onClick={endTour} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        
        <div className="mb-4 text-gray-600">
          {currentTourStep.content}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {`${currentStep + 1} of ${totalSteps}`}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep}
              >
                Back
              </Button>
            )}
            {currentStep < totalSteps - 1 ? (
              <Button 
                size="sm" 
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={endTour}
              >
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}