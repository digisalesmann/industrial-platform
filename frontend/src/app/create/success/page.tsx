'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface AssetData {
    name: string;
    ticker: string;
    hash: string;
    timestamp: string;
    rarity: string;
    sector: string;
    engine: string;
    image?: string;
}

// Explorer URL - update based on your chain
const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://etherscan.io';

export default function ForgeSuccess() {
    const [assetData, setAssetData] = useState<AssetData>({
        name: '', ticker: '', hash: '', timestamp: '', rarity: '', sector: '', engine: ''
    });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('lastAsset');
        if (stored) {
            setAssetData(JSON.parse(stored));
        }
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isValidTxHash = assetData.hash && assetData.hash.startsWith('0x') && assetData.hash.length === 66;
    const explorerLink = isValidTxHash ? `${EXPLORER_URL}/tx/${assetData.hash}` : null;

    return (
        <main className="min-h-screen bg-black text-white pt-24 lg:pt-32 pb-20 overflow-hidden">
            <Navbar currentView="terminal" onProfileClick={() => { }} onViewChange={() => { }} />

            <div className="max-w-[800px] mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative border border-blue-500/30 bg-zinc-950 p-1 group"
                >
                    {/* Decorative Corner Brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500" />

                    <div className="border border-white/10 p-8 md:p-12 space-y-10">
                        {/* Success Animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="flex justify-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center">
                                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Header Section */}
                        <div className="flex justify-between items-start border-b border-white/10 pb-8">
                            <div>
                                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2">Certificate</h2>
                                <h1 className="text-4xl font-black uppercase tracking-tighter italic-none">Asset Details</h1>
                            </div>
                            <div className="text-right">
                                <div className="w-16 h-16 border-2 border-blue-500 flex items-center justify-center font-black text-2xl text-blue-500">
                                    V1
                                </div>
                            </div>
                        </div>

                        {/* Certificate Body */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono">
                            <div className="space-y-6">
                                <section>
                                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Asset Identity</p>
                                    <p className="text-xl font-black text-white">{assetData.name} ({assetData.ticker})</p>
                                </section>
                                <section>
                                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Transaction Hash</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[11px] text-blue-400 break-all flex-1">
                                            {assetData.hash || 'Pending...'}
                                        </p>
                                        {assetData.hash && (
                                            <button
                                                onClick={() => copyToClipboard(assetData.hash)}
                                                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 transition-all shrink-0"
                                                title="Copy hash"
                                            >
                                                {copied ? (
                                                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {explorerLink && (
                                        <a
                                            href={explorerLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 mt-2 text-[9px] text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                                        >
                                            View on Explorer
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    )}
                                </section>
                                <section>
                                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Created At</p>
                                    <p className="text-[11px] text-zinc-300">{assetData.timestamp} UTC</p>
                                </section>
                            </div>

                            <div className="space-y-4 bg-white/5 p-6 border border-white/5">
                                {assetData.image && (
                                    <div className="mb-4 -m-6 -mt-6">
                                        <img
                                            src={assetData.image}
                                            alt={assetData.name}
                                            className="w-full h-40 object-cover"
                                        />
                                    </div>
                                )}
                                <p className="text-[10px] font-black text-zinc-400 uppercase border-b border-white/10 pb-2 mb-4">Asset Properties</p>
                                {Object.entries({ Rarity: assetData.rarity, Sector: assetData.sector, Engine: assetData.engine }).map(([k, v]) => (
                                    <div key={k} className="flex justify-between text-[10px]">
                                        <span className="text-zinc-600 uppercase">{k.replace(/_/g, ' ')}:</span>
                                        <span className="text-white font-black uppercase">{typeof v === 'string' ? v.replace(/_/g, ' ') : v}</span>
                                    </div>
                                ))}
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <p className="text-[8px] text-zinc-500 leading-relaxed uppercase">
                                        This document proves your asset was created and registered. Please keep this for your records.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row gap-px bg-white/10 border border-white/10">
                            <Link href="/gallery" className="flex-1 py-4 bg-black hover:bg-zinc-900 text-center text-[10px] font-black uppercase tracking-widest transition-all">
                                View in Gallery
                            </Link>
                            <Link href="/create" className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-center text-[10px] font-black uppercase tracking-widest transition-all">
                                Create Another Asset
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 flex justify-center">
                    <button onClick={() => window.print()} className="text-[9px] text-zinc-600 uppercase font-bold hover:text-white transition-colors flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Download Certificate
                    </button>
                </div>
            </div>
        </main>
    );
}