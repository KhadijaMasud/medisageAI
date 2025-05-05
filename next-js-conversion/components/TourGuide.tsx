"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface TourStep {
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to MediSage AI",
    description: "Let's take a quick tour to help you get started. You can skip this tour anytime.",
    target: "body",
    position: "bottom",
  },
  {
    title: "Medical Chat",
    description: "Ask health-related questions and get AI-powered responses based on reliable medical information.",
    target: "nav a[href='/medical-chat']",
    position: "bottom",
  },
  {
    title: "Symptom Checker",
    description: "Enter your symptoms to receive insights about possible conditions and recommendations.",
    target: "nav a[href='/symptom-checker']",
    position: "bottom",
  },
  {
    title: "Medicine Scanner",
    description: "Upload images of medications to identify them and get information about their uses and side effects.",
    target: "nav a[href='/medicine-scanner']",
    position: "bottom",
  },
  {
    title: "Voice Assistant",
    description: "Interact with MediSage using voice commands for a hands-free experience.",
    target: "nav a[href='/voice-assistant']",
    position: "bottom",
  },
  {
    title: "Accessibility Options",
    description: "Customize the interface with high contrast mode and other accessibility features.",
    target: "button:has(.settings)",
    position: "bottom",
  },
]

export default function TourGuide() {
  const [showTour, setShowTour] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const hasTakenTour = localStorage.getItem("tourCompleted") === "true"
    
    if (!hasTakenTour) {
      // Slight delay to ensure the UI is fully rendered
      const timer = setTimeout(() => {
        setShowTour(true)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (showTour) {
      positionTourCard()
      
      // Add event listener for window resize
      window.addEventListener("resize", positionTourCard)
      
      return () => {
        window.removeEventListener("resize", positionTourCard)
      }
    }
  }, [showTour, currentStep])

  const positionTourCard = () => {
    if (!showTour) return
    
    const targetSelector = tourSteps[currentStep]?.target
    if (!targetSelector) return
    
    const targetElement = 
      targetSelector === "body" 
        ? document.body 
        : document.querySelector(targetSelector)
    
    if (!targetElement) return
    
    const rect = targetElement.getBoundingClientRect()
    const step = tourSteps[currentStep]
    
    let top = 0
    let left = 0
    
    // Position the card based on the specified position
    switch (step.position) {
      case "top":
        top = rect.top - 10 - 250 // Card height + some margin
        left = rect.left + rect.width / 2 - 150 // Half of card width
        break
      case "bottom":
        top = rect.bottom + 10
        left = rect.left + rect.width / 2 - 150
        break
      case "left":
        top = rect.top + rect.height / 2 - 125
        left = rect.left - 10 - 300
        break
      case "right":
        top = rect.top + rect.height / 2 - 125
        left = rect.right + 10
        break
    }
    
    // Ensure the card stays within viewport
    top = Math.max(10, Math.min(top, window.innerHeight - 250 - 10))
    left = Math.max(10, Math.min(left, window.innerWidth - 300 - 10))
    
    setPosition({ top, left })
  }

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    setShowTour(false)
    localStorage.setItem("tourCompleted", "true")
  }

  if (!showTour) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-start pointer-events-none">
      <Card
        className="w-[300px] shadow-lg pointer-events-auto absolute"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: "all 0.3s ease",
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{tourSteps[currentStep].title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={completeTour} aria-label="Close tour">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Step {currentStep + 1} of {tourSteps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{tourSteps[currentStep].description}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={completeTour}
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={nextStep}
            >
              {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}