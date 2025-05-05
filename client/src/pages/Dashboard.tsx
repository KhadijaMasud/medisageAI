import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MedicalChat from "@/pages/MedicalChat";
import SymptomChecker from "@/pages/SymptomChecker";
import MedicineScanner from "@/pages/MedicineScanner";
import VoiceAssistant from "@/pages/VoiceAssistant";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("medical-chat");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "medical-chat" && <MedicalChat />}
        {activeTab === "symptom-checker" && <SymptomChecker />}
        {activeTab === "medicine-scanner" && <MedicineScanner />}
        {activeTab === "voice-interface" && <VoiceAssistant />}
      </main>
      
      <Footer />
    </div>
  );
}
