"use client"

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Menu, X, Settings } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // In a real implementation, this would come from an auth context
  const user = null
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.168 1.168a4 4 0 01-8.214 0l1.168-1.168A3 3 0 009 8.172z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-800">MediSage AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className={`text-sm font-medium ${pathname === '/dashboard' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
            Dashboard
          </Link>
          <Link href="/medical-chat" className={`text-sm font-medium ${pathname === '/medical-chat' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
            Medical Chat
          </Link>
          <Link href="/symptom-checker" className={`text-sm font-medium ${pathname === '/symptom-checker' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
            Symptom Checker
          </Link>
          <Link href="/medicine-scanner" className={`text-sm font-medium ${pathname === '/medicine-scanner' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
            Medicine Scanner
          </Link>
          <Link href="/voice-assistant" className={`text-sm font-medium ${pathname === '/voice-assistant' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'}`}>
            Voice Assistant
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/auth?tab=login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?tab=register">Sign Up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-gray-200">
          <nav className="flex flex-col space-y-3">
            <Link href="/dashboard" className={`px-3 py-2 rounded-md text-base font-medium ${pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>
              Dashboard
            </Link>
            <Link href="/medical-chat" className={`px-3 py-2 rounded-md text-base font-medium ${pathname === '/medical-chat' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>
              Medical Chat
            </Link>
            <Link href="/symptom-checker" className={`px-3 py-2 rounded-md text-base font-medium ${pathname === '/symptom-checker' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>
              Symptom Checker
            </Link>
            <Link href="/medicine-scanner" className={`px-3 py-2 rounded-md text-base font-medium ${pathname === '/medicine-scanner' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>
              Medicine Scanner
            </Link>
            <Link href="/voice-assistant" className={`px-3 py-2 rounded-md text-base font-medium ${pathname === '/voice-assistant' ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`} onClick={toggleMobileMenu}>
              Voice Assistant
            </Link>
            {!user && (
              <>
                <Link href="/auth?tab=login" className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>
                  Log In
                </Link>
                <Link href="/auth?tab=register" className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
            {user && (
              <>
                <Link href="/profile" className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={toggleMobileMenu}>
                  Profile
                </Link>
                <button className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 text-left">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}