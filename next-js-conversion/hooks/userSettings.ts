'use client'

import { createContext, ReactNode, useContext, useState, useEffect } from "react"

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
  textSize: 'medium',
  voiceSpeed: 1
}

const UserSettingsContext = createContext<UserSettingsContextType | null>(null)

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (err) {
        console.error('Error parsing user settings:', err)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings }
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings))
      
      return updatedSettings
    })
  }

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  if (!context) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider")
  }
  return context
}