"use client"

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query"
import { useState, ReactNode } from "react"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient)
  
  return (
    <TanstackQueryClientProvider client={client}>
      {children}
    </TanstackQueryClientProvider>
  )
}

// Helper function for API requests
export async function apiRequest(
  method: string,
  url: string,
  body?: unknown,
  customHeaders?: Record<string, string>
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...customHeaders,
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
  }

  if (body && method !== "GET") {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  // Handle unauthenticated errors
  if (response.status === 401) {
    // You might want to redirect to login page or handle this differently
    console.error("Unauthenticated request")
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || `Request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return response
}