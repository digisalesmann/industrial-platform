'use client';

import { motion } from 'framer-motion';

const activity = [
    { type: 'MINT', asset: 'VOID #1024', price: '1.5 ETH', time: '2m ago', user: '0x7a...d3' },
    { type: 'SWAP', asset: 'INDSTR/USDC', price: '$2,450', time: '5m ago', user: '0x12...f9' },
    { type: 'SALE', asset: 'VOID #0912', price: '2.1 ETH', time: '12m ago', user: '0xbc...44' },
];

export default function ActivityFeed() {
    return (
        <div className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 font-mono">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold font-sans">Live_Protocol_Feed</span>
                <span className="text-[9px] text-blue-500 animate-pulse">TX_SYNCING...</span>
            </div>
            <div className="space-y-4">
                {activity.map((tx, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        key={i} className="flex justify-between items-center group cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tx.type === 'MINT' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                                    tx.type === 'SWAP' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                                        'text-purple-500 border-purple-500/20 bg-purple-500/5'
                                }`}>
                                {tx.type}
                            </span>
                            <span className="text-xs text-white font-bold tracking-tighter">{tx.asset}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white font-bold">{tx.price}</p>
                            <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">{tx.time} by {tx.user}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}