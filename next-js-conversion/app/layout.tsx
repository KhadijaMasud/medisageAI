import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../lib/globals.css'
import { AuthProvider } from '@/hooks/auth'
import { UserSettingsProvider } from '@/hooks/userSettings'
import { QueryClientProvider } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TourGuide from '@/components/TourGuide'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MediSage AI',
  description: 'Your comprehensive medical assistant powered by AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <UserSettingsProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <TourGuide />
              <Toaster />
            </AuthProvider>
          </UserSettingsProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}