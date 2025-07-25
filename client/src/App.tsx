import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Home from '@/pages/Home';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import CycleTracking from '@/pages/CycleTracking';
import Tracker from '@/pages/Tracker';
import Education from '@/pages/Education';
import DoctorDirectory from '@/pages/DoctorDirectory';
import CommunityPage from '@/pages/CommunityPage';
import Library from '@/pages/Library';
import HealthTrackers from '@/pages/HealthTrackers';
import HealthGames from '@/pages/HealthGames';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/not-found';

// E-commerce pages
import Shop from '@/pages/ecommerce/Shop';

// Government pages
import Yojanas from '@/pages/government/Yojanas';

// Components
import ChatBot from '@/components/chatbot/ChatBot';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import './index.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Switch>
              {/* Main routes */}
              <Route path="/" component={Home} />
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/cycle-tracking" component={CycleTracking} />
              <Route path="/tracker" component={Tracker} />
              <Route path="/education" component={Education} />
              <Route path="/doctors" component={DoctorDirectory} />
              <Route path="/community" component={CommunityPage} />
              <Route path="/library" component={Library} />
              <Route path="/health-trackers" component={HealthTrackers} />
              <Route path="/health-games" component={HealthGames} />
              <Route path="/contact" component={Contact} />
              
              {/* E-commerce routes */}
              <Route path="/shop" component={Shop} />
              
              {/* Government routes */}
              <Route path="/yojanas" component={Yojanas} />
              
              {/* 404 route */}
              <Route component={NotFound} />
            </Switch>
            
            <Footer />
            
            {/* Global ChatBot */}
            <ChatBot />
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;