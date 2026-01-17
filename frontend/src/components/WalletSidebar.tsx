'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useDisconnect, useAccount } from 'wagmi';
import Link from 'next/link'; // Import Link for navigation

const gasHistory = [
    { day: 'Mon', gas: 45 }, { day: 'Tue', gas: 52 },
    { day: 'Wed', gas: 38 }, { day: 'Thu', gas: 65 },
    { day: 'Fri', gas: 48 }, { day: 'Sat', gas: 22 },
    { day: 'Sun', gas: 18 },
];

export default function WalletSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();

    const handleDisconnect = () => {
        disconnect();
        onClose();
    };

    return (
        <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: isOpen ? 0 : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full md:w-[380px] bg-zinc-950/90 backdrop-blur-3xl border-r border-white/5 z-[60] flex flex-col"
        >
            {/* 1. Header with Session Status */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">Session</h3>
                    <p className="text-xs font-mono text-zinc-400">
                        {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-600">
                    <span className="font-mono text-[10px]">Close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">

                {/* NEW: DASHBOARD ACCESS PORTAL */}
                <section>
                    <Link href="/portfolio" onClick={onClose}>
                        <div className="group relative p-6 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer overflow-hidden">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-blue-500/50" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Open Dashboard</h4>
                                    <p className="text-[9px] text-blue-400 font-mono uppercase">All Assets</p>
                                </div>
                                <svg className="w-5 h-5 text-blue-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </section>

                {/* 2. Efficiency Metrics */}
                <section>
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-4">Efficiency</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-none">
                            <p className="text-[8px] text-emerald-500 uppercase mb-1 font-black">Gas Saved</p>
                            <p className="text-xl font-black font-mono">94.2%</p>
                        </div>
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-none">
                            <p className="text-[8px] text-blue-500 uppercase mb-1 font-black">Success Rate</p>
                            <p className="text-xl font-black font-mono">100%</p>
                        </div>
                    </div>
                </section>

                {/* 3. Gas Usage History */}
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Gas Used (7 Days)</p>
                        <span className="text-[9px] font-mono text-zinc-500">Avg: 38 Gwei</span>
                    </div>
                    <div className="h-24 w-full bg-zinc-900/30 border border-white/5 overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={gasHistory}>
                                <Area type="monotone" dataKey="gas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* 4. Active Assets */}
                <section>
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mb-4">Inventory</p>
                    <div className="space-y-2">
                        {[
                            { name: 'Industrial Void #01', type: 'ERC-721', val: '1.5 ETH' },
                            { name: 'USDC/ETH LP', type: 'Uniswap V3', val: '$12,400' },
                        ].map((asset, i) => (
                            <div key={i} className="group p-3 bg-zinc-900/40 border border-white/5 rounded-none flex justify-between items-center hover:bg-zinc-800/50 transition-all cursor-crosshair">
                                <div>
                                    <p className="text-xs font-bold text-white mb-0.5">{asset.name}</p>
                                    <p className="text-[8px] text-zinc-500 uppercase tracking-tighter">{asset.type}</p>
                                </div>
                                <p className="text-xs font-mono font-bold text-blue-400">{asset.val}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 5. Terminal Footer */}
            <div className="p-8 border-t border-white/5 bg-zinc-950/50 space-y-3">
                <button
                    className="w-full py-4 bg-blue-600/10 border border-blue-500/30 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-none hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    onClick={handleDisconnect}
                >
                    Disconnect Wallet
                </button>
            </div>
        </motion.aside>
    );
}