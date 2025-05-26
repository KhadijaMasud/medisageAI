import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { login, register: registerUser } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLoginSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      // Use the login function from the AuthProvider
      await login(data.username, data.password);

      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });

      // Redirect to dashboard
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegisterSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      // Use the register function from the AuthProvider
      await registerUser(data.username, data.email, data.password);

      toast({
        title: "Success",
        description: "Account created successfully and you are now logged in!",
      });

      // Redirect to dashboard after successful registration and login
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Info Panel */}
        <div className="hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-lg md:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h2 className="mb-6 text-3xl font-bold">MediSage AI</h2>
              <p className="mb-4 text-lg">Your personal medical assistant powered by advanced AI</p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-white/20 p-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Medical Chat</h3>
                    <p className="text-sm opacity-90">Get answers to your medical questions instantly</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-white/20 p-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Symptom Checker</h3>
                    <p className="text-sm opacity-90">Analyze your symptoms and get potential conditions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-white/20 p-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Medicine Scanner</h3>
                    <p className="text-sm opacity-90">Identify medicines and get detailed information</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-4 rounded-full bg-white/20 p-2">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Voice Assistant</h3>
                    <p className="text-sm opacity-90">Hands-free interaction for accessibility</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 rounded-lg bg-white/10 p-4">
              <p className="text-sm italic">
                "MediSage AI provides helpful medical information but does not replace professional medical advice. Always consult with a healthcare provider for medical concerns."
              </p>
            </div>
          </div>
        </div>
        
        {/* Auth Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                {activeTab === "login" ? "Sign in to your account" : "Create an account"}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === "login" 
                  ? "Enter your credentials to access your account" 
                  : "Fill in your details to create a new account"}
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input 
                        id="login-username" 
                        type="text" 
                        placeholder="Enter your username" 
                        {...loginForm.register("username")} 
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="Enter your password" 
                        {...loginForm.register("password")} 
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    
                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <button 
                        type="button"
                        className="text-blue-600 hover:underline" 
                        onClick={() => setActiveTab("register")}
                      >
                        Register
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input 
                        id="register-username" 
                        type="text" 
                        placeholder="Choose a username" 
                        {...registerForm.register("username")} 
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="Enter your email" 
                        {...registerForm.register("email")} 
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="Create a password" 
                        {...registerForm.register("password")} 
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input 
                        id="register-confirm-password" 
                        type="password" 
                        placeholder="Confirm your password" 
                        {...registerForm.register("confirmPassword")} 
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                    
                    <p className="text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <button 
                        type="button"
                        className="text-blue-600 hover:underline" 
                        onClick={() => setActiveTab("login")}
                      >
                        Sign in
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}