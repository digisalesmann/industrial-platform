'use client';

import { useState, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletSidebarContext } from './WalletSidebarContext';


interface NavbarProps {
  onProfileClick?: () => void;
  onViewChange: (view: 'marketplace' | 'terminal') => void;
  currentView: 'marketplace' | 'terminal';
}
function Navbar({ onProfileClick, onViewChange, currentView }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setIsOpen } = useContext(WalletSidebarContext);

  // Use context if onProfileClick not provided
  const handleProfileClick = onProfileClick || (() => setIsOpen(true));

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 md:py-5">
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">

        {/* 1. Logo Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="grid grid-cols-2 gap-0.5 transition-transform group-hover:rotate-90 duration-500">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-[1px]" />)}
          </div>
          <span className="text-lg md:text-xl font-black tracking-tighter uppercase text-white">Indstr.</span>
        </Link>

        {/* 2. Desktop Navigation Only */}
        <div className="hidden lg:flex gap-8">
          <Link href="/gallery" className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${pathname === '/gallery' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}>Gallery</Link>
          <Link href="/swap" className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${pathname === '/swap' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}>Swap</Link>
          <Link href="/create" className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${pathname === '/create' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}>Create</Link>
          <Link href="/launchpad" className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 ${pathname === '/launchpad' ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}>Launchpad</Link>
        </div>

        {/* 3. Session / Hamburger Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* SESSION BUTTON: Hidden on mobile (hidden) / Visible on md+ (md:flex) */}
          <div className="hidden md:flex">
            <ConnectButton.Custom>
              {({ account, chain, openConnectModal, mounted }) => {
                const connected = mounted && account && chain;
                return (
                  <button
                    onClick={connected ? handleProfileClick : openConnectModal}
                    className="group flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-white/10 rounded-lg hover:border-blue-500/50 transition-all"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-600'}`} />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">
                      {connected ? account.displayName : 'Connect'}
                    </span>
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* MOBILE TOGGLE: Always visible on mobile, hidden on large desktop if preferred */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col gap-1.5 p-2 focus:outline-none lg:hidden"
          >
            <motion.div animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="w-6 h-[1px] bg-white" />
            <motion.div animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="w-6 h-[1px] bg-white" />
            <motion.div animate={isMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="w-6 h-[1px] bg-white" />
          </button>
        </div>
      </div>

      {/* 4. Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute left-0 top-full w-full bg-black border-b border-white/10 px-6 py-8 flex flex-col gap-6 z-50 overflow-hidden"
          >
            <Link href="/gallery" className="text-left text-lg font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Gallery
            </Link>
            <Link href="/swap" className="text-left text-lg font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Swap
            </Link>
            <Link href="/create" className="text-left text-lg font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Create
            </Link>
            <Link href="/launchpad" className="text-left text-lg font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Launchpad
            </Link>

            {/* Mobile Session Button: Rendered only inside the mobile menu */}
            <div className="pt-6 border-t border-white/5">
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => (
                  <button
                    onClick={() => { openConnectModal(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-white"
                  >
                    {mounted && account ? account.displayName : 'Connect Wallet'}
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;