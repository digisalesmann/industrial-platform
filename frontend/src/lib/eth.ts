// Fetches the current ETH price in USD from CoinGecko
export async function fetchEthPrice(): Promise<number | null> {
    try {
        const res = await fetch('/api/coingecko?ids=ethereum&vs_currencies=usd');
        const data = await res.json();
        if (data && data.ethereum && data.ethereum.usd) {
            return data.ethereum.usd;
        }
    } catch (e) {
        return null;
    }
    return null;
}
