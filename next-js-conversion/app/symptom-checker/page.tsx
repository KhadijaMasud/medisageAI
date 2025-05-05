import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Symptom Checker - MediSage AI',
  description: 'Analyze your symptoms and get insights about potential conditions',
}

export default function SymptomCheckerPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Symptom Checker</h1>
      <p className="mb-4">This page will contain the symptom checker functionality.</p>
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">Symptom checker interface will be implemented here</p>
      </div>
    </div>
  )
}