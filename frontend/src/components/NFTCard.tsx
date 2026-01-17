'use client';

import { motion } from 'framer-motion';

// Inside NFTCard function...
export default function NFTCard({ id, name, price, onExecute }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-zinc-900/30 border border-white/5 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-500"
    >
      {/* Asset Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/5 bg-zinc-950/30">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Asset_ID: {id}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
      </div>

      {/* Visual Container with Placeholder Grid */}
      <div className="aspect-square bg-zinc-950 relative flex items-center justify-center overflow-hidden">
        {/* Sublte Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="z-10 text-zinc-800 font-black text-6xl italic select-none uppercase tracking-tighter">
          Void
        </div>

        {/* Hover Info Overlay */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500" />
      </div>

      {/* Asset Data */}
      <div className="p-5">
        <h4 className="text-sm font-bold tracking-tight mb-4 uppercase">{name}</h4>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-[0.2em] mb-1">Current_Value</p>
            <p className="text-xl font-mono font-bold tracking-tighter text-white">{price} ETH</p>
          </div>
          <button
            onClick={onExecute} // Trigger the state change
            className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase rounded-sm hover:bg-blue-500 hover:text-white transition-all"
          >
            Execute
          </button>
        </div>
      </div>
    </motion.div>
  );
}