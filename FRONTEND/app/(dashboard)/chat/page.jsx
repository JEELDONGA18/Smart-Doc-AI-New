"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ChatBubble from "@/app/components/dashboard/ChatBubble";
import { useSidebarToggle } from "@/app/(dashboard)/layout";

// Mock previous chats
const mockChats = [
  { id: "1", title: "Revenue Analysis", date: "2025-05-28" },
  { id: "2", title: "HR Policy Questions", date: "2025-05-27" },
  { id: "3", title: "Product Roadmap", date: "2025-05-26" },
  { id: "4", title: "Q3 Financial Report", date: "2025-05-25" },
  { id: "5", title: "Engineering Handbook", date: "2025-05-24" },
];

const sampleMessages = [
  {
    id: "m1",
    role: "user",
    content: "What were our Q3 revenue numbers?",
    createdAt: "2025-05-28T10:30:00Z",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "Based on the Q3 Financial Report, your total revenue was $4.2M, representing a 23% increase from Q2.\n\nBreakdown by segment:\n• Enterprise: $2.1M (+18%)\n• Mid-market: $1.4M (+31%)\n• SMB: $700K (+15%)\n\nSource: Q3-Financial-Report.pdf, page 12",
    createdAt: "2025-05-28T10:30:15Z",
  },
  {
    id: "m3",
    role: "user",
    content: "How does that compare to our targets?",
    createdAt: "2025-05-28T10:31:00Z",
  },
  {
    id: "m4",
    role: "assistant",
    content:
      "According to the annual targets document, the Q3 target was $3.8M. You exceeded the target by $400K (10.5% above target).\n\nAll three segments outperformed:\n• Enterprise: exceeded by $100K\n• Mid-market: exceeded by $200K\n• SMB: exceeded by $100K\n\nSource: Annual-Targets-2025.pdf, page 4",
    createdAt: "2025-05-28T10:31:20Z",
  },
];

// Simulated AI responses for demo
const aiResponses = [
  "Based on the uploaded documents, I found relevant information. Let me summarize the key findings for you.\n\nThe data shows consistent growth across all metrics, with particularly strong performance in Q3.\n\nSource: company-data.pdf, page 8",
  "I've analyzed the relevant sections of your knowledge base. Here's what I found:\n\nThe policy you're asking about was last updated in March 2025. It covers employee guidelines, remote work protocols, and compliance requirements.\n\nSource: HR-Handbook-v3.pdf, page 23",
  "Looking at the documents you've uploaded, I can provide the following insights:\n\nYour team's productivity metrics improved by 34% after implementing the new workflow. The most significant gains were in the engineering department.\n\nSource: Quarterly-Review.pdf, page 15",
];

export default function ChatPage() {
  const toggleSidebar = useSidebarToggle();
  const [activeChat, setActiveChat] = useState("1");
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: "msg-" + Date.now(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // TODO: Replace with real API call
    // const response = await post('/api/chat', { chatId: activeChat, message: input });

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg = {
        id: "msg-" + (Date.now() + 1),
        role: "assistant",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function startNewChat() {
    setMessages([]);
    setActiveChat(null);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ─── Left Panel: Chat List ─── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0c0c0e] border-r border-white/[0.06] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          chatPanelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-zinc-300">Conversations</h2>
          <button
            onClick={startNewChat}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition text-zinc-400 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setChatPanelOpen(false);
                if (chat.id === "1") setMessages(sampleMessages);
                else setMessages([]);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                activeChat === chat.id
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className="shrink-0 text-zinc-600"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-300 truncate">{chat.title}</p>
                <p className="text-xs text-zinc-600">{chat.date}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile overlay */}
      {chatPanelOpen && (
        <div
          onClick={() => setChatPanelOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* ─── Main Chat Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b border-white/[0.06] flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setChatPanelOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-white/[0.04] transition text-zinc-400 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/[0.04] transition text-zinc-400 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <h2 className="text-sm font-medium text-zinc-300">
            {activeChat
              ? mockChats.find((c) => c.id === activeChat)?.title || "Chat"
              : "New Chat"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {messages.length === 0 && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 text-zinc-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                Ask anything about your uploaded documents. The AI will only
                answer from your company data.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatBubble
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.createdAt}
                  />
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] rounded-tl-md">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-xs text-zinc-600 ml-1">Thinking...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ─── Input Area ─── */}
        <div className="border-t border-white/[0.06] p-4 shrink-0">
          <div className="flex items-end gap-3 max-w-3xl mx-auto">
            {/* Attachment button */}
            <button className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition text-zinc-500 hover:text-zinc-300 shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your documents..."
                rows={1}
                disabled={loading}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 pr-4 text-sm text-white placeholder-zinc-600 focus:border-indigo-500/50 focus:outline-none resize-none transition disabled:opacity-50"
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-indigo-500 text-white transition hover:bg-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
          <p className="text-[11px] text-zinc-700 text-center mt-2">
            AI answers are sourced exclusively from your uploaded documents.
          </p>
        </div>
      </div>
    </div>
  );
}
