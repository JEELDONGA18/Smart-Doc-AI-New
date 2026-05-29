"use client";

import { useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content area — shifted right on desktop */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Each page renders its own TopNav with title, passing toggleSidebar as needed.
            We pass it via a wrapper so pages can access it. */}
        <SidebarToggleContext.Provider value={toggleSidebar}>
          {children}
        </SidebarToggleContext.Provider>
      </div>
    </div>
  );
}

// Context so child pages can trigger the sidebar
import { createContext, useContext } from "react";

const SidebarToggleContext = createContext(() => {});

export function useSidebarToggle() {
  return useContext(SidebarToggleContext);
}
