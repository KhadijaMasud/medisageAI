import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile - MediSage AI',
  description: 'Manage your user profile and health information',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
      <p className="mb-4">This page will contain the user profile functionality.</p>
      <div className="rounded-md border p-4 text-center">
        <p className="text-muted-foreground">Profile management interface will be implemented here</p>
      </div>
    </div>
  )
}