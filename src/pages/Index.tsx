import { Navigation } from "@/components/layout/Navigation";
import { BuyProjectsPage } from "@/components/buy/BuyProjectsPage";
import { SellProjectsPage } from "@/components/sell/SellProjectsPage";
import { CustomWorkPage } from "@/components/custom/CustomWorkPage";
import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("buy");

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
      default:
        return <BuyProjectsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderActiveTab()}
    </div>
  );
};

export default Index;
