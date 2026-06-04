"use client";

import { useState, useEffect } from "react";
import TopNav from "@/app/components/dashboard/TopNav";
import { useSidebarToggle } from "@/app/(dashboard)/layout";
import EmptyState from "@/app/components/ui/EmptyState";
import { SkeletonTable } from "@/app/components/ui/LoadingSkeleton";
import { get } from "@/app/lib/api";
import { MessageSquare  } from "lucide-react";

const typeColors = {
  PDF: "text-red-400 bg-red-500/10",
  TXT: "text-zinc-400 bg-white/[0.06]",
};

export default function DownloadsPage() {
  const toggleSidebar = useSidebarToggle();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  async function loadDownloads() {
    try {
      const data = await get("/api/download");
      setDownloads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  async function downloadFile(chatId, type, fileName) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/download/${type}/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.${type}`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Failed to download file");
    }
  }

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
                {/* <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${typeColors[item.type] || typeColors.TXT}`}>
                  {item.type}
                </div> */}
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {/* Generated from: {item.source} · {item.size} */}
                    Available for PDF and TXT export
                  </p>
                </div>

                {/* Date + Download */}
                <span className="text-xs text-zinc-600 hidden sm:block shrink-0">{formatDate(item.date)}</span>
                {/* <button className="px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition shrink-0">
                  Download
                </button> */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      downloadFile(
                        item.id,
                        "pdf",
                        item.name
                      )
                    }
                    className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-300"
                  >
                    PDF
                  </button>

                  <button
                    onClick={() =>
                      downloadFile(
                        item.id,
                        "txt",
                        item.name
                      )
                    }
                    className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.06] text-zinc-300"
                  >
                    TXT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
