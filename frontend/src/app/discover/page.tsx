'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function VisualDiscover() {
    const featuredDrop = {
        name: "VOID_ARCHITECTS",
        ends: "04:22:15",
        floor: "0.08 ETH",
        items: 5000,
    };

    const trending = [
        { id: 1, name: "CYBER_CORE", floor: "1.2 ETH", vol: "420 ETH", change: "+12%" },
        { id: 2, name: "NEON_GENESIS", floor: "0.5 ETH", vol: "150 ETH", change: "-2%" },
        { id: 3, name: "INDUSTRIAL_VOID", floor: "2.5 ETH", vol: "890 ETH", change: "+45%" },
        { id: 4, name: "SILICON_SOUL", floor: "0.1 ETH", vol: "45 ETH", change: "+5%" },
    ];

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <Navbar currentView="terminal" onViewChange={() => {}} />

            {/* 1. IMMERSIVE FEATURED HERO */}
            <section className="relative h-[70vh] w-full bg-zinc-900 border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <span className="bg-blue-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">Featured_Drop</span>
                            <span className="text-[10px] font-mono text-zinc-400">SESSION_04</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">{featuredDrop.name}</h1>
                        <p className="text-zinc-400 text-sm uppercase tracking-wider font-bold">A limited collection of 5,000 algorithmic units built for the deep-void protocol.</p>
                        <div className="flex gap-4 pt-4">
                            <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Go_To_Mint</button>
                            <button className="px-10 py-4 bg-black border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all">View_Collection</button>
                        </div>
                    </div>

                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 w-full md:w-72 space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-[9px] text-zinc-500 font-black uppercase">Mint_Closes_In</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <p className="text-3xl font-black font-mono tracking-tighter">{featuredDrop.ends}</p>
                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                            <div><p className="text-[8px] text-zinc-600 uppercase">Price</p><p className="text-xs font-bold">{featuredDrop.floor}</p></div>
                            <div><p className="text-[8px] text-zinc-600 uppercase">Supply</p><p className="text-xs font-bold">{featuredDrop.items}</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 md:px-16 mt-16 space-y-20">
                
                {/* 2. TRENDING BOARD (Like Magic Eden Top Collections) */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic-none">Trending_Collections</h2>
                        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">View_All_Market</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                        {trending.map((c, i) => (
                            <div key={c.id} className="bg-black p-6 flex items-center gap-6 group hover:bg-zinc-950 cursor-pointer transition-colors">
                                <span className="text-xs font-black text-zinc-700">{i + 1}</span>
                                <div className="w-12 h-12 bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-xl text-blue-600 group-hover:scale-110 transition-transform">
                                    {c.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black uppercase truncate">{c.name}</p>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase">Floor: {c.floor}</p>
                                </div>
                                <p className={`text-[10px] font-black ${c.change.includes('+') ? 'text-emerald-500' : 'text-red-500'}`}>{c.change}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. VISUAL GALLERY GRID */}
                <section className="space-y-8">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic-none">Live_Auctions</h2>
                        <div className="flex gap-4">
                            {['All', 'Art', 'Gaming', 'Industrial'].map(cat => (
                                <button key={cat} className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">{cat}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <motion.div key={i} whileHover={{ y: -5 }} className="bg-zinc-950 border border-white/10 group cursor-pointer">
                                <div className="aspect-[4/5] bg-zinc-900 relative overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center text-zinc-800 text-6xl font-black">#{i+100}</div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-black/80 backdrop-blur px-2 py-0.5 text-[8px] font-black uppercase border border-white/10">04:22:15</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-full py-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">Quick_Bid</button>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <p className="text-[11px] font-black uppercase tracking-tight">VOID_UNIT_{i+100}</p>
                                        <p className="text-[11px] font-mono font-bold text-blue-400">1.25 ETH</p>
                                    </div>
                                    <div className="flex justify-between text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                                        <span>Highest_Bid</span>
                                        <span>0.88 ETH</span>
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