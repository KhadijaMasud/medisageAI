import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MessageSquare, ActivitySquare, PillIcon, Mic } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard - MediSage AI',
  description: 'Your medical dashboard showing health metrics and activity',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Your Health Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="records">Health Records</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Medical Chats</CardTitle>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Recent medical queries</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Symptom Checks</CardTitle>
                <ActivitySquare className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Recent symptom analyses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Medicine Scans</CardTitle>
                <PillIcon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Medications identified</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Voice Interactions</CardTitle>
                <Mic className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Voice assistant usage</p>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="mt-10 mb-4 text-2xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto py-4 text-left" variant="outline">
              <Link href="/medical-chat" className="flex flex-col items-start">
                <span className="text-lg font-semibold">Ask a Medical Question</span>
                <span className="text-sm text-muted-foreground">Get answers from our AI</span>
              </Link>
            </Button>
            
            <Button asChild className="h-auto py-4 text-left" variant="outline">
              <Link href="/symptom-checker" className="flex flex-col items-start">
                <span className="text-lg font-semibold">Check Your Symptoms</span>
                <span className="text-sm text-muted-foreground">Analyze potential conditions</span>
              </Link>
            </Button>
            
            <Button asChild className="h-auto py-4 text-left" variant="outline">
              <Link href="/medicine-scanner" className="flex flex-col items-start">
                <span className="text-lg font-semibold">Scan Medicine</span>
                <span className="text-sm text-muted-foreground">Identify medications</span>
              </Link>
            </Button>
            
            <Button asChild className="h-auto py-4 text-left" variant="outline">
              <Link href="/voice-assistant" className="flex flex-col items-start">
                <span className="text-lg font-semibold">Voice Assistant</span>
                <span className="text-sm text-muted-foreground">Speak with MediSage AI</span>
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Your recent medical interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">No medical history available yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start using MediSage AI features to build your medical history
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>Your personal health documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">No health records available</p>
                <Button className="mt-4">Add Health Record</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
              <CardDescription>Track your health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <p className="text-muted-foreground">No vital sign records available</p>
                <Button className="mt-4">Add Vital Signs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}