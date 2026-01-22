'use client';

import { useState, useEffect } from 'react';
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
import { assets } from '@/lib/api';
import type { NFT } from '@/components/TransactionSidebar';
import CollectionBrowser from '@/components/CollectionBrowser';

export default function Home() {


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



  // Live NFT marketplace data with collection filtering
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState(true);
  const [nftsError, setNftsError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNfts() {
      setNftsLoading(true);
      setNftsError(null);
      try {
        let data;
        if (selectedCollection) {
          data = await assets.getGallery({ limit: 100, collection_id: selectedCollection });
        } else {
          data = await assets.getAll();
        }
        setNfts(data);
      } catch (e: any) {
        setNftsError(e.message || 'Failed to load marketplace items.');
      } finally {
        setNftsLoading(false);
      }
    }
    fetchNfts();
  }, [selectedCollection]);

  // View state for Navbar
  const [currentView, setCurrentView] = useState<'marketplace' | 'terminal'>('marketplace');
  const handleViewChange = (view: 'marketplace' | 'terminal') => setCurrentView(view);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden relative">
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

      <ProtocolHealth />

      {/* 4. Collection Browser & Marketplace Discovery Section */}
      <section className="relative min-h-screen overflow-hidden bg-[#050505]">
        {/* Layer 1: The Industrial Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Layer 2: The Core Atmospheric Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Layer 3: Noise/Grain Texture (Optional for that \"Industrial\" feel) */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

        {/* Content goes here */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 py-24">
          <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
            <div>
              <h2 className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-3 text-glow">Marketplace Live</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase break-words">Marketplace</h3>
            </div>
            <div className="flex flex-col items-start md:items-end font-mono">
              <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Total Items: <span className="text-white">4,096</span></p>
              <p className="text-zinc-500 text-[10px] tracking-widest uppercase text-right">Status: <span className="text-emerald-500 animate-pulse">● Online</span></p>
            </div>
          </header>

          {/* Collection Filter Button Group */}
          <CollectionBrowser onSelect={setSelectedCollection} selectedCollection={selectedCollection} />

          {/* NFT Marketplace Grid - Gallery Style */}
          {nftsError && <div className="text-red-500 text-center py-8">{nftsError}</div>}
          {nftsLoading && <div className="text-zinc-400 text-center py-8">Loading marketplace items...</div>}
          {!nftsLoading && !nftsError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {nfts.map((nft) => (
                <motion.div
                  key={nft.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="group bg-zinc-950 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col h-full"
                >
                  <div className="aspect-square bg-zinc-900 relative overflow-hidden shrink-0 border-b border-white/5 flex items-center justify-center">
                    {nft.image ? (
                      <img src={nft.image} alt={nft.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-800 text-5xl font-black group-hover:scale-105 transition-transform duration-700">
                        #{nft.id?.toString().split('-').pop() || nft.id}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-black/80 border border-white/10 text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">
                      {nft.type || nft.collection_id || 'NFT'}
                    </div>
                    <button
                      className="absolute bottom-0 left-0 right-0 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      onClick={() => {
                        setSelectedNFT(nft);
                        setIsTxSidebarOpen(true);
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black uppercase text-white truncate mb-1">{nft.name}</p>
                        {nft.rarity && <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{nft.rarity}</p>}
                        {nft.description && <p className="text-[9px] text-zinc-500 mt-1 line-clamp-2">{nft.description}</p>}
                      </div>
                      <p className="text-[11px] font-mono font-bold text-emerald-500 shrink-0 ml-2">{nft.price || '--'}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[8px] text-zinc-700 font-mono uppercase">{nft.owner ? `Owner: ${nft.owner.slice(0, 6)}...` : 'Verified'}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ExecutionLedger />
      <Footer />
    </main>
  );
}