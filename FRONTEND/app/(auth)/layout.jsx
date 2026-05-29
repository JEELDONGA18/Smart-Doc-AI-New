export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#09090b]">
      {/* Subtle background glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}
