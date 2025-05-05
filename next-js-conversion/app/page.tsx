"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Stethoscope, Pill, Mic, UserRound } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  Your Personal Medical Assistant
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  MediSage AI helps you understand medical information, check symptoms, and manage your health with the power of artificial intelligence.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 opacity-75 blur"></div>
                <div className="relative overflow-hidden rounded-lg border bg-background shadow-xl">
                  <div className="grid grid-cols-2 gap-2 p-4">
                    <FeatureCard
                      icon={<MessageCircle className="h-10 w-10 text-blue-500" />}
                      title="Medical Chat"
                      description="Get answers to your health questions"
                    />
                    <FeatureCard
                      icon={<Stethoscope className="h-10 w-10 text-teal-500" />}
                      title="Symptom Checker"
                      description="Analyze your symptoms"
                    />
                    <FeatureCard
                      icon={<Pill className="h-10 w-10 text-purple-500" />}
                      title="Medicine Scanner"
                      description="Identify medications"
                    />
                    <FeatureCard
                      icon={<Mic className="h-10 w-10 text-amber-500" />}
                      title="Voice Assistant"
                      description="Hands-free interaction"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                MediSage AI combines cutting-edge AI with medical knowledge to provide you with accurate and helpful information.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
              <MessageCircle className="h-12 w-12 text-blue-500" />
              <h3 className="text-xl font-bold">Medical Chat</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Ask medical questions and receive instant responses based on reliable medical information.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
              <Stethoscope className="h-12 w-12 text-teal-500" />
              <h3 className="text-xl font-bold">Symptom Checker</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Enter your symptoms to get insights about possible conditions and recommendations.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
              <Mic className="h-12 w-12 text-amber-500" />
              <h3 className="text-xl font-bold">Voice Interaction</h3>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Speak naturally with our voice assistant for a hands-free experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg border shadow-sm">
      {icon}
      <h3 className="mt-2 font-semibold">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}