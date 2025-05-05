import { useState } from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "medical-chat", label: "Medical Chat" },
    { id: "symptom-checker", label: "Symptom Checker" },
    { id: "medicine-scanner", label: "Medicine Scanner" },
    { id: "voice-interface", label: "Voice Assistant" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              data-tour-id={tab.id}
              className={`px-4 py-2 rounded-md font-medium border-b-2 ${
                activeTab === tab.id
                  ? "text-primary border-primary"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
