'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const fallbackTickerData = [
  { label: 'ETH/USD', val: '$2,451.20', delta: '+2.4%' },
  { label: 'BTC/USD', val: '$41,200.50', delta: '+1.1%' },
  { label: 'INDSTR/USD', val: '$1.04', delta: '+0.5%' },
  { label: 'VOID FLOOR', val: '1.25 ETH', delta: '-0.2%' },
  { label: 'GAS PRICE', val: '14 GWEI', delta: 'OPTIMAL' },
  { label: 'TVL', val: '$1.42B', delta: '+12.4%' },
  { label: '24H VOLUME', val: '$84.9M', delta: '+2.1%' },
  { label: 'NFT CAP', val: '42.8K ETH', delta: '+0.8%' },
  { label: 'USDT/USD', val: '$1.00', delta: 'STABLE' },
  { label: 'UNI/USD', val: '$7.12', delta: '+0.9%' },
  { label: 'APE/USD', val: '$1.32', delta: '-1.2%' },
  { label: 'ARB/USD', val: '$1.89', delta: '+3.2%' },
];

export default function MarketTicker() {
  const [tickerData, setTickerData] = useState(fallbackTickerData);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,tether,uniswap,apecoin,arbitrum&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        // Helper for delta formatting
        const fmtDelta = (val: number | undefined, fallback: string): string =>
          typeof val === 'number' ? `${val > 0 ? '+' : ''}${val.toFixed(1)}%` : fallback;

        setTickerData([
          { label: 'ETH/USD', val: `$${data.ethereum.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, delta: fmtDelta(data.ethereum.usd_24h_change, '+2.4%') },
          { label: 'BTC/USD', val: `$${data.bitcoin.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, delta: fmtDelta(data.bitcoin.usd_24h_change, '+1.1%') },
          ...fallbackTickerData.slice(2, 8),
          { label: 'USDT/USD', val: `$${data.tether.usd.toFixed(2)}`, delta: fmtDelta(data.tether.usd_24h_change, 'STABLE') },
          { label: 'UNI/USD', val: `$${data.uniswap.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, delta: fmtDelta(data.uniswap.usd_24h_change, '+0.9%') },
          { label: 'APE/USD', val: `$${data.apecoin.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, delta: fmtDelta(data.apecoin.usd_24h_change, '-1.2%') },
          { label: 'ARB/USD', val: `$${data.arbitrum.usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, delta: fmtDelta(data.arbitrum.usd_24h_change, '+3.2%') },
        ]);
      } catch (e) {
        setTickerData(fallbackTickerData);
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // update every 60s
    return () => clearInterval(interval);
  }, []);

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
            <span className={
              item.delta.startsWith('+') ? 'text-emerald-500' :
                item.delta === 'OPTIMAL' || item.delta === 'STABLE' ? 'text-blue-500' :
                  'text-rose-500'
            }>
              {item.delta}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}