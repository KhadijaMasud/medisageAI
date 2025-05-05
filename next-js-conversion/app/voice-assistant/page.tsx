import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voice Assistant - MediSage AI',
  description: 'Interact with MediSage using voice commands',
}

export default function VoiceAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Voice Assistant</h1>
      <p className="mb-4">This page will contain the voice assistant functionality.</p>
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">Voice assistant interface will be implemented here</p>
      </div>
    </div>
  )
}