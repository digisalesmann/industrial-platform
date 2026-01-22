'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NFTCard({ id, name, price, image, description, collection_id, owner, rarity, type, onBuy }: any) {
  // Fallback image for broken/missing images
  const fallbackImg = '/tokens/fallback.png';
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="group bg-zinc-950 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col h-full"
    >
      <div className="aspect-square bg-zinc-900 relative overflow-hidden shrink-0 border-b border-white/5 flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            className="object-cover w-full h-full"
            onError={() => setImgSrc(fallbackImg)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800 text-5xl font-black group-hover:scale-105 transition-transform duration-700">
            #{id?.toString().split('-').pop() || id}
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-black/80 border border-white/10 text-[7px] font-black text-blue-400 uppercase tracking-[0.2em]">
          {type || collection_id || 'NFT'}
        </div>
        <button
          className="absolute bottom-0 left-0 right-0 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          onClick={onBuy}
        >
          Buy Now
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-white truncate mb-1">{name}</p>
            {rarity && <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{rarity}</p>}
            {description && <p className="text-[9px] text-zinc-500 mt-1 line-clamp-2">{description}</p>}
          </div>
          <p className="text-[11px] font-mono font-bold text-emerald-500 shrink-0 ml-2">{price || '--'}</p>
        </div>
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-[8px] text-zinc-700 font-mono uppercase">{owner ? `Owner: ${owner.slice(0, 6)}...` : 'Verified'}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}