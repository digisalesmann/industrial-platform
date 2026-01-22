
import { useEffect, useState } from 'react';
import { collections } from '@/lib/api';

export interface Collection {
    id: string;
    name: string;
    image?: string;
    description?: string;
}

export default function CollectionBrowser({ onSelect, selectedCollection }: { onSelect?: (id: string | null) => void, selectedCollection?: string | null }) {
    const [data, setData] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        collections.getAll()
            .then(setData)
            .catch(e => setError(e.message || 'Failed to load collections'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-zinc-400 py-8">Loading collections...</div>;
    if (error) return <div className="text-red-500 py-8">{error}</div>;

    return (
        <div className="flex flex-wrap gap-2 py-6">
            <button
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 ${!selectedCollection ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-zinc-600 hover:text-white hover:border-blue-500/40'}`}
                style={{ borderRadius: 0 }}
                onClick={() => onSelect?.(null)}
            >
                All Collections
            </button>
            {data.map(col => (
                <button
                    key={col.id}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2 ${selectedCollection === col.id ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-zinc-600 hover:text-white hover:border-blue-500/40'}`}
                    style={{ borderRadius: 0 }}
                    onClick={() => onSelect?.(col.id)}
                >
                    {col.name}
                </button>
            ))}
        </div>
    );
}
