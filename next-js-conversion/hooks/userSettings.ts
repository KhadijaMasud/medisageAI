"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface UserSettings {
  highContrast: boolean
  voiceInterface: boolean
  textSize: string
  voiceSpeed: number
}

interface UserSettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => void
}

const defaultSettings: UserSettings = {
  highContrast: false,
  voiceInterface: false,
  textSize: "normal",
  voiceSpeed: 1.0,
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("userSettings")
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings
    }
    return defaultSettings
  })

  useEffect(() => {
    // Apply high contrast mode
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }

    // Apply text size
    if (settings.textSize === "large") {
      document.documentElement.classList.add("large-text")
      document.documentElement.classList.remove("x-large-text")
    } else if (settings.textSize === "x-large") {
      document.documentElement.classList.add("x-large-text")
      document.documentElement.classList.remove("large-text")
    } else {
      document.documentElement.classList.remove("large-text", "x-large-text")
    }

    // Save settings to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider")
  }
  return context
}