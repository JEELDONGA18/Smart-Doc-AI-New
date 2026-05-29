export default function Footer() {
  const links = [
    { label: "About", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm text-zinc-500 font-medium">
            Smart Doc AI
          </span>

          <nav className="flex gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-600 hover:text-zinc-300 transition"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span className="text-xs text-zinc-700">
            &copy; 2025 Smart Doc AI
          </span>
        </div>
      </div>
    </footer>
  );
}
