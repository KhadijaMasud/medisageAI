'use client'

import { createContext, ReactNode, useContext, useState, useEffect } from "react"
import { apiRequest } from "@/lib/queryClient"

type User = {
  id: number
  username: string
  role: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Check if user is already logged in on component mount
    async function fetchCurrentUser() {
      try {
        const res = await fetch('/api/user', {
          credentials: 'include'
        })
        
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (err) {
        console.error('Error fetching current user:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password })
      const userData = await response.json()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiRequest('POST', '/api/auth/register', { 
        username, 
        email, 
        password 
      })
      const userData = await response.json()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Registration failed'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await apiRequest('POST', '/api/auth/logout')
      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'))
      throw err
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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}