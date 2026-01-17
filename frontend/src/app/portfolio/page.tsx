'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function ProtocolProfile() {
    const [activeTab, setActiveTab] = useState('Items');
    const [selectedNft, setSelectedNft] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string[]>([]);
    const [filterRarity, setFilterRarity] = useState<string[]>([]);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [pfpImage, setPfpImage] = useState<string | null>(null);

    const bannerInput = useRef<HTMLInputElement>(null);
    const pfpInput = useRef<HTMLInputElement>(null);

    const collections = [
        { id: '7A-01', name: 'VOID_UNIT_01', rarity: 'Legendary', floor: '2.5 ETH', type: 'INDUSTRIAL' },
        { id: '7A-88', name: 'NEON_SOUL', rarity: 'Rare', floor: '0.8 ETH', type: 'CYBER' },
        { id: '7A-12', name: 'SILICON_V2', rarity: 'Common', floor: '0.4 ETH', type: 'ORGANIC' },
        { id: '7A-99', name: 'CORE_ENGINE', rarity: 'Epic', floor: '1.2 ETH', type: 'MILITARY' },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (file) { setter(URL.createObjectURL(file)); }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white pb-20 font-sans selection:bg-blue-500/30">
            <Navbar currentView="marketplace" onViewChange={() => { }} />

            {/* 1. IDENTITY HEADER */}
            <section className="relative pt-16">
                {/* Banner Area */}
                <div
                    className="h-40 md:h-64 bg-zinc-900 border-b border-white/5 relative cursor-pointer group overflow-hidden"
                    onClick={() => bannerInput.current?.click()}
                >
                    {bannerImage ? (
                        <img src={bannerImage} className="w-full h-full object-cover" alt="Banner" />
                    ) : (
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-white text-black px-4 py-2">Change_Environment_Texture</span>
                    </div>
                    <input type="file" ref={bannerInput} className="hidden" onChange={(e) => handleImageUpload(e, setBannerImage)} />
                </div>

                {/* Profile Info Overlay */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 md:-mt-16">
                        {/* Avatar */}
                        <div
                            className="w-24 h-24 md:w-40 md:h-40 bg-[#0a0a0a] border-4 border-[#050505] relative group cursor-pointer overflow-hidden"
                            onClick={() => pfpInput.current?.click()}
                        >
                            {pfpImage ? (
                                <img src={pfpImage} className="w-full h-full object-cover" alt="PFP" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-4xl bg-blue-600">P</div>
                            )}
                            <div className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[8px] font-black uppercase p-4 text-center">Update_Node_Icon</div>
                            <input type="file" ref={pfpInput} className="hidden" onChange={(e) => handleImageUpload(e, setPfpImage)} />
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 pb-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Protocol_User_01</h1>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-emerald-500/20" />
                            </div>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-2">ID: 0x7A_VERIFIED_CORE_NODE</p>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex gap-8 border-l border-white/5 pl-8 hidden xl:flex pb-2">
                            <div>
                                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Global_Rank</p>
                                <p className="text-lg font-mono font-bold">#1,204</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest">Total_Assets</p>
                                <p className="text-lg font-mono font-bold">42</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. MAIN CONTENT AREA */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 md:mt-24">

                {/* Tabs */}
                <div className="flex gap-8 border-b border-white/5 overflow-x-auto no-scrollbar mb-10">
                    {['Items', 'Offers', 'Activity', 'Listed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all relative shrink-0 ${activeTab === tab ? 'text-blue-500' : 'text-zinc-600 hover:text-white'}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Filters Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-10">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-4 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Marketplace_Status
                            </h3>
                            <div className="flex flex-col border border-white/5 divide-y divide-white/5">
                                {['Buy Now', 'Auction', 'New'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])}
                                        className={`p-4 text-left text-[9px] font-black uppercase tracking-widest transition-all flex justify-between items-center ${filterStatus.includes(status) ? 'bg-blue-600 text-white' : 'bg-[#0a0a0a] text-zinc-500 hover:bg-zinc-900'}`}
                                    >
                                        {status}
                                        {filterStatus.includes(status) && <span className="text-[12px]">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-6 flex items-center gap-2">
                                <div className="w-1 h-1 bg-zinc-700" /> Rarity_Protocol
                            </h3>
                            <div className="space-y-4">
                                {['Legendary', 'Epic', 'Rare', 'Common'].map(r => (
                                    <div key={r} onClick={() => setFilterRarity(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} className="flex items-center justify-between group cursor-pointer">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${filterRarity.includes(r) ? 'text-blue-500' : 'text-zinc-600 group-hover:text-white'}`}>{r}</span>
                                        <div className={`w-4 h-4 border transition-all flex items-center justify-center ${filterRarity.includes(r) ? 'bg-blue-600 border-blue-600' : 'border-white/10 group-hover:border-zinc-500'}`}>
                                            {filterRarity.includes(r) && <span className="text-[10px] text-white font-bold">✓</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>

                    {/* Grid Area */}
                    <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {collections.map((nft) => (
                            <motion.div
                                key={nft.id}
                                layout
                                className="bg-[#0a0a0a] border border-white/5 flex flex-col group hover:border-blue-500/40 transition-all"
                            >
                                <div className="aspect-square bg-zinc-900 relative overflow-hidden shrink-0">
                                    <div className="w-full h-full flex items-center justify-center text-zinc-800 text-5xl font-black">#{nft.id}</div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-black/80 backdrop-blur-md px-2 py-1 text-[8px] font-black text-blue-400 border border-white/10 uppercase tracking-widest">{nft.type.replace('_', ' ')}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedNft(nft)}
                                        className="absolute inset-x-0 bottom-0 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-all duration-300"
                                    >
                                        List Item
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xs font-black uppercase tracking-tight truncate w-[60%] text-white">{nft.name}</h4>
                                        <p className="text-xs font-mono font-bold text-emerald-500">{nft.floor}</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{nft.rarity}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LISTING MODAL */}
            <AnimatePresence>
                {selectedNft && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNft(null)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-8 md:p-12 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
                            <header className="mb-12 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-3">List Item</p>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white">{selectedNft.name}</h2>
                                </div>
                                <button onClick={() => setSelectedNft(null)} className="text-zinc-600 hover:text-white font-mono text-sm tracking-tighter bg-zinc-900 px-3 py-1">Cancel</button>
                            </header>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Price (ETH)</label>
                                        <span className="text-[9px] text-zinc-700 font-mono">Fee: 0.002</span>
                                    </div>
                                    <input
                                        autoFocus
                                        placeholder="0.00"
                                        type="number"
                                        className="w-full bg-black border-b border-white/10 py-6 text-4xl font-black outline-none focus:border-blue-600 transition-colors text-white"
                                    />
                                </div>
                                <div className="p-4 bg-zinc-900/50 border border-white/5">
                                    <p className="text-[9px] text-zinc-500 leading-relaxed font-medium uppercase">Warning: All listings are final. Please check your price before listing.</p>
                                </div>
                                <button className="w-full py-6 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/10">
                                    Confirm Listing
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}