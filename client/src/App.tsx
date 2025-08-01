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
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import './index.css';
import '@/lib/i18n';
import useLanguageNotification from '@/hooks/useLanguageNotification';

function App() {
  useLanguageNotification();
  
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
              <Route path="/sign-in" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ResetPassword} />
              <Route path="/dashboard">
                <ProtectedRoute requireProfile={true}>
                  <Dashboard />
                </ProtectedRoute>
              </Route>
              <Route path="/profile">
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Route>
              <Route path="/cycle-tracking">
                <ProtectedRoute requireProfile={true}>
                  <CycleTracking />
                </ProtectedRoute>
              </Route>
              <Route path="/tracker">
                <ProtectedRoute>
                  <Tracker />
                </ProtectedRoute>
              </Route>
              <Route path="/education">
                <ProtectedRoute>
                  <Education />
                </ProtectedRoute>
              </Route>
              <Route path="/doctors">
                <ProtectedRoute>
                  <DoctorDirectory />
                </ProtectedRoute>
              </Route>
              <Route path="/community">
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              </Route>
              <Route path="/library">
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              </Route>
              <Route path="/health-trackers">
                <ProtectedRoute requireProfile={true}>
                  <HealthTrackers />
                </ProtectedRoute>
              </Route>
              <Route path="/health-games">
                <ProtectedRoute>
                  <HealthGames />
                </ProtectedRoute>
              </Route>
              <Route path="/games">
                <ProtectedRoute>
                  <HealthGames />
                </ProtectedRoute>
              </Route>
              <Route path="/contact">
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              </Route>
              
              {/* E-commerce routes */}
              <Route path="/shop">
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              </Route>
              
              {/* Government routes */}
              <Route path="/yojanas">
                <ProtectedRoute>
                  <Yojanas />
                </ProtectedRoute>
              </Route>
              
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