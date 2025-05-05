interface VoiceToggleProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function VoiceToggle({ isActive, onClick, disabled = false }: VoiceToggleProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full ${
        isActive
          ? "text-primary-700 bg-primary-100"
          : "text-gray-500 hover:text-primary hover:bg-primary-50"
      } focus:outline-none focus:ring-2 focus:ring-primary ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Toggle voice input"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
}
