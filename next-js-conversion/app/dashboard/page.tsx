"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  Stethoscope, 
  Pill, 
  Mic, 
  UserRound
} from "lucide-react"

export default function DashboardPage() {
  // In a real implementation, you would check if the user is authenticated
  // and redirect to /auth if not authenticated
  
  const features = [
    {
      title: "Medical Chat",
      description: "Get answers to your medical questions from our AI assistant.",
      icon: <MessageSquare className="h-8 w-8 mb-2 text-primary" />,
      href: "/medical-chat",
      color: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Symptom Checker",
      description: "Analyze your symptoms and get insights about possible conditions.",
      icon: <Stethoscope className="h-8 w-8 mb-2 text-primary" />,
      href: "/symptom-checker",
      color: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Medicine Scanner",
      description: "Scan medicine packaging to get information about the medication.",
      icon: <Pill className="h-8 w-8 mb-2 text-primary" />,
      href: "/medicine-scanner",
      color: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Voice Assistant",
      description: "Interact with MediSage using voice commands and responses.",
      icon: <Mic className="h-8 w-8 mb-2 text-primary" />,
      href: "/voice-assistant",
      color: "bg-amber-50 dark:bg-amber-950",
    },
    {
      title: "User Profile",
      description: "Manage your profile and medical history.",
      icon: <UserRound className="h-8 w-8 mb-2 text-primary" />,
      href: "/profile",
      color: "bg-red-50 dark:bg-red-950",
    },
  ]

  return (
    <div className="container py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to MediSage AI</h1>
        <p className="text-muted-foreground">
          Your personal medical assistant powered by artificial intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="block">
            <Card className={`h-full transition-all hover:shadow-md ${feature.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {feature.icon}
                  <span className="ml-2">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80 text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Open {feature.title}
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}