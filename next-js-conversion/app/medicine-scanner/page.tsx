import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medicine Scanner - MediSage AI',
  description: 'Upload medicine images to get detailed information',
}

export default function MedicineScannerPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Medicine Scanner</h1>
      <p className="mb-4">This page will contain the medicine scanner functionality.</p>
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">Medicine scanner interface will be implemented here</p>
      </div>
    </div>
  )
}