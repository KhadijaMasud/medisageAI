import { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  // Parse lists in assistant responses
  const renderContent = (content: string) => {
    if (!content.includes("\n") && !content.includes("•") && !content.includes("-")) {
      return <p className="text-sm">{content}</p>;
    }
    
    // Split by new lines and render lists
    const parts = content.split("\n");
    return (
      <>
        {parts.map((part, i) => {
          if (part.trim().startsWith("•") || part.trim().startsWith("-") || part.trim().startsWith("*")) {
            // This is likely a list item
            if (i > 0 && !parts[i-1].trim().startsWith("•") && 
                !parts[i-1].trim().startsWith("-") && 
                !parts[i-1].trim().startsWith("*")) {
              // First list item, start a list
              return (
                <ul key={i} className="list-disc pl-5 text-sm mt-2">
                  <li>{part.trim().substring(1).trim()}</li>
                </ul>
              );
            } else {
              // Continuation of list
              return <li key={i} className="text-sm">{part.trim().substring(1).trim()}</li>;
            }
          } else if (part.trim()) {
            // Regular paragraph
            return <p key={i} className="text-sm mt-2">{part}</p>;
          }
          return null;
        })}
      </>
    );
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'} ${isUser ? 'ml-auto' : ''}`}>
      {renderContent(message.content)}
    </div>
  );
}
