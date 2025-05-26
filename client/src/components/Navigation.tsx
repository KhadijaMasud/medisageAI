import { useRef, useEffect } from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "welcome", label: "Home" },
    { id: "medical-chat", label: "Medical Chat" },
    { id: "symptom-checker", label: "Symptom Checker" },
    { id: "medicine-scanner", label: "Medicine Scanner" },
    { id: "voice-interface", label: "Voice Assistant" },
  ];

  // Reference to the navigation container
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Scroll tabs container when it's too narrow
  useEffect(() => {
    const activeTabElement = document.getElementById(`tab-${activeTab}`);
    if (activeTabElement && navContainerRef.current) {
      const container = navContainerRef.current;
      const scrollPosition = activeTabElement.offsetLeft - (container.offsetWidth / 2) + (activeTabElement.offsetWidth / 2);
      container.scrollLeft = scrollPosition;
    }
  }, [activeTab]);

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={navContainerRef}
          className="flex space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar pb-1"
        >
          {tabs.map((tab) => (
            <button
              id={`tab-${tab.id}`}
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-md font-medium border-b-2 transition-all ${
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
