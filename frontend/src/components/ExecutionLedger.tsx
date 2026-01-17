'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function FinalSection() {
    return (
        <section className="relative bg-[#050505] pt-24 pb-12 overflow-hidden">
            {/* Structural Accents - Industrial vertical lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-zinc-800 to-transparent" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* The Final CTA Box */}
                <div className="relative border border-zinc-800 bg-zinc-900/10 rounded-[2.5rem] p-8 md:p-20 overflow-hidden group">

                    {/* Subtle Industrial Background Glow */}
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full group-hover:bg-blue-600/10 transition-colors duration-1000" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-black mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Platform Ready</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1] text-white">
                                Ready to get started? <br />
                                <span className="text-zinc-500 italic font-light tracking-tighter">Grow your assets today.</span>
                            </h2>

                            <p className="mt-6 text-zinc-400 text-lg max-w-md leading-relaxed">
                                Join our platform for secure, easy, and fast digital asset management.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                            <button className="group relative px-10 py-5 bg-white text-black font-bold text-sm overflow-hidden transition-all hover:pr-12">
                                <span className="relative z-10">Get Started</span>
                                <ArrowUpRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
                            </button>
                            <button className="px-10 py-5 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-900 transition-all">
                                Learn More
                            </button>
                        </div>

                    </div>

                    {/* Bottom Connectivity Bar */}
                    <div className="mt-20 pt-8 border-t border-zinc-800/50 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-zinc-600 uppercase text-[9px] font-black tracking-widest">
                                <Cpu size={12} /> System Load
                            </div>
                            <p className="text-sm font-mono text-zinc-400">0.042% — Stable</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-zinc-600 uppercase text-[9px] font-black tracking-widest">
                                <ShieldCheck size={12} /> Security Check
                            </div>
                            <p className="text-sm font-mono text-zinc-400">Passed</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-zinc-600 uppercase text-[9px] font-black tracking-widest">
                                <Zap size={12} /> Efficiency
                            </div>
                            <p className="text-sm font-mono text-zinc-400">98.4% Efficient</p>
                        </div>
                        <div className="text-right flex items-end justify-end">
                            <span className="text-[10px] text-zinc-700 font-mono tracking-tighter">Ping: 12ms</span>
                        </div>
                    </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                    <p className="text-[10px] text-zinc-600 font-medium tracking-widest uppercase">
                        © 2026 Industrial Platform. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                        <a href="#" className="hover:text-white transition-colors">Docs</a>
                    </div>
                </div>

            </div>
        </section>
    );
}