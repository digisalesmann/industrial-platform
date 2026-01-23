'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const directory = [
    {
      title: "Explore",
      links: [
        { name: "Home", href: "/" },
        { name: "Gallery", href: "/gallery" },
        { name: "Create", href: "/create" },
        { name: "Swap", href: "/swap" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Docs", href: "#" },
        { name: "GitHub", href: "#" },
        { name: "Status", href: "#" },
        { name: "API", href: "#" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "X", href: "#" },
        { name: "Discord", href: "#" },
        { name: "Telegram", href: "#" }
      ]
    }
  ];

  return (
    <footer className="w-full py-16 px-6 md:px-12 border-t border-white/5 bg-black">
      <div className="max-w-[1600px] mx-auto space-y-16">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-20">
          {/* BRAND MODULE */}
          <div className="col-span-2 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">Indstr</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-bold">Live</p>
              </div>
            </div>
            <p className="text-zinc-500 text-[10px] leading-relaxed max-w-xs font-mono uppercase tracking-widest">
              A platform to explore, create, and trade digital items easily and securely.
            </p>
          </div>

          {/* DIRECTORY MODULES */}
          {directory.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[10px] text-zinc-600 hover:text-white transition-colors font-bold uppercase tracking-widest"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <p className="text-zinc-700 text-[9px] font-mono tracking-widest uppercase">
              Version: <span className="text-zinc-500">1.0</span>
            </p>
            <p className="text-zinc-800 text-[8px] font-mono uppercase">
              © {currentYear} Indstr. All rights reserved.
            </p>
          </div>

          <div className="flex gap-6">
            <Link href="#" className="text-[9px] text-zinc-700 hover:text-zinc-500 font-black uppercase tracking-widest transition-colors underline decoration-white/5 underline-offset-4">Privacy Policy</Link>
            <Link href="#" className="text-[9px] text-zinc-700 hover:text-zinc-500 font-black uppercase tracking-widest transition-colors underline decoration-white/5 underline-offset-4">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}