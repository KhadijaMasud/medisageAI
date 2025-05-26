import React, { useState } from 'react';
import TutorialModal from './TutorialModal';

export default function HelpButton() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const handleOpenTutorial = () => {
    setIsTutorialOpen(true);
  };

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenTutorial}
        className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Help and Tutorial"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      
      <TutorialModal 
        onClose={handleCloseTutorial} 
        forceOpen={isTutorialOpen} 
      />
    </>
  );
}