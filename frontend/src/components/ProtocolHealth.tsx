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
        <section className="py-8 md:py-12 border-t border-white/5 bg-transparent relative">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
                {/* Responsive Grid Logic:
                  - 1 col on mobile (grid-cols-1)
                  - 2 cols on tablet (sm:grid-cols-2)
                  - 4 cols on desktop (lg:grid-cols-4)
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden shadow-xl shadow-black/30 backdrop-blur-sm">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-black/70 p-6 sm:p-8 group hover:bg-zinc-900/40 transition-colors backdrop-blur-sm rounded-none"
                        >
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">
                                {stat.label}
                            </p>
                            <div className="flex items-baseline gap-3">
                                {/* Text size scales slightly for mobile accessibility */}
                                <p className={`text-2xl sm:text-3xl font-black italic-none tracking-tighter ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>
                            <p className="text-[8px] font-mono text-zinc-500 mt-2 uppercase tracking-widest border-t border-white/5 pt-2">
                                {stat.detail}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}