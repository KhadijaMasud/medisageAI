"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()

  // In a real implementation, you would check if the user is already logged in
  // using a hook similar to your existing useAuth hook, and redirect if needed

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to MediSage AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <LoginForm />
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                <p>
                  Don&apos;t have an account?{" "}
                  <Link href="#" onClick={() => document.querySelector('[value="register"]')?.dispatchEvent(new MouseEvent('click'))}>
                    <span className="underline text-primary hover:text-primary/80">Sign up</span>
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <RegisterForm />
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                <p>
                  Already have an account?{" "}
                  <Link href="#" onClick={() => document.querySelector('[value="login"]')?.dispatchEvent(new MouseEvent('click'))}>
                    <span className="underline text-primary hover:text-primary/80">Sign in</span>
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}