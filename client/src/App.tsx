import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DoctorDirectory from "@/pages/DoctorDirectory";
import Education from "@/pages/Education";
import Library from "@/pages/Library";
import CommunityPage from "@/pages/CommunityPage";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Profile from "@/pages/Profile";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import Tracker from "@/pages/Tracker"; // Health cycle tracker page with tabs
import HealthGames from "@/pages/HealthGames"; // Interactive health education games
import ChatBot from "@/components/chatbot/ChatBot"; // Floating chatbot component
import { Router as WouterRouter } from "wouter";


function Router() {
  const [location] = useLocation();

  // Check if we're on an auth page
  const isAuthPage = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password'
  ].includes(location);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/doctors" component={DoctorDirectory} />
          <Route path="/education" component={Education} />
          <Route path="/library" component={Library} />
          <Route path="/community" component={CommunityPage} />
          <Route path="/contact" component={Contact} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/tracker" component={Tracker} />
          <Route path="/games" component={HealthGames} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <ChatBot />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}


export default App;