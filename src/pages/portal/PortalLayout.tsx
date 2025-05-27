import BottomNav from "@/components/portal/BottomNav";
import TopNav from "@/components/portal/TopNav";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

const PortalLayout = () => {
  const [selected, setSelected] = useState("/portal/form");
  const handleSelect = (path: string) => setSelected(path);
  return (
    <div>
      <TopNav
        isSelected={selected}
        handleSelect={handleSelect}
        isSearchShow={false}
      />
      <div className="h-[84dvh]">
        <Outlet />
        <Toaster />
      </div>
      <BottomNav />
    </div>
  );
};

export default PortalLayout;
