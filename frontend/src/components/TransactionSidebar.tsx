'use client';


import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchGasPrice } from '@/lib/gas';
import { fetchEthPrice } from '@/lib/eth';

export interface NFT {
  id: string;
  name: string;
  price?: string;
  rarity?: string;
  type?: string;
  image?: string;
  description?: string;
  collection_id?: string;
  owner?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nft: NFT | null;
  onFinalize: () => void;
}

export default function TransactionSidebar({ isOpen, onClose, nft, onFinalize }: Props) {
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!nft) return;
    setLoading(true);
    Promise.all([fetchGasPrice(), fetchEthPrice()])
      .then(([gas, eth]) => {
        setGasPrice(gas);
        setEthPrice(eth);
      })
      .finally(() => setLoading(false));
  }, [nft]);

  // Calculate estimated gas in USD (assume 0.002 ETH per tx as a rough estimate)
  const estimatedGasEth = 0.002;
  const estimatedGasUsd = ethPrice ? (estimatedGasEth * ethPrice).toFixed(2) : '--';

  // Calculate NFT price in USD
  const nftPriceUsd = nft && ethPrice ? (parseFloat(nft.price) * ethPrice).toFixed(2) : '--';

  // Format gas price
  const gasPriceDisplay = gasPrice ? `${gasPrice} Gwei` : loading ? 'Loading...' : '--';
  const ethPriceDisplay = ethPrice ? `$${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : loading ? 'Loading...' : '--';

  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-zinc-950 border-l border-white/10 z-[60] p-8 shadow-2xl shadow-blue-500/10"
    >
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Transaction</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white font-mono text-xs">Close</button>
      </div>


      {/* Transaction Simulation Block */}
      <div className="space-y-6">
        <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-lg">
          <p className="text-[9px] text-zinc-500 uppercase mb-4 tracking-widest">Summary</p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400">Total Outflow</span>
            <span className="text-sm font-bold text-rose-500">-{nft ? nft.price : '--'} ETH <span className='text-zinc-400 font-normal ml-2'>({nftPriceUsd !== '--' ? `$${nftPriceUsd}` : '--'})</span></span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400">ETH Price</span>
            <span className="text-sm font-mono text-zinc-300">{ethPriceDisplay}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400">Gas Price</span>
            <span className="text-sm font-mono text-zinc-300">{gasPriceDisplay}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">Estimated Gas</span>
            <span className="text-sm font-mono text-zinc-300">{estimatedGasEth} ETH <span className='text-zinc-400 font-normal ml-2'>({estimatedGasUsd !== '--' ? `$${estimatedGasUsd}` : '--'})</span></span>
          </div>
        </div>

        <div className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg">
          <p className="text-[10px] text-blue-400 font-bold mb-2 uppercase">You Will Receive</p>
          <p className="text-xl font-black font-mono">+1 {nft ? nft.name : '--'}</p>
        </div>
      </div>

      <button
        className="absolute bottom-8 left-8 right-8 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-blue-500 transition-all"
        onClick={onFinalize}
      >
        Complete Purchase
      </button>
    </motion.aside>
  );
}