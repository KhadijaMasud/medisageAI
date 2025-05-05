import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/auth"
import { UserSettingsProvider } from "@/hooks/userSettings"
import { QueryClientProvider } from "@/lib/queryClient"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/Header" 
import Footer from "@/components/Footer"
import TourGuide from "@/components/TourGuide"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MediSage AI - Your Medical Assistant",
  description: "Get medical information, analyze symptoms, and manage your health with AI assistance",
  keywords: "medical, health, AI, symptom checker, medicine scanner, voice assistant",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <UserSettingsProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <TourGuide />
              </div>
              <Toaster />
            </AuthProvider>
          </UserSettingsProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}