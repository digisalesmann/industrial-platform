'use client';

import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const fader: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative pt-44 pb-24 px-8 overflow-hidden bg-black">
      {/* Background Decorative Element: Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Column: Mission Control (Kept exactly as provided) */}
        <motion.div
          initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }}
          className="lg:col-span-7 flex flex-col justify-center relative z-10"
        >
          <motion.div variants={fader} className="flex items-center gap-3 mb-8">
            <span className="px-2 py-0.5 bg-blue-600/10 border border-blue-500/20 text-blue-500 text-[9px] font-bold tracking-[0.2em] uppercase rounded">
              Mainnet Stable
            </span>
          </motion.div>

          <motion.h1 variants={fader} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase">
            Unified <br /> <span className="text-zinc-500">Asset</span> Layer.
          </motion.h1>

          <motion.p variants={fader} className="text-zinc-500 text-lg max-w-lg mb-12 leading-relaxed">
            The first platform designed to bring together digital assets and NFTs in one place. Trade easily and securely with minimal fees.
          </motion.p>

          <motion.div variants={fader} className="flex flex-wrap gap-4">
            <button
              className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-sm hover:bg-blue-600 hover:text-white transition-all"
              onClick={() => router.push('/create')}
            >
              Get Started
            </button>
            <button
              className="px-8 py-4 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-white/5 transition-all"
              onClick={() => router.push('/portfolio')}
            >
              View Portfolio
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column: 3D NFT Hologram Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="lg:col-span-5 relative flex items-center justify-center perspective-[1000px]"
        >
          {/* Main Floating NFT Card - Full Card NFT Visual */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotateY: [-5, 5, -5],
              rotateX: [5, -5, 5]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-full max-w-[400px] aspect-[4/5] bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20"
          >
            {/* NFT Image fills the card */}
            <img
              src="/tokens/punk.svg"
              alt="NFT Example"
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{ filter: 'brightness(0.95) saturate(1.1)' }}
            />
            {/* Holographic "Glass" Shine */}
            <motion.div
              animate={{ x: [-500, 500] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 z-10"
            />
            {/* Card Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-20">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md bg-black/30">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-zinc-200 tracking-widest uppercase bg-black/60 px-2 py-1 rounded">Punk #5822</span>
              </div>
              <div className="space-y-2">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-200">
                  <span>Floor Price</span>
                  <span className="text-white">1.25 ETH</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Decorative Orbs around the card */}
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-4 w-24 h-24 bg-zinc-500/10 rounded-full blur-3xl"
          />
        </motion.div>

      </div>
    </section>
  );
}