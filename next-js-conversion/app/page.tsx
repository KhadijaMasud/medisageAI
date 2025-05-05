import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
          Welcome to <span className="gradient-text">MediSage AI</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Your comprehensive AI-powered medical assistant. Get answers to medical questions,
          check symptoms, manage your health records, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get instant answers to your medical questions from our AI-powered medical assistant.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/medical-chat">Try It</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Symptom Checker</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analyze your symptoms and get insights about potential conditions.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/symptom-checker">Check Symptoms</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medicine Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upload an image of your medicine to get detailed information about it.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/medicine-scanner">Scan Medicine</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Interact with MediSage using voice commands for a hands-free experience.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/voice-assistant">Start Speaking</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">1</div>
            <h3 className="mb-2 text-xl font-semibold">Sign Up</h3>
            <p className="text-gray-600">Create your account to access all features and keep track of your health data.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">2</div>
            <h3 className="mb-2 text-xl font-semibold">Use Tools</h3>
            <p className="text-gray-600">Utilize our AI-powered tools to get medical information, check symptoms, or scan medicines.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">3</div>
            <h3 className="mb-2 text-xl font-semibold">Track Health</h3>
            <p className="text-gray-600">Review your history and manage your health records in your personal dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  )
}