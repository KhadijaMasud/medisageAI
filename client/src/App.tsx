import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import { UserSettingsProvider } from "@/hooks/useUserSettings";
import { AuthProvider } from "@/hooks/use-auth";
import TutorialModal from "@/components/TutorialModal";
import AuthPage from "@/pages/auth-page";
import MedicalChat from "@/pages/MedicalChat";
import SymptomChecker from "@/pages/SymptomChecker";
import MedicineScanner from "@/pages/MedicineScanner";
import VoiceAssistant from "@/pages/VoiceAssistant";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/medical-chat" component={MedicalChat} />
          <Route path="/symptom-checker" component={SymptomChecker} />
          <Route path="/medicine-scanner" component={MedicineScanner} />
          <Route path="/voice-assistant" component={VoiceAssistant} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserSettingsProvider>
          <Router />
          <TutorialModal /> {/* Auto-shows for first-time users */}
          <Toaster />
        </UserSettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
