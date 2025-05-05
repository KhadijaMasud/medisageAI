import { useEffect, useState } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";

interface AccessibilityPanelProps {
  onClose: () => void;
}

export default function AccessibilityPanel({ onClose }: AccessibilityPanelProps) {
  const { settings, updateSettings } = useUserSettings();
  
  const [localSettings, setLocalSettings] = useState({
    highContrast: settings.highContrast,
    voiceInterface: settings.voiceInterface,
    textSize: settings.textSize,
    voiceSpeed: settings.voiceSpeed
  });

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Accessibility Options</h3>
          <div className="mt-4 text-left">
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-primary"
                  checked={localSettings.highContrast}
                  onChange={(e) => setLocalSettings({...localSettings, highContrast: e.target.checked})}
                />
                <span className="ml-2 text-gray-700">Enable High Contrast Mode</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-primary"
                  checked={localSettings.voiceInterface}
                  onChange={(e) => setLocalSettings({...localSettings, voiceInterface: e.target.checked})}
                />
                <span className="ml-2 text-gray-700">Enable Voice Interface</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Text Size</label>
              <select 
                className="w-full border border-gray-300 rounded-md py-2 px-3"
                value={localSettings.textSize}
                onChange={(e) => setLocalSettings({...localSettings, textSize: e.target.value})}
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Voice Speed</label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={localSettings.voiceSpeed}
                onChange={(e) => setLocalSettings({...localSettings, voiceSpeed: parseFloat(e.target.value)})}
                className="w-full" 
              />
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={handleSave}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
