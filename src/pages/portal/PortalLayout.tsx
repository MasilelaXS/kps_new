import BottomNav from "@/components/portal/BottomNav";
import TopNav from "@/components/portal/TopNav";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

const PortalLayout = () => {
  const [selected, setSelected] = useState("/portal/form");
  const handleSelect = (path: string) => setSelected(path);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <TopNav
        isSelected={selected}
        handleSelect={handleSelect}
        isSearchShow={false}
      />
      
      <main className="flex-1 overflow-y-auto native-scroll bg-gray-50 dark:bg-gray-950">
        <div className="min-h-full">
          <Outlet />
        </div>
        <Toaster />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PortalLayout;
