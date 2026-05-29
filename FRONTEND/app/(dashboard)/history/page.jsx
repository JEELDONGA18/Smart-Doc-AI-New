"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TopNav from "@/app/components/dashboard/TopNav";
import { useSidebarToggle } from "@/app/(dashboard)/layout";
import EmptyState from "@/app/components/ui/EmptyState";
import { SkeletonTable } from "@/app/components/ui/LoadingSkeleton";

const mockHistory = [
  { id: "1", title: "Revenue Analysis", preview: "What were our Q3 revenue numbers and how did they compare...", date: "2025-05-28", messages: 12 },
  { id: "2", title: "HR Policy Questions", preview: "Can you explain the remote work policy for engineering teams?", date: "2025-05-27", messages: 8 },
  { id: "3", title: "Product Roadmap", preview: "What features are planned for the next quarter according to...", date: "2025-05-26", messages: 15 },
  { id: "4", title: "Q3 Financial Report", preview: "Summarize the key financial metrics from the Q3 report...", date: "2025-05-25", messages: 6 },
  { id: "5", title: "Engineering Handbook", preview: "What's the code review process described in the engineering...", date: "2025-05-24", messages: 10 },
  { id: "6", title: "Compliance Overview", preview: "What are our GDPR compliance requirements based on the...", date: "2025-05-23", messages: 4 },
  { id: "7", title: "Marketing Strategy", preview: "What does the marketing plan say about Q4 campaigns?", date: "2025-05-22", messages: 9 },
  { id: "8", title: "Onboarding Process", preview: "Walk me through the new employee onboarding steps...", date: "2025-05-21", messages: 7 },
];

export default function HistoryPage() {
  const toggleSidebar = useSidebarToggle();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    // get('/api/history').then(setChats).catch(console.error).finally(() => setLoading(false));
    setTimeout(() => {
      setChats(mockHistory);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id) {
    // TODO: await del(`/api/chat/${id}`);
    setChats((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <TopNav title="Chat History" onMenuClick={toggleSidebar} />

      <div className="px-6 py-8 max-w-5xl mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-indigo-500/50 focus:outline-none transition"
          />
        </div>

        {/* Loading */}
        {loading && <SkeletonTable rows={5} />}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
            title="No conversations found"
            description={search ? "Try a different search term." : "Start a new chat to see your history here."}
            action={
              <Link
                href="/chat"
                className="px-4 py-2 text-sm font-medium text-white rounded-full bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] transition"
              >
                Start Chat
              </Link>
            }
          />
        )}

        {/* Chat list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0 text-zinc-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{chat.title}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{chat.preview}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-600 hidden sm:block">{chat.messages} msgs</span>
                  <span className="text-xs text-zinc-600">{chat.date}</span>

                  <Link
                    href="/chat"
                    className="px-3 py-1.5 text-xs font-medium text-zinc-400 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] hover:text-white transition opacity-0 group-hover:opacity-100"
                  >
                    Continue
                  </Link>

                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
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
