'use client';

import { motion } from 'framer-motion';
import LiquidityChart from '@/components/LiquidityChart';

export default function TerminalView() {
    return (
        <div className="grid grid-cols-12 gap-1 bg-zinc-900/20 border border-white/5 h-[calc(100vh-160px)] font-mono">

            {/* SECTION A: CHARTING (8 Columns) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col border-r border-white/5">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
                    <div className="flex gap-6 items-center">
                        <h3 className="text-white font-black italic tracking-tighter">VOID / ETH</h3>
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                            LIVE_DATA
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {['1M', '15M', '1H', '1D'].map(t => (
                            <button key={t} className="text-[9px] px-3 py-1 border border-white/5 hover:border-blue-500 text-zinc-500 hover:text-white transition-all">
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-6">
                    <LiquidityChart />
                </div>
            </div>

            {/* SECTION B: EXECUTION & ORDERS (4 Columns) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col bg-black/20">

                {/* TABS: SWAP vs NFT */}
                <div className="grid grid-cols-2 border-b border-white/5">
                    <button className="py-4 text-[10px] font-black uppercase tracking-widest text-blue-500 border-b-2 border-blue-500 bg-blue-500/5">
                        Token_Swap
                    </button>
                    <button className="py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white border-b-2 border-transparent">
                        NFT_Execute
                    </button>
                </div>

                {/* SWAP INTERFACE (The Liquidity Layer) */}
                <div className="p-6 space-y-6 flex-1">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-bold">
                            <span>Pay_Amount</span>
                            <span>Bal: 12.4 ETH</span>
                        </div>
                        <div className="relative group">
                            <input type="number" placeholder="0.00" className="w-full bg-zinc-950 border border-white/10 p-4 text-xl font-black outline-none focus:border-blue-500 transition-all" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">ETH</span>
                        </div>
                    </div>

                    <div className="flex justify-center -my-3 relative z-10">
                        <button className="p-2 bg-blue-600 rounded-full border-4 border-black hover:rotate-180 transition-transform duration-500">
                            ↓
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] text-zinc-500 uppercase font-bold">
                            <span>Receive_Est</span>
                            <span>Price: $2,421.12</span>
                        </div>
                        <div className="relative group">
                            <input type="number" placeholder="0.00" disabled className="w-full bg-zinc-900/50 border border-white/5 p-4 text-xl font-black outline-none" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">USDC</span>
                        </div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                            <span>Network_Fee</span>
                            <span>$12.42</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                            <span>Liquidity_Provider_Fee</span>
                            <span>0.3%</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5">
                    <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        Initialize_Execution
                    </button>
                </div>
            </div>
        </div>
    );
}