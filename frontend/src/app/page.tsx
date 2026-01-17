'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MarketTicker from '@/components/MarketTicker';
import Dashboard from '@/components/Dashboard';
import TransactionSidebar from '@/components/TransactionSidebar';
import WalletSidebar from '@/components/WalletSidebar'; //
import ProtocolHealth from '@/components/ProtocolHealth';
import NFTCard from '@/components/NFTCard';
import Footer from '@/components/Footer';
import ExecutionLedger from '@/components/ExecutionLedger';
import Notification from '@/components/Notification'; //

export default function Home() {
  type NFT = { id: string; name: string; price: string; rarity: string; type: string };

  // Sidebar States
  const [isTxSidebarOpen, setIsTxSidebarOpen] = useState(false);
  const [isWalletSidebarOpen, setIsWalletSidebarOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  // Notification state
  const [notification, setNotification] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const triggerNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // NFT data and structure from gallery
  const nfts = [
    { id: '7A-01', name: 'VOID_UNIT_01', rarity: 'Legendary', price: '2.5 ETH', type: 'Industrial' },
    { id: '7A-88', name: 'NEON_SOUL', rarity: 'Rare', price: '0.8 ETH', type: 'Cyber' },
    { id: '7A-12', name: 'SILICON_V2', rarity: 'Common', price: '0.4 ETH', type: 'Organic' },
    { id: '7A-99', name: 'CORE_ENGINE', rarity: 'Epic', price: '1.2 ETH', type: 'Military' },
    ...Array.from({ length: 24 }, (_, i) => ({
      id: `BX-${(i + 5).toString().padStart(2, '0')}`,
      name: `PROTO_CELL_${(i + 5)}`,
      rarity: ['Common', 'Rare', 'Epic'][Math.floor(Math.random() * 3)],
      price: `${(Math.random() * 5 + 0.1).toFixed(2)} ETH`,
      type: ['Industrial', 'Cyber', 'Organic'][Math.floor(Math.random() * 3)]
    })),
  ];

  // View state for Navbar
  const [currentView, setCurrentView] = useState<'marketplace' | 'terminal'>('marketplace');
  const handleViewChange = (view: 'marketplace' | 'terminal') => setCurrentView(view);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#18181b] via-[#101014] to-black text-white selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Subtle noise overlay */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.035\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: 'auto', opacity: 1 }} />
      {/* 1. Global Navigation & Notification Layer */}
      <Navbar
        onProfileClick={() => setIsWalletSidebarOpen(true)}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      {notification && (
        <Notification message={notification.msg} type={notification.type} />
      )}

      {/* 2. Sidebars (Left & Right) */}
      <WalletSidebar
        isOpen={isWalletSidebarOpen}
        onClose={() => setIsWalletSidebarOpen(false)}
      />

      <TransactionSidebar
        isOpen={isTxSidebarOpen}
        onClose={() => setIsTxSidebarOpen(false)}
        nft={selectedNFT}
        onFinalize={() => {
          setIsTxSidebarOpen(false);
          triggerNotification(`Successfully executed trade for ${selectedNFT?.name}`, 'success');
          setSelectedNFT(null);
        }}
      />

      {/* 3. Hero & Protocol Analytics */}
      <Hero />
      <MarketTicker />
      <Dashboard />

      <div className="max-w-[1400px] mx-auto px-8">
        <ProtocolHealth />
      </div>

      {/* 4. Marketplace Discovery Section */}
      <div className="max-w-[1400px] mx-auto px-8 py-24">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-3 text-glow">Live_Market_V1.0</h2>
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase break-words">Marketplace</h3>
          </div>
          <div className="flex flex-col items-start md:items-end font-mono">
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Total Assets: <span className="text-white">4,096</span></p>
            <p className="text-zinc-500 text-[10px] tracking-widest uppercase text-right">Node Status: <span className="text-emerald-500 animate-pulse">● Operational</span></p>
          </div>
        </header>

        {/* NFT Marketplace Grid - Gallery Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {nfts.map((nft) => (
            <motion.div
              key={nft.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="group bg-zinc-950 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col h-full"
            >
              <div className="aspect-square bg-zinc-900 relative overflow-hidden shrink-0 border-b border-white/5">
                <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-black/80 border border-white/10 text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">
                  {nft.type}
                </div>
                <div className="w-full h-full flex items-center justify-center text-zinc-800 text-5xl font-black group-hover:scale-105 transition-transform duration-700">
                  #{nft.id.toString().split('-').pop()}
                </div>
                <button
                  className="absolute bottom-0 left-0 right-0 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  onClick={() => {
                    setSelectedNFT(nft);
                    setIsTxSidebarOpen(true);
                  }}
                >
                  Initialize_Acquisition
                </button>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-white truncate mb-1">{nft.name}</p>
                    <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{nft.rarity}</p>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-emerald-500 shrink-0 ml-2">{nft.price}</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[8px] text-zinc-700 font-mono uppercase">Sec_Verified: 7A_09</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ExecutionLedger />
      <Footer />
    </main>
  );
}