"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: number
  username: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  // Check if user is already authenticated on initial load
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      setIsLoading(true)
      const res = await fetch("/api/user")
      
      if (res.ok) {
        const userData = await res.json()
        setUser(userData)
      } else {
        // Not authenticated, but not an error
        setUser(null)
      }
    } catch (err) {
      console.error("Auth check error:", err)
      setError(err instanceof Error ? err : new Error("Failed to check authentication"))
    } finally {
      setIsLoading(false)
    }
  }

  async function login(username: string, password: string) {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Login failed")
      }

      const userData = await res.json()
      setUser(userData)
      setError(null)
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"))
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Login failed",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const userData = await res.json()
      setUser(userData)
      setError(null)
      
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Registration failed"))
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : "Registration failed",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Logout failed")
      }

      setUser(null)
      setError(null)
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Logout failed"))
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}