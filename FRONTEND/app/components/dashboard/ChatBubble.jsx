import ReactMarkdown from "react-markdown";

export default function ChatBubble({ role, content, timestamp }) {
  const isUser = role === "user";

  function formatTime(ts) {
    const d = new Date(ts);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] lg:max-w-[60%] ${isUser ? "order-1" : ""}`}>
        {/* Avatar + name */}
        <div className={`flex items-center gap-2 mb-1.5 ${isUser ? "justify-end" : ""}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
            isUser
              ? "bg-indigo-500/20 text-indigo-300"
              : "bg-white/[0.06] text-zinc-400"
          }`}>
            {isUser ? "U" : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            )}
          </div>
          <span className="text-xs text-zinc-600">
            {isUser ? "You" : "Smart Doc AI"}
          </span>
        </div>

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-500/15 text-zinc-200 border border-indigo-500/20 rounded-tr-md"
            : "bg-white/[0.03] text-zinc-300 border border-white/[0.06] rounded-tl-md"
        }`}>
          <div className="whitespace-pre-wrap">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p suppressHydrationWarning className={`text-[11px] text-zinc-600 mt-1 ${isUser ? "text-right" : ""}`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
