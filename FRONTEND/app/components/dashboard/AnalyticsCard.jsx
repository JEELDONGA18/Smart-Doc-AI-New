"use client";

export default function AnalyticsCard({ icon, label, value, trend }) {
  return (
    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-sm text-zinc-500 mt-1">{label}</p>
    </div>
  );
}
