// Fetches live Ethereum gas price from the Blocknative API (or fallback to ethgasstation)
export async function fetchGasPrice(): Promise<number | null> {
    try {
        // Blocknative API (free, no key required for basic info)
        const res = await fetch('https://api.blocknative.com/gasprices/blockprices');
        const data = await res.json();
        if (data && data.blockPrices && data.blockPrices[0] && data.blockPrices[0].estimatedPrices[0]) {
            // Return the "maxFeePerGas" in Gwei
            return data.blockPrices[0].estimatedPrices[0].maxFeePerGas;
        }
    } catch (e) {
        // fallback to ethgasstation (legacy, may be less reliable)
        try {
            const res = await fetch('https://ethgasstation.info/api/ethgasAPI.json');
            const data = await res.json();
            if (data && data.fast) {
                // ethgasstation returns gas price in 10x Gwei
                return data.fast / 10;
            }
        } catch (e2) {
            return null;
        }
    }
    return null;
}
