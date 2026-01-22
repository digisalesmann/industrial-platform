'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { assets } from '@/lib/api';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';

// Wallet/account state must be inside the component to use hooks


export default function VisualDiscover() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [txMessage, setTxMessage] = useState<string | null>(null);

    const [activeCategory, setActiveCategory] = useState('All');
    const [now, setNow] = useState(new Date());
    const [auctionItems, setAuctionItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        assets.getGallery({ type: activeCategory })
            .then((data) => {
                setAuctionItems(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load auctions');
                setLoading(false);
            });
    }, [activeCategory]);

    const featuredDrop = {
        name: "Void Architects",
        ends: new Date(Date.now() + 4 * 60 * 60 * 1000),
        floor: "0.08 ETH",
        items: 5000,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        creator: "@voidlabs"
    };

    const trending = [
        { id: 1, name: "Cyber Core", floor: "1.2 ETH", vol: "420 ETH", change: "+12%", image: "https://images.unsplash.com/photo-1635324738556-3fe69767d80b?w=200&h=200&fit=crop", creator: "@cyberartist" },
        { id: 2, name: "Neon Genesis", floor: "0.5 ETH", vol: "150 ETH", change: "-2%", image: "https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?w=200&h=200&fit=crop", creator: "@neongen" },
        { id: 3, name: "Industrial Void", floor: "2.5 ETH", vol: "890 ETH", change: "+45%", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop", creator: "@industvoid" },
        { id: 4, name: "Silicon Soul", floor: "0.1 ETH", vol: "45 ETH", change: "+5%", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop", creator: "@siliconsoul" },
    ];

    // auctionItems now comes from API

    // ...existing code... (expanded auctionItems is already declared below)

    function getCountdown(target: Date): string {
        const diff = Math.max(0, target.getTime() - now.getTime());
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    // Mint Now logic (example: call backend or contract)
    async function handleMint() {
        if (!isConnected) {
            setTxStatus('error');
            setTxMessage('Connect your wallet to mint.');
            return;
        }
        setTxStatus('pending');
        setTxMessage('Minting NFT...');
        try {
            const message = `Mint NFT at ${new Date().toISOString()}`;
            const signature = await signMessageAsync({ message });
            // TODO: Call backend mint endpoint with address and signature
            // await fetch('/api/mint', { method: 'POST', body: JSON.stringify({ address, signature }) });
            setTxStatus('success');
            setTxMessage('Mint successful!');
            setTimeout(() => setTxStatus('idle'), 4000);
        } catch (err: any) {
            setTxStatus('error');
            setTxMessage(err.message || 'Mint failed.');
            setTimeout(() => setTxStatus('idle'), 4000);
        }
    }

    // Place Bid logic (example: call backend or contract)
    async function handleBid(item: any) {
        if (!isConnected) {
            setTxStatus('error');
            setTxMessage('Connect your wallet to place a bid.');
            return;
        }
        setTxStatus('pending');
        setTxMessage(`Placing bid for ${item.name}...`);
        try {
            const message = `Bid on ${item.name} at ${new Date().toISOString()}`;
            const signature = await signMessageAsync({ message });
            // TODO: Call backend bid endpoint with address, item, and signature
            // await fetch('/api/bid', { method: 'POST', body: JSON.stringify({ address, itemId: item.id, signature }) });
            setTxStatus('success');
            setTxMessage('Bid placed successfully!');
            setTimeout(() => setTxStatus('idle'), 4000);
        } catch (err: any) {
            setTxStatus('error');
            setTxMessage(err.message || 'Bid failed.');
            setTimeout(() => setTxStatus('idle'), 4000);
        }
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white pb-20 font-sans selection:bg-blue-500/30">
            <Navbar currentView="marketplace" onViewChange={() => { }} />

            {/* Introduction */}
            <section className="w-full bg-[#0a0a0a] border-b border-white/5 pt-32 pb-16">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
                            Launchpad<span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed mb-8">
                            Discover high-throughput NFT collections and join live liquidity auctions.
                            Engineered for institutional-grade digital assets.
                        </p>
                        <Link href="/create" className="inline-flex items-center px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                            Start Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Hero */}
            <section className="relative h-auto min-h-[70vh] w-full border-b border-white/5 flex flex-col justify-center">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />

                <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-20 relative z-10 flex flex-col lg:flex-row justify-between items-end gap-12">
                    <div className="space-y-6 max-w-4xl">
                        <div className="flex items-center gap-4">
                            <span className="bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest">Priority Asset</span>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">Origin: {featuredDrop.creator}</span>
                        </div>
                        <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
                            <span className="block text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                                {featuredDrop.name}
                            </span>
                        </h2>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <button
                                className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all text-center"
                                onClick={handleMint}
                                disabled={txStatus === 'pending'}
                                aria-busy={txStatus === 'pending'}
                            >
                                {txStatus === 'pending' ? 'Minting...' : 'Mint Now'}
                            </button>
                            <Link href="/collection/void-architects" className="px-10 py-5 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all text-center">Details</Link>
                        </div>
                    </div>

                    {/* Countdown Panel */}
                    <div className="w-full lg:w-96 bg-zinc-900/40 border border-white/10 backdrop-blur-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-600" />
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Countdown</p>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-5xl font-black font-mono tracking-tighter mb-8 leading-none">{getCountdown(featuredDrop.ends)}</p>
                        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-6">
                            <div>
                                <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Floor</p>
                                <p className="text-xl font-bold font-mono">{featuredDrop.floor}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">Total Items</p>
                                <p className="text-xl font-bold font-mono">{featuredDrop.items.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Leaderboard */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24">
                <section className="space-y-10">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Trending Metrics</h2>
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">Live volume analysis</p>
                        </div>
                        <Link href="/market" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors border-b border-blue-500/30 pb-1">History</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {trending.map((c) => (
                            <Link key={c.id} href={`/collection/slug`} className="group relative bg-[#0a0a0a] border border-white/5 p-6 transition-all hover:bg-zinc-900 hover:border-blue-500/50">
                                <div className="flex justify-between items-start mb-4">
                                    <img src={c.image} alt={c.name} className="w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-none border border-white/10" />
                                    <span className={`text-[11px] font-mono font-bold ${c.change.includes('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {c.change}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase truncate tracking-tight text-white mb-1">{c.name}</h3>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tighter mb-4">By {c.creator}</p>
                                    <div className="flex justify-between text-[10px] font-bold text-zinc-400 border-t border-white/5 pt-3">
                                        <span className="uppercase tracking-widest opacity-50">Floor</span>
                                        <span className="font-mono text-white">{c.floor}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Live Auction Grid */}
                <section className="mt-32 pb-20 space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-center md:text-left">Live Auction Feed</h2>
                        <div className="flex p-1 bg-zinc-900 border border-white/5">
                            {['All', 'Art', 'Gaming', 'Industrial'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'text-zinc-600 hover:text-white'}`}
                                >
                                    {cat.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                        {loading && <div className="col-span-full text-center py-12 text-zinc-500">Loading auctions...</div>}
                        {error && <div className="col-span-full text-center py-12 text-red-500">{error}</div>}
                        {!loading && !error && auctionItems.length === 0 && (
                            <div className="col-span-full text-center py-12 text-zinc-500">No auctions found.</div>
                        )}
                        {!loading && !error && auctionItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="group flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-blue-500/30 transition-all"
                            >
                                <div className="aspect-[1/1] bg-zinc-900 relative overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute top-0 right-0 p-3">
                                        <span className="bg-black/80 backdrop-blur-sm px-2 py-1 text-[9px] font-mono text-blue-400 border border-white/10 uppercase tracking-tighter">
                                            {getCountdown(featuredDrop.ends)}
                                        </span>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <button
                                            className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                            onClick={() => handleBid(item)}
                                            disabled={txStatus === 'pending'}
                                            aria-busy={txStatus === 'pending'}
                                        >
                                            {txStatus === 'pending' ? 'Processing...' : 'Place Bid'}
                                        </button>
                                    </div>
                                    {/* Wallet connect and transaction feedback (moved outside grid for accessibility) */}
                                    {/* Wallet connect and transaction feedback (global, not per item) */}
                                    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                                        <ConnectButton />
                                        {txStatus !== 'idle' && (
                                            <div
                                                role="status"
                                                aria-live="polite"
                                                className={`px-4 py-2 rounded shadow-lg text-xs font-bold ${txStatus === 'success' ? 'bg-emerald-600 text-white' : txStatus === 'error' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
                                            >
                                                {txMessage}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="max-w-[70%]">
                                            <h4 className="text-xs font-black uppercase text-white truncate mb-1">{item.name}</h4>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase">{item.creator || 'Unknown'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">List</p>
                                            <p className="text-xs font-mono font-bold text-blue-500">{item.value || item.price}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Highest Bid</span>
                                        <span className="text-[11px] font-mono font-bold text-zinc-300">{item.highBid || '-'}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}