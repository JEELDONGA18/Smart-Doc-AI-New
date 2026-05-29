export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5 text-zinc-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
      {action && action}
    </div>
  );
}
