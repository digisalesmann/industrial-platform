import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import pool from '../lib/db';

const router = Router();

// Get nonce for wallet authentication
router.get('/nonce/:address', async (req, res) => {
    const { address } = req.params;
    const normalizedAddress = address.toLowerCase();

    // Generate a random nonce
    const nonce = Math.floor(Math.random() * 1000000).toString();

    // Check if user exists, create if not
    const existing = await pool.query('SELECT * FROM users WHERE wallet_address = $1', [normalizedAddress]);
    if (existing.rows.length === 0) {
        await pool.query('INSERT INTO users (wallet_address, nonce) VALUES ($1, $2)', [normalizedAddress, nonce]);
    } else {
        await pool.query('UPDATE users SET nonce = $1 WHERE wallet_address = $2', [nonce, normalizedAddress]);
    }

    res.json({ nonce, message: `Sign this message to authenticate: ${nonce}` });
});

// Verify wallet signature and issue JWT
router.post('/verify', async (req, res) => {
    const { address, signature } = req.body;
    if (!address || !signature) {
        return res.status(400).json({ message: 'Address and signature required' });
    }

    const normalizedAddress = address.toLowerCase();

    // Get user and nonce
    const result = await pool.query('SELECT * FROM users WHERE wallet_address = $1', [normalizedAddress]);
    const user = result.rows[0];
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // Verify signature
    const message = `Sign this message to authenticate: ${user.nonce}`;
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== normalizedAddress) {
            return res.status(401).json({ message: 'Invalid signature' });
        }
    } catch {
        return res.status(401).json({ message: 'Invalid signature' });
    }

    // Generate new nonce for next login
    const newNonce = Math.floor(Math.random() * 1000000).toString();
    await pool.query('UPDATE users SET nonce = $1 WHERE wallet_address = $2', [newNonce, normalizedAddress]);

    // Issue JWT
    const token = jwt.sign(
        { id: user.id, walletAddress: user.wallet_address },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, walletAddress: user.wallet_address } });
});

export default router;
