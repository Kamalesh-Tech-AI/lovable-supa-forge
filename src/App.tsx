import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import Index from "./pages/Index";
import { AuthPage } from "./components/auth/AuthPage";
import { Navigation } from "./components/layout/Navigation";
import { BuyProjectsPage } from "./components/buy/BuyProjectsPage";
import { SellProjectsPage } from "./components/sell/SellProjectsPage";
import { CustomWorkPage } from "./components/custom/CustomWorkPage";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { SettingsPage } from "./components/settings/SettingsPage";
import { NotificationsPage } from "./components/notifications/NotificationsPage";
import { UserTypeModal } from "./components/auth/UserTypeModal";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserTypeModal, setShowUserTypeModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check if this is a new user who needs to select user type
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(() => {
            checkUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          checkUserProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setUserProfile(profile);
      
      // Show user type modal only if user_type is not set (new users)
      if (!profile?.user_type || profile.user_type === 'buyer') {
        // Check if this was recently created (within last 5 minutes) to ensure it's a new signup
        const profileCreated = new Date(profile.created_at);
        const now = new Date();
        const timeDiff = now.getTime() - profileCreated.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        if (minutesDiff <= 5) {
          setShowUserTypeModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    }
  };

  const handleUserTypeModalClose = () => {
    setShowUserTypeModal(false);
    // Refresh profile after user type selection
    if (user) {
      checkUserProfile(user.id);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      // Force page reload for clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {user ? (
            <div className="min-h-screen bg-background">
              <Navigation user={user} onSignOut={handleSignOut} />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/buy" element={<BuyProjectsPage />} />
                <Route path="/sell" element={<SellProjectsPage />} />
                <Route path="/custom" element={<CustomWorkPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/auth" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              {/* User Type Selection Modal */}
              {user && showUserTypeModal && (
                <UserTypeModal
                  isOpen={showUserTypeModal}
                  onClose={handleUserTypeModalClose}
                  userId={user.id}
                />
              )}
            </div>
          ) : (
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;