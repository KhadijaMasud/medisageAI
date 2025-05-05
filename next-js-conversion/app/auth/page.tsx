import { Metadata } from 'next'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Authentication - MediSage AI',
  description: 'Log in or sign up for MediSage AI',
}

export default function AuthPage() {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-400" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.168 1.168a4 4 0 01-8.214 0l1.168-1.168A3 3 0 009 8.172z"
              clipRule="evenodd"
            />
          </svg>
          MediSage AI
        </div>
        <div className="relative z-20 mt-auto">
          <h1 className="text-4xl font-semibold tracking-tight">
            Your Intelligent
            <br />
            Medical Assistant
          </h1>
          <p className="mt-4 mb-8 max-w-lg text-gray-100">
            Join MediSage AI to access personalized medical guidance, 
            symptom analysis, medication information, and track your health records
            securely in one place.
          </p>
          <div className="flex flex-col space-y-4 text-sm">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-3">✓</div>
              <span>AI-powered medical knowledge</span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-3">✓</div>
              <span>Visual medicine identification</span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-3">✓</div>
              <span>Voice-enabled accessibility</span>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full border flex items-center justify-center mr-3">✓</div>
              <span>Secure health data storage</span>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to MediSage AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Log in or create an account to get started
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}