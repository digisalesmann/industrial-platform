'use client';

import { motion } from 'framer-motion';

const tickerData = [
  { label: 'ETH/USD', val: '$2,451.20', delta: '+2.4%' },
  { label: 'INDSTR/USD', val: '$1.04', delta: '+0.5%' },
  { label: 'VOID_FLOOR', val: '1.25 ETH', delta: '-0.2%' },
  { label: 'GAS_PRICE', val: '14 GWEI', delta: 'OPTIMAL' },
];

export default function MarketTicker() {
  return (
    <div className="w-full bg-zinc-950 border-y border-white/5 py-3 overflow-hidden flex whitespace-nowrap">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-16 px-8"
      >
        {[...tickerData, ...tickerData].map((item, i) => (
          <div key={i} className="flex gap-3 items-center font-mono text-[10px] tracking-widest uppercase">
            <span className="text-zinc-500">{item.label}</span>
            <span className="text-white font-bold">{item.val}</span>
            <span className={item.delta.startsWith('+') ? 'text-emerald-500' : item.delta === 'OPTIMAL' ? 'text-blue-500' : 'text-rose-500'}>
              {item.delta}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}