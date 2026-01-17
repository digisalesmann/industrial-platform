'use client';

import { motion, Variants } from 'framer-motion';

export default function Hero() {
  const fader: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative pt-44 pb-24 px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Mission Control */}
        <motion.div
          initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <motion.div variants={fader} className="flex items-center gap-3 mb-8">
            <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[9px] font-bold tracking-[0.2em] uppercase rounded">
              Mainnet Stable
            </span>
            <span className="text-zinc-600 font-mono text-[9px]">Version: 7A.24.09</span>
          </motion.div>

          <motion.h1 variants={fader} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
            Unified <br /> <span className="text-zinc-500">Asset</span> Layer.
          </motion.h1>

          <motion.p variants={fader} className="text-zinc-500 text-lg max-w-lg mb-12 leading-relaxed">
            The first platform designed to bring together digital assets and NFTs in one place. Trade easily and securely with minimal fees.
          </motion.p>

          <motion.div variants={fader} className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-sm hover:bg-blue-500 hover:text-white transition-all">
              Get Started
            </button>
            <button className="px-8 py-4 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-white/5 transition-all">
              View Reports
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column: Live Data Feed (Mature Visual) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-zinc-900/30 border border-white/5 backdrop-blur-sm rounded-xl p-8 font-mono"
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Live Stats</span>
            <span className="text-[10px] text-emerald-500 animate-pulse uppercase">● Live</span>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Total Locked', value: '$1.42B', sub: '+12.4%' },
              { label: '24h Volume', value: '$84.9M', sub: '+2.1%' },
              { label: 'Average Gas Saved', value: '94.2%', sub: 'vs previous' },
              { label: 'NFT Market Cap', value: '42.8K ETH', sub: 'All NFTs' }
            ].map((data, i) => (
              <div key={i} className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] text-zinc-600 uppercase mb-1">{data.label}</p>
                  <p className="text-2xl font-bold tracking-tighter">{data.value}</p>
                </div>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  {data.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}