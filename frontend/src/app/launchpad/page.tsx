'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function VisualDiscover() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

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

    // Expanded auction items for all categories
    const auctionItems = [
        // Art
        { id: 201, name: "Dreamscape", price: "2.00 ETH", highBid: "1.50 ETH", category: "Art", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=800&fit=crop", creator: "@artdreamer" },
        { id: 202, name: "Color Burst", price: "1.10 ETH", highBid: "0.90 ETH", category: "Art", image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&h=800&fit=crop", creator: "@colorburst" },
        // Gaming
        { id: 301, name: "Pixel Hero", price: "0.80 ETH", highBid: "0.60 ETH", category: "Gaming", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=800&fit=crop", creator: "@pixelhero" },
        { id: 302, name: "Dragon Quest", price: "1.50 ETH", highBid: "1.20 ETH", category: "Gaming", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=800&fit=crop", creator: "@dragonquest" },
        // Industrial
        { id: 401, name: "Steel Works", price: "2.20 ETH", highBid: "1.80 ETH", category: "Industrial", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&h=800&fit=crop", creator: "@steelworks" },
        { id: 402, name: "Factory Line", price: "1.75 ETH", highBid: "1.30 ETH", category: "Industrial", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=800&fit=crop", creator: "@factoryline" },
        // Cyber
        { id: 501, name: "Neon Runner", price: "1.60 ETH", highBid: "1.10 ETH", category: "Cyber", image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=600&h=800&fit=crop", creator: "@neonrunner" },
        { id: 502, name: "Circuit Breaker", price: "1.30 ETH", highBid: "1.00 ETH", category: "Cyber", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600&h=800&fit=crop", creator: "@circuitbreaker" },
        // All (Void Units)
        { id: 100, name: "Void Unit #100", price: "1.25 ETH", highBid: "0.88 ETH", category: "Industrial", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=800&fit=crop&sig=0", creator: "@voidlabs" },
        { id: 101, name: "Void Unit #101", price: "1.25 ETH", highBid: "0.88 ETH", category: "Cyber", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=800&fit=crop&sig=1", creator: "@cyberartist" },
    ];

    // ...existing code... (expanded auctionItems is already declared below)

    function getCountdown(target: Date): string {
        const diff = Math.max(0, target.getTime() - now.getTime());
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        return `${h}:${m}:${s}`;
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
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                                {featuredDrop.name}
                            </h2>
                        </h2>
                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link href="/mint" className="px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all text-center">Mint Now</Link>
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
                        {auctionItems.filter(item => activeCategory === 'All' || item.category === activeCategory).map((item) => (
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
                                        <button className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                            Place Bid
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="max-w-[70%]">
                                            <h4 className="text-xs font-black uppercase text-white truncate mb-1">{item.name}</h4>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase">{item.creator}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">List</p>
                                            <p className="text-xs font-mono font-bold text-blue-500">{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Highest Bid</span>
                                        <span className="text-[11px] font-mono font-bold text-zinc-300">{item.highBid}</span>
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