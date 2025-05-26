import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoPanelProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function InfoPanel({ title, icon, children, className = "" }: InfoPanelProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-white">{icon}</div>}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <CardContent className="p-6 text-gray-700">
        {children}
      </CardContent>
    </Card>
  );
}
