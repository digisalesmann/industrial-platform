import express from 'express';

const router = express.Router();

// Proxy route for CoinGecko API
router.get('/coingecko', async (req, res) => {
    try {
        const { ids, vs_currencies, include_24hr_change } = req.query;
        const params = new URLSearchParams({
            ids: ids as string,
            vs_currencies: vs_currencies as string,
            include_24hr_change: include_24hr_change as string,
        });
        const url = `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`;
        const response = await global.fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to fetch from CoinGecko' });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
