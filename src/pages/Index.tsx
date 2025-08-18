import { Navigation } from "@/components/layout/Navigation";
import { BuyProjectsPage } from "@/components/buy/BuyProjectsPage";
import { SellProjectsPage } from "@/components/sell/SellProjectsPage";
import { CustomWorkPage } from "@/components/custom/CustomWorkPage";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { AuthPage } from "@/components/auth/AuthPage";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

const Index = () => {
  const [activeTab, setActiveTab] = useState("buy");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setActiveTab("buy");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "buy":
        return <BuyProjectsPage />;
      case "sell":
        return <SellProjectsPage />;
      case "custom":
        return <CustomWorkPage />;
      case "dashboard":
        return <DashboardPage />;
      case "auth":
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      default:
        return <BuyProjectsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      {renderActiveTab()}
    </div>
  );
};

export default Index;
