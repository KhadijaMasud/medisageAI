import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import { UserSettingsProvider } from "@/hooks/useUserSettings";
import { AuthProvider } from "@/hooks/use-auth";
import TourGuide from "@/components/TourGuide";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/ProfilePage";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserSettingsProvider>
        <AuthProvider>
          <Router />
          <TourGuide />
          <Toaster />
        </AuthProvider>
      </UserSettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
