'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { assets } from '@/lib/api';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

interface NFTAsset {
    id: number;
    name: string;
    rarity: string;
    value: string;
    type: string;
    image?: string;
}

export default function AdvancedGallery() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
    const [collections, setCollections] = useState<NFTAsset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Acquire modal state
    const [selectedNFT, setSelectedNFT] = useState<NFTAsset | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'connecting' | 'confirming' | 'success' | 'error'>('idle');

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();

    // Fetch assets from backend
    useEffect(() => {
        async function fetchAssets() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await assets.getGallery({
                    type: activeFilter !== 'All' ? activeFilter : undefined,
                    rarity: selectedRarities.length > 0 ? selectedRarities.join(',') : undefined,
                    search: search || undefined,
                });
                setCollections(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load assets');
            } finally {
                setIsLoading(false);
            }
        }
        fetchAssets();
    }, [activeFilter, selectedRarities, search]);

    const toggleRarity = (rarity: string) => {
        setSelectedRarities(prev =>
            prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
        );
    };

    // Format display name (remove underscores, capitalize)
    const formatName = (name: string) => name.replace(/_/g, ' ');

    // Handle acquire button click
    const handleAcquire = (nft: NFTAsset) => {
        setSelectedNFT(nft);
        setPurchaseStatus('idle');
    };

    // Close modal
    const closeModal = () => {
        setSelectedNFT(null);
        setPurchaseStatus('idle');
        setIsPurchasing(false);
    };

    // Handle purchase confirmation
    const handleConfirmPurchase = async () => {
        if (!selectedNFT) return;

        setIsPurchasing(true);

        try {
            // Step 1: Connect wallet if not connected
            if (!isConnected) {
                setPurchaseStatus('connecting');
                connect({ connector: injected() });
                // Wait a bit for connection
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Step 2: Simulate transaction confirmation
            setPurchaseStatus('confirming');

            // In production, this would call the smart contract
            // For now, simulate a transaction delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 3: Success
            setPurchaseStatus('success');

        } catch (err: any) {
            console.error('Purchase failed:', err);
            setPurchaseStatus('error');
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white pt-24 lg:pt-32 pb-20">
            <Navbar currentView="terminal" onViewChange={() => { }} />

            <div className="max-w-[1800px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row gap-0">

                {/* 1. LEFT SIDEBAR: BENTO MODULES */}
                <AnimatePresence mode="wait">
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full lg:w-72 space-y-6 lg:pr-8 border-r border-white/5 lg:sticky lg:top-32 self-start h-fit mb-12 lg:mb-0 z-20 bg-black"
                        >
                            {/* SEARCH MODULE */}
                            <section className="p-4 bg-zinc-950 border border-white/5 space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Search</h3>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="ID or Name"
                                    className="w-full bg-black border border-white/10 p-3 text-[10px] font-mono outline-none focus:border-blue-500 transition-colors uppercase"
                                />
                            </section>

                            {/* RARITY MODULE: FUNCTIONAL CHECK BOXES */}
                            <section className="p-4 bg-zinc-950 border border-white/5 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Filter by Rarity</h3>
                                <div className="space-y-2">
                                    {['Legendary', 'Epic', 'Rare', 'Common'].map(r => (
                                        <div
                                            key={r}
                                            onClick={() => toggleRarity(r)}
                                            className="flex items-center justify-between group cursor-pointer"
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedRarities.includes(r) ? 'text-blue-500' : 'text-zinc-600 group-hover:text-white'}`}>{r}</span>
                                            <div className={`w-3.5 h-3.5 border transition-all flex items-center justify-center ${selectedRarities.includes(r) ? 'bg-blue-600 border-blue-600' : 'border-white/10 group-hover:border-blue-500'}`}>
                                                {selectedRarities.includes(r) && <span className="text-[8px] text-white font-black uppercase">✓</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* PROTOCOL TELEMETRY MODULE */}
                            <section className="p-4 bg-zinc-950 border border-blue-500/10 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Network Status</h3>
                                <div className="space-y-2 text-[10px] font-mono">
                                    <div className="flex justify-between"><span className="text-zinc-600">Gas Price:</span><span className="text-emerald-500">14 Gwei</span></div>
                                    <div className="flex justify-between"><span className="text-zinc-600">Transactions:</span><span className="text-blue-500">42.8 /s</span></div>
                                    <div className="pt-2 border-t border-white/5 flex justify-between"><span className="text-zinc-500">Average Floor:</span><span className="text-white">0.35 ETH</span></div>
                                </div>
                            </section>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* 2. MAIN GALLERY CONTENT */}
                <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:pl-10' : 'pl-0'}`}>
                    <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-white/5 pb-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="p-2 border border-white/10 hover:bg-white/5 transition-colors group"
                                >
                                    <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Gallery</h1>
                            </div>
                            <p className="text-[10px] text-zinc-600 font-mono tracking-[0.4em] uppercase">{collections.length} Assets</p>
                        </div>

                        <div className="flex items-center gap-2 bg-zinc-950 border border-white/10 p-1">
                            {['All', 'Industrial', 'Cyber', 'Organic'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-zinc-600 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="bg-zinc-950 border border-white/10 animate-pulse">
                                    <div className="aspect-square bg-zinc-900" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                        <div className="h-3 bg-zinc-800 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
                                <span className="text-red-500 text-2xl">!</span>
                            </div>
                            <p className="text-zinc-400 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && collections.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                                <span className="text-zinc-600 text-2xl">∅</span>
                            </div>
                            <p className="text-zinc-500 text-sm mb-2">No assets found</p>
                            <p className="text-zinc-600 text-[10px]">Try adjusting your filters</p>
                        </div>
                    )}

                    {/* 3. ASSET GRID */}
                    {!isLoading && !error && collections.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {collections.map((nft) => (
                                <motion.div
                                    key={nft.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="group bg-zinc-950 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col h-full"
                                >
                                    <div className="aspect-square bg-zinc-900 relative overflow-hidden shrink-0 border-b border-white/5">
                                        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-black/80 border border-white/10 text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">
                                            {formatName(nft.type || 'Unknown')}
                                        </div>
                                        {nft.image ? (
                                            <img
                                                src={nft.image}
                                                alt={nft.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-800 text-5xl font-black group-hover:scale-105 transition-transform duration-700">
                                                #{nft.id}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleAcquire(nft)}
                                            className="absolute bottom-0 left-0 right-0 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-blue-500 hover:text-white"
                                        >
                                            Acquire
                                        </button>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-black uppercase text-white truncate mb-1">{formatName(nft.name)}</p>
                                                <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{formatName(nft.rarity || 'Common')}</p>
                                            </div>
                                            <p className="text-[11px] font-mono font-bold text-emerald-500 shrink-0 ml-2">{nft.value}</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[8px] text-zinc-700 font-mono uppercase">ID: {nft.id}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ACQUIRE MODAL */}
            <AnimatePresence>
                {selectedNFT && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 py-8 sm:py-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 border border-white/10 max-w-lg w-full overflow-hidden my-auto"
                        >
                            {/* Modal Header */}
                            <div className="relative">
                                <div className="aspect-[16/10] sm:aspect-video bg-zinc-900 relative overflow-hidden">
                                    {selectedNFT.image ? (
                                        <img
                                            src={selectedNFT.image}
                                            alt={selectedNFT.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-800 text-6xl font-black">
                                            #{selectedNFT.id}
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 border border-white/10 text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                                        {formatName(selectedNFT.type || 'Unknown')}
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 w-8 h-8 bg-black/80 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                >
                                    <span className="text-lg">×</span>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight truncate">{formatName(selectedNFT.name)}</h2>
                                        <p className="text-[9px] sm:text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">{formatName(selectedNFT.rarity || 'Common')} • ID: {selectedNFT.id}</p>
                                    </div>
                                    <p className="text-lg sm:text-xl font-mono font-bold text-emerald-500 shrink-0">{selectedNFT.value}</p>
                                </div>

                                {/* Status Messages */}
                                {purchaseStatus === 'connecting' && (
                                    <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] sm:text-[11px] font-mono flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                                        Connecting wallet...
                                    </div>
                                )}

                                {purchaseStatus === 'confirming' && (
                                    <div className="p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] sm:text-[11px] font-mono flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin shrink-0" />
                                        Confirm transaction in your wallet...
                                    </div>
                                )}

                                {purchaseStatus === 'success' && (
                                    <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-mono flex items-center gap-3">
                                        <span className="text-lg">✓</span>
                                        Transaction successful! NFT acquired.
                                    </div>
                                )}

                                {purchaseStatus === 'error' && (
                                    <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] sm:text-[11px] font-mono flex items-center gap-3">
                                        <span className="text-lg">!</span>
                                        Transaction failed. Please try again.
                                    </div>
                                )}

                                {/* Transaction Details */}
                                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-zinc-900/50 border border-white/5">
                                    <div className="flex justify-between text-[9px] sm:text-[10px]">
                                        <span className="text-zinc-500 uppercase tracking-widest">Price</span>
                                        <span className="text-white font-mono">{selectedNFT.value}</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] sm:text-[10px]">
                                        <span className="text-zinc-500 uppercase tracking-widest">Gas (est.)</span>
                                        <span className="text-white font-mono">~0.002 ETH</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] sm:text-[10px] pt-2 border-t border-white/5">
                                        <span className="text-zinc-400 uppercase tracking-widest font-bold">Total</span>
                                        <span className="text-emerald-500 font-mono font-bold">{selectedNFT.value}</span>
                                    </div>
                                </div>

                                {/* Wallet Status */}
                                <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-white/5">
                                    <span className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">Wallet</span>
                                    {isConnected ? (
                                        <span className="text-[9px] sm:text-[10px] text-emerald-500 font-mono flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            {address?.slice(0, 6)}...{address?.slice(-4)}
                                        </span>
                                    ) : (
                                        <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono">Not connected</span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 sm:gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 py-3 sm:py-4 border border-white/10 text-zinc-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmPurchase}
                                        disabled={isPurchasing || purchaseStatus === 'success'}
                                        className={`flex-1 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${purchaseStatus === 'success'
                                            ? 'bg-emerald-600 text-white cursor-default'
                                            : isPurchasing
                                                ? 'bg-zinc-800 text-zinc-500 cursor-wait'
                                                : 'bg-blue-600 text-white hover:bg-blue-500'
                                            }`}
                                    >
                                        {purchaseStatus === 'success' ? 'Acquired!' : isPurchasing ? 'Processing...' : isConnected ? 'Confirm Purchase' : 'Connect & Buy'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}