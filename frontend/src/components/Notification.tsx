'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function Notification({ message, type }: { message: string, type: 'success' | 'error' }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-lg border backdrop-blur-xl shadow-2xl flex items-center gap-4 ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
                    }`}
            >
                <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">System_Message</span>
                    <span className="text-xs font-mono font-bold text-white tracking-tighter">{message}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}