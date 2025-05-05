import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useTourGuide } from '@/hooks/useTourGuide';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function HelpButton() {
  const { startTour } = useTourGuide();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary" 
          data-tour-id="help-button"
        >
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={startTour}>
          Start Tour Guide
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('https://example.com/faq', '_blank')}>
          FAQs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('https://example.com/support', '_blank')}>
          Contact Support
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('https://example.com/about', '_blank')}>
          About MediSage AI
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}