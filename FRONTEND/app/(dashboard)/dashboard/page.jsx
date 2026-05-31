"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopNav from "@/app/components/dashboard/TopNav";
import AnalyticsCard from "@/app/components/dashboard/AnalyticsCard";
import { useSidebarToggle } from "@/app/(dashboard)/layout";
import { SkeletonCard } from "@/app/components/ui/LoadingSkeleton";
import { get } from "@/app/lib/api";

const activityIcons = {
  upload: {
    color: "bg-indigo-500/15 text-indigo-400",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  chat: {
    color: "bg-violet-500/15 text-violet-400",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
  },
  download: {
    color: "bg-emerald-500/15 text-emerald-400",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
};

export default function DashboardPage() {
  const toggleSidebar = useSidebarToggle();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChats: 0,
    totalQueries: 0,
    latestDocument: "No Documents",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [statsData, activityData] = await Promise.all([
        get("/api/stats"),
        get("/api/activity"),
      ]);

      setStats({
        totalDocuments: statsData.totalDocuments,
        totalChats: statsData.totalChats,
        totalQueries: statsData.totalQueries,
        latestDocument: statsData.latestDocument || "No Documents",
      });

      setActivities(activityData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      label: "Total Documents",
      value: stats.totalDocuments,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      label: "Total Chats",
      value: stats.totalChats,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L9 9l-7 1 5 5-1.5 7L12 18.5 18.5 22 17 15l5-5-7-1z" />
        </svg>
      ),
      label: "AI Queries",
      value: stats.totalQueries,
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      label: "Latest Document",
      value: stats.latestDocument,
    },
  ];

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <TopNav title="Dashboard" onMenuClick={toggleSidebar} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="px-6 py-8 max-w-6xl mx-auto w-full"
      >
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map((card) => (
                <AnalyticsCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                />
              ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>

          {loading ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-white/[0.04] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-2 w-1/4 rounded bg-white/[0.03] animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
              {activities.map((activity) => {
                const style = activityIcons[activity.type];
                return (
                  <div key={activity.id} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${style.color}`}>
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{activity.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">{formatDateTime(activity.time)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
