'use client';


import { TrendingUp, Server, ArrowDownCircle, ArrowUpCircle, Vault } from 'lucide-react';
import NFTCard from '@/components/NFTCard';
import dynamic from 'next/dynamic';
const TVLChart = dynamic(() => import('./TVLChart'), { ssr: false });

export default function Dashboard() {
  return (
    <section className="max-w-[1400px] mx-auto px-8 py-12">
      {/* Dashboard Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white" /> Protocol Dashboard
          </h2>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-white">Network Overview</h1>
          <p className="text-zinc-400 text-xs mt-2">Real-time protocol metrics, liquidity, and vault status.</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {/* All quick stats use subtle grey borders and only white/grey for icons/text */}
        <div className="bg-zinc-900/40 border border-zinc-700 p-5 flex items-center gap-4">
          <Server className="w-7 h-7 text-zinc-200" />
          <div>
            <p className="text-[10px] text-zinc-200 uppercase font-bold mb-1">Active Nodes</p>
            <p className="text-xl font-black font-mono text-white">1,024</p>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-700 p-5 flex items-center gap-4">
          <ArrowUpCircle className="w-7 h-7 text-zinc-200" />
          <div>
            <p className="text-[10px] text-zinc-200 uppercase font-bold mb-1">24h Inflow</p>
            <p className="text-xl font-black font-mono text-white">+$12.4M</p>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-700 p-5 flex items-center gap-4">
          <ArrowDownCircle className="w-7 h-7 text-zinc-200" />
          <div>
            <p className="text-[10px] text-zinc-200 uppercase font-bold mb-1">24h Outflow</p>
            <p className="text-xl font-black font-mono text-white">-$8.1M</p>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-700 p-5 flex items-center gap-4">
          <Vault className="w-7 h-7 text-zinc-200" />
          <div>
            <p className="text-[10px] text-zinc-200 uppercase font-bold mb-1">Vaults</p>
            <p className="text-xl font-black font-mono text-white">12</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
        {/* Protocol Health Indicator Widget (replaces TVL chart and balance) */}
        <div className="md:col-span-4 bg-zinc-900/20 border border-white/5 p-8 flex flex-col justify-between min-h-[340px] shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-white" />
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Protocol Health</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-white flex items-center justify-center bg-zinc-950 mb-4">
              <span className="text-3xl font-black text-white">98%</span>
            </div>
            <p className="text-lg font-bold text-white mb-2">Excellent</p>
            <p className="text-zinc-400 text-xs text-center">The protocol is operating optimally. No major issues detected in the last 24 hours.</p>
          </div>
        </div>

        {/* Second Chart Widget (placeholder) - white/grey only */}
        <div className="md:col-span-4 bg-zinc-900/20 border border-white/5 p-8 flex flex-col justify-between min-h-[340px] shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpCircle className="w-5 h-5 text-zinc-200" />
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Volume (24h)</p>
          </div>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tighter break-words whitespace-pre-line mb-2 text-white">$324,000,000</h3>
          <div className="mt-4 mb-6 flex-1 flex items-center justify-center">
            {/* Placeholder for a second chart, e.g., Bar/Line chart */}
            <span className="text-zinc-700 text-xs">[Chart Coming Soon]</span>
          </div>
          <div className="flex gap-8 border-t border-white/5 pt-6">
            <div>
              <p className="text-[9px] text-zinc-600 uppercase mb-1">Transactions</p>
              <p className="text-xl font-bold font-mono text-white">+8,200</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-600 uppercase mb-1">Unique Wallets</p>
              <p className="text-xl font-bold font-mono text-white">+2,100</p>
            </div>
          </div>
        </div>

        {/* NFT Vault Card - Use NFTCard from gallery */}
        <div className="md:col-span-4 flex items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Example NFTCard usage, replace with real data as needed */}
            {/* @ts-ignore */}
          </div>
        </div>
      </div>
    </section>
  );
}