// Fetches and caches token logos by symbol for a given token list
const logoCache: Record<string, string | null> = {};

interface CoinSearchResult {
    id: string;
    symbol: string;
    name: string;
    thumb?: string;
    large?: string;
    small?: string;
}

export async function getTokenLogoBySymbol(symbol: string): Promise<string | null> {
    if (logoCache[symbol]) return logoCache[symbol];
    // Use CoinGecko search endpoint for more accurate symbol-to-id mapping
    const searchRes = await fetch(`/api/coingecko/search?query=${symbol}`);
    if (!searchRes.ok) return null;
    const search = await searchRes.json();
    const coin = search.coins.find((c: CoinSearchResult) => c.symbol.toLowerCase() === symbol.toLowerCase());
    if (!coin) return null;
    logoCache[symbol] = coin.thumb || coin.large || coin.small || null;
    return logoCache[symbol];
}
