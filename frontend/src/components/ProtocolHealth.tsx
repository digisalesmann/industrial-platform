'use client';

import { motion } from 'framer-motion';

export default function ProtocolHealth() {
    const stats = [
        { label: "NETWORK_UPTIME", value: "99.98%", detail: "MAINNET_STABLE", color: "text-emerald-500" },
        { label: "PROTOCOL_TVL", value: "$1.42B", detail: "+2.4%_INFLOW", color: "text-blue-500" },
        { label: "GAS_ESTIMATE", value: "14 GWEI", detail: "PRIORITY_NORMAL", color: "text-zinc-400" },
        { label: "ACTIVE_NODES", value: "1,024", detail: "DECENTRALIZED", color: "text-white" }
    ];

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#050505] flex flex-col justify-center font-sans">
            {/* BACKGROUND THEME LAYER */}
            <div className="absolute inset-0 z-0">
                {/* Layer 1: The Industrial Grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />

                {/* Layer 2: The Core Atmospheric Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

                {/* Layer 3: Noise/Grain Texture */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            </div>

            {/* CONTENT LAYER */}
            <div className="relative z-10 py-12 px-6 sm:px-12 w-full">
                {/* Header for context */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="h-[1px] w-12 bg-blue-600/50" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">System_Telemetry</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden shadow-2xl shadow-black">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-[#080808]/90 p-8 sm:p-10 group hover:bg-zinc-900/40 transition-all duration-500 relative overflow-hidden"
                        >
                            {/* Subtle hover accent */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">
                                {stat.label}
                            </p>

                            <div className="flex items-baseline gap-3 mb-6">
                                <p className={`text-3xl sm:text-4xl font-black tracking-tighter not-italic ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                                    {stat.detail}
                                </p>
                                <div className={`w-1 h-1 rounded-full animate-pulse ${stat.color.replace('text', 'bg')}`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}