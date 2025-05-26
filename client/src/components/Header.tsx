import { useState } from "react";
import { useLocation } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AccessibilityPanel from "./AccessibilityPanel";
import HelpButton from "./HelpButton";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityOpen(!isAccessibilityOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigateToAuth = () => {
    setLocation("/auth");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 w-full py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => {
              setLocation("/");
              // If we're already on the home page, we need to reset the tab
              const homeEvent = new CustomEvent('reset-to-home');
              window.dispatchEvent(homeEvent);
            }}
          >
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
            <HelpButton />
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
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-gray-200">
                      <AvatarFallback className="bg-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-2 text-sm">
                    <p className="font-semibold">Signed in as</p>
                    <p className="text-gray-500 truncate">{user?.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setLocation("/profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => setLocation("/settings")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={navigateToAuth}
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => {
                    navigateToAuth();
                    // Add a small delay to allow for navigation before attempting to change tabs
                    setTimeout(() => {
                      const registerTabTrigger = document.querySelector('[value="register"]');
                      if (registerTabTrigger instanceof HTMLElement) {
                        registerTabTrigger.click();
                      }
                    }, 100);
                  }}
                  className="bg-primary rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {isAccessibilityOpen && (
        <AccessibilityPanel onClose={() => setIsAccessibilityOpen(false)} />
      )}
    </>
  );
}
