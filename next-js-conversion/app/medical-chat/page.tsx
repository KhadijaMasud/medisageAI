import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medical Chat - MediSage AI',
  description: 'Get answers to your medical questions from AI',
}

export default function MedicalChatPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Medical Chat</h1>
      <p className="mb-4">This page will contain the medical chat functionality.</p>
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">Medical chat interface will be implemented here</p>
      </div>
    </div>
  )
}