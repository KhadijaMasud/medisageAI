'use client'

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  )
}

// Helper function to handle API responses
export async function apiRequest(
  method: string, 
  url: string, 
  body?: any, 
  headers?: Record<string, string>
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  }

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = errorData.message || `API request failed with status: ${response.status}`
    throw new Error(errorMessage)
  }
  
  return response
}