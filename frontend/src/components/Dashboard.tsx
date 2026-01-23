'use client';

import { useEffect, useState } from 'react';
import NFTCard from '@/components/NFTCard';

export default function Dashboard() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllNFTs() {
      setLoading(true);
      setError(null);
      try {
        // Fetch your own NFTs from backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const backendRes = await fetch(`${apiUrl}/api/collections`);
        const backendData = await backendRes.json();
        const backendNFTs = (backendData || []).map((nft: any) => ({
          ...nft,
          source: 'platform',
          id: nft.id,
          name: nft.name,
          image: nft.image_url,
          description: nft.description,
          price: nft.price || null,
          collection_id: nft.slug,
          owner: nft.owner || null,
        }));

        // OpenSea slugs for top collections
        const slugs = [
          'azuki',
          'boredapeyachtclub',
          'clonex',
          'cryptopunks',
          'doodles-official'
        ];
        const apiKey = '94fc911d63da4ddbb273734ec8c414d1';
        const openseaNFTs: any[] = [];
        for (const slug of slugs) {
          try {
            const res = await fetch(`https://api.opensea.io/api/v2/collections/${slug}`, {
              headers: {
                'X-API-KEY': apiKey
              }
            });
            if (!res.ok) continue;
            const data = await res.json();
            const col = data.collection;
            if (col && col.slug) {
              let imageUrl = col.image_url;
              // Use fallback for CryptoPunks if image is missing or broken
              if (col.slug === 'cryptopunks' && (!imageUrl || imageUrl.includes('larvalabs.com'))) {
                imageUrl = '/tokens/punk.svg';
              }
              openseaNFTs.push({
                source: 'opensea',
                id: col.slug,
                name: col.name,
                image: imageUrl,
                description: col.description,
                price: col.stats?.floor_price || null,
                collection_id: col.slug,
                owner: null,
              });
            }
          } catch (err) {
            // Ignore individual fetch errors
          }
        }

        // Combine both
        setNfts([...backendNFTs, ...openseaNFTs]);
      } catch (e) {
        setError('Failed to load NFTs.');
      } finally {
        setLoading(false);
      }
    }
    fetchAllNFTs();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505]">
      {/* Layer 1: The Industrial Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none 
        bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] 
        bg-[size:4rem_4rem]"
      />

      {/* Layer 2: The Core Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[800px] h-[800px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"
      />

      {/* Layer 3: Noise/Grain Texture (Optional for that \"Industrial\" feel) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none 
        bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
      />

      {/* Content goes here */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-white text-[10px] font-bold uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
              Top NFT Collections
            </h2>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-white">NFT Leaderboard</h1>
            <p className="text-zinc-400 text-xs mt-2">Live ranking of the most popular NFT collections right now.</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-center py-8">{error}</div>}
        {loading && <div className="text-zinc-400 text-center py-8">Loading collections...</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {nfts.map((nft: any) => (
              <div key={`${nft.source}-${nft.id}`} className="relative">
                <NFTCard
                  id={nft.id}
                  name={nft.name}
                  price={nft.price}
                  image={nft.image}
                  description={nft.description}
                  collection_id={nft.collection_id}
                  owner={nft.owner}
                />
                <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] rounded bg-${nft.source === 'platform' ? 'blue' : 'gray'}-700 text-white font-bold`}>{nft.source === 'platform' ? 'Platform' : 'OpenSea'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}