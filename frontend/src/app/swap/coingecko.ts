// Utility to fetch token list and logos from CoinGecko
// Usage: getTokenList().then(tokens => ...)

interface CoinListItem {
    id: string;
    symbol: string;
    name: string;
}

export async function getTokenList(): Promise<CoinListItem[]> {
    const res = await fetch('/api/coingecko/coins/list?include_platform=true');
    if (!res.ok) throw new Error('Failed to fetch token list');
    return res.json();
}

export async function getTokenLogo(symbol: string): Promise<string | null> {
    // CoinGecko API does not provide direct logo by symbol, so we fetch coin info by id
    // You may want to cache ids for symbols in production
    const listRes = await fetch('/api/coingecko/coins/list');
    const list: CoinListItem[] = await listRes.json();
    const coin = list.find((c: CoinListItem) => c.symbol.toLowerCase() === symbol.toLowerCase());
    if (!coin) return null;
    const infoRes = await fetch(`/api/coingecko/coins/${coin.id}`);
    if (!infoRes.ok) return null;
    const info = await infoRes.json();
    return info.image?.thumb || info.image?.small || info.image?.large || null;
}
