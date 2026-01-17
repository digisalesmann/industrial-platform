'use client';

import { motion } from 'framer-motion';

interface NFT {
  id: string;
  name: string;
  price: string;
  rarity: string;
  type: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nft: NFT | null;
  onFinalize: () => void;
}

export default function TransactionSidebar({ isOpen, onClose, nft, onFinalize }: Props) {
  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-zinc-950 border-l border-white/10 z-[60] p-8 shadow-2xl shadow-blue-500/10"
    >
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Execution_Terminal</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white font-mono text-xs">CLOSE_X</button>
      </div>

      {/* Transaction Simulation Block */}
      <div className="space-y-6">
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-lg">
          <p className="text-[9px] text-zinc-500 uppercase mb-4 tracking-widest">Simulation_Output</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400">Total Outflow</span>
            <span className="text-sm font-bold text-rose-500">-{nft ? nft.price : '--'} ETH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">Estimated Gas</span>
            <span className="text-sm font-mono text-zinc-300">$12.42</span>
          </div>
        </div>

        <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
          <p className="text-[10px] text-blue-400 font-bold mb-2 uppercase">Net Balance Change</p>
          <p className="text-xl font-black font-mono">+1 {nft ? nft.name.toUpperCase().replace(/ /g, '_') : '--'}</p>
        </div>
      </div>

      <button
        className="absolute bottom-8 left-8 right-8 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-blue-500 transition-all"
        onClick={onFinalize}
      >
        Finalize Signature
      </button>
    </motion.aside>
  );
}