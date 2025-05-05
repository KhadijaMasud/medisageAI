"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/auth"
import { useUserSettings } from "@/hooks/userSettings"
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  Moon,
  Sun,
  AlignJustify,
  Ear
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, logout } = useAuth()
  const { settings, updateSettings } = useUserSettings()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast })
  }

  const toggleVoiceInterface = () => {
    updateSettings({ voiceInterface: !settings.voiceInterface })
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Medical Chat", path: "/medical-chat" },
    { name: "Symptom Checker", path: "/symptom-checker" },
    { name: "Medicine Scanner", path: "/medicine-scanner" },
    { name: "Voice Assistant", path: "/voice-assistant" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            href="/"
            className="flex items-center gap-2 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400"
          >
            MediSage AI
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden md:flex">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Accessibility Features */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hidden md:flex">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Accessibility Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleHighContrast}>
                <AlignJustify className="mr-2 h-4 w-4" />
                <span>{settings.highContrast ? "Disable" : "Enable"} High Contrast</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleVoiceInterface}>
                <Ear className="mr-2 h-4 w-4" />
                <span>{settings.voiceInterface ? "Disable" : "Enable"} Voice Interface</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu for Authenticated Users */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="hidden md:flex">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:inline-flex">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="w-full justify-start">
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>{settings.highContrast ? "Light" : "Dark"} Mode</span>
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleHighContrast} className="w-full justify-start">
                <AlignJustify className="mr-2 h-4 w-4" />
                <span>{settings.highContrast ? "Disable" : "Enable"} High Contrast</span>
              </Button>
              
              <Button variant="ghost" size="sm" onClick={toggleVoiceInterface} className="w-full justify-start">
                <Ear className="mr-2 h-4 w-4" />
                <span>{settings.voiceInterface ? "Disable" : "Enable"} Voice Interface</span>
              </Button>
            </div>
            
            {user ? (
              <div className="pt-2 border-t">
                <div className="text-sm font-medium mb-2">Signed in as {user.username}</div>
                <Link 
                  href="/profile"
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/auth">Sign In</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}