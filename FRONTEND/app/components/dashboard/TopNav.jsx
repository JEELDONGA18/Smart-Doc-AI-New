"use client";

import { useAuth } from "@/app/contexts/AuthContext";

export default function TopNav({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/[0.04] transition text-zinc-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white tracking-tight">{title}</h1>
      </div>

      {/* Right: user avatar */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
