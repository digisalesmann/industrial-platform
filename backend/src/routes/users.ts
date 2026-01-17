import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../lib/db';

const router = Router();

// Get user profile (protected)
router.get('/me', authenticateToken, async (req, res) => {
    const userId = (req as any).user.id;
    const result = await pool.query('SELECT id, wallet_address FROM users WHERE id = $1', [userId]);
    res.json(result.rows[0]);
});

export default router;
