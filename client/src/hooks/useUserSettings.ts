import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define interfaces
interface UserSettings {
  highContrast: boolean;
  voiceInterface: boolean;
  textSize: string;
  voiceSpeed: number;
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

// Default settings
const defaultSettings: UserSettings = {
  highContrast: false,
  voiceInterface: true,
  textSize: 'normal',
  voiceSpeed: 1.0,
};

// Create the context
const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

// Create the provider component
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('medisageSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          ...defaultSettings,
          ...parsedSettings,
        });
      } catch (error) {
        console.error('Failed to parse settings from localStorage', error);
      }
    }
  }, []);
  
  // Apply settings to document
  useEffect(() => {
    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply text size
    document.documentElement.style.fontSize = settings.textSize === 'normal' 
      ? '16px' 
      : settings.textSize === 'large' 
        ? '18px' 
        : '20px';
  }, [settings]);
  
  // Update settings function
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = {
      ...settings,
      ...newSettings,
    };
    
    setSettings(updatedSettings);
    
    // Save to localStorage
    localStorage.setItem('medisageSettings', JSON.stringify(updatedSettings));
  };
  
  return React.createElement(
    UserSettingsContext.Provider, 
    { value: { settings, updateSettings } },
    children
  );
}

// Create the hook to use the context
export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}