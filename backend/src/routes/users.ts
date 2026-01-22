import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../lib/db';

const router = Router();

// Get user profile (protected)

// Get user profile (protected)
router.get('/me', authenticateToken, async (req, res) => {
    const userId = (req as any).user.id;
    const result = await pool.query(
        'SELECT id, wallet_address, display_name, username, bio FROM users WHERE id = $1',
        [userId]
    );
    res.json(result.rows[0]);
});

// Update user profile (protected)
router.patch('/me', authenticateToken, async (req, res) => {
    const userId = (req as any).user.id;
    const { display_name, username, bio } = req.body;

    // Basic validation
    if (username && typeof username !== 'string') {
        return res.status(400).json({ message: 'Invalid username' });
    }
    if (display_name && typeof display_name !== 'string') {
        return res.status(400).json({ message: 'Invalid display name' });
    }
    if (bio && typeof bio !== 'string') {
        return res.status(400).json({ message: 'Invalid bio' });
    }

    // Check for unique username if updating
    if (username) {
        const check = await pool.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, userId]);
        if ((check.rowCount ?? 0) > 0) {
            return res.status(409).json({ message: 'Username already taken' });
        }
    }

    // Build update query dynamically
    const fields = [];
    const values = [];
    let idx = 1;
    if (display_name !== undefined) {
        fields.push(`display_name = $${idx++}`);
        values.push(display_name);
    }
    if (username !== undefined) {
        fields.push(`username = $${idx++}`);
        values.push(username);
    }
    if (bio !== undefined) {
        fields.push(`bio = $${idx++}`);
        values.push(bio);
    }
    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
    }
    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, wallet_address, display_name, username, bio`;
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
});

export default router;
