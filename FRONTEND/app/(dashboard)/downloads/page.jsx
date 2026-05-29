"use client";

import { useState, useEffect } from "react";
import TopNav from "@/app/components/dashboard/TopNav";
import { useSidebarToggle } from "@/app/(dashboard)/layout";
import EmptyState from "@/app/components/ui/EmptyState";
import { SkeletonTable } from "@/app/components/ui/LoadingSkeleton";

const mockDownloads = [
  { id: "1", name: "Revenue Analysis — Full Report", source: "Revenue Analysis chat", type: "PDF", size: "245 KB", date: "2025-05-28" },
  { id: "2", name: "HR Policy Summary", source: "HR Policy Questions chat", type: "PDF", size: "128 KB", date: "2025-05-27" },
  { id: "3", name: "Q3 Financial Breakdown", source: "Q3 Financial Report chat", type: "PDF", size: "512 KB", date: "2025-05-25" },
  { id: "4", name: "Product Roadmap Notes", source: "Product Roadmap chat", type: "TXT", size: "34 KB", date: "2025-05-24" },
  { id: "5", name: "Compliance Checklist", source: "Compliance Overview chat", type: "PDF", size: "98 KB", date: "2025-05-23" },
];

const typeColors = {
  PDF: "text-red-400 bg-red-500/10",
  TXT: "text-zinc-400 bg-white/[0.06]",
};

export default function DownloadsPage() {
  const toggleSidebar = useSidebarToggle();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: get('/api/downloads').then(setDownloads)...
    setTimeout(() => {
      setDownloads(mockDownloads);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <TopNav title="Downloads" onMenuClick={toggleSidebar} />

      <div className="px-6 py-8 max-w-5xl mx-auto">
        {loading && <SkeletonTable rows={4} />}

        {!loading && downloads.length === 0 && (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            }
            title="No downloads yet"
            description="Export a chat conversation to see it here."
          />
        )}

        {!loading && downloads.length > 0 && (
          <div className="space-y-3">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition group"
              >
                {/* File type badge */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${typeColors[item.type] || typeColors.TXT}`}>
                  {item.type}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Generated from: {item.source} · {item.size}
                  </p>
                </div>

                {/* Date + Download */}
                <span className="text-xs text-zinc-600 hidden sm:block shrink-0">{item.date}</span>
                <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition shrink-0">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
