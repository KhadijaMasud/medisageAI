import { useState } from "react";
import AccessibilityPanel from "./AccessibilityPanel";

export default function Header() {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityOpen(!isAccessibilityOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 w-full py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
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
            <h1 className="ml-2 text-xl font-semibold text-gray-800">MediSage AI</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAccessibilityPanel}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Accessibility Options"
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </button>
            <div className="hidden sm:block">
              <button className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Log In
              </button>
              <button className="ml-2 bg-primary rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {isAccessibilityOpen && (
        <AccessibilityPanel onClose={() => setIsAccessibilityOpen(false)} />
      )}
    </>
  );
}
