
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import pool from '../lib/db';

const router = Router();

// Update asset listing status and price (protected)
router.patch('/:id/list', authenticateToken, async (req, res) => {
    const userId = (req as any).user?.id;
    const assetId = req.params.id;
    const { price } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Only allow owner to list their asset
    const { rowCount } = await pool.query('UPDATE assets SET listed = TRUE, price = $1 WHERE id = $2 AND owner_id = $3', [price, assetId, userId]);
    if (rowCount === 0) {
        return res.status(403).json({ message: 'Not allowed or asset not found' });
    }
    res.json({ message: 'Asset listed', id: assetId, price });
});

// Get all assets (public - for gallery)
router.get('/', async (_req, res) => {
    const result = await pool.query('SELECT * FROM assets ORDER BY created_at DESC');
    res.json(result.rows);
});

// Get featured/gallery assets (public)
router.get('/gallery', async (req, res) => {
    const { type, rarity, search, limit = 50, collection_id } = req.query;

    let query = 'SELECT * FROM assets WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (type && type !== 'All') {
        query += ` AND type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
    }

    if (rarity) {
        const rarities = (rarity as string).split(',');
        query += ` AND rarity = ANY($${paramIndex})`;
        params.push(rarities);
        paramIndex++;
    }

    if (collection_id) {
        query += ` AND collection_id = $${paramIndex}`;
        params.push(collection_id);
        paramIndex++;
    }

    if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR id::text ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
});

// Add asset (protected)
router.post('/', authenticateToken, async (req, res) => {
    const { name, type, value, rarity, image } = req.body;
    const ownerId = (req as any).user?.id || null;
    await pool.query(
        'INSERT INTO assets (name, type, value, rarity, image, owner_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, type, value, rarity, image, ownerId]
    );
    res.status(201).json({ message: 'Asset added' });
});


// Get assets owned by the authenticated user (portfolio)
router.get('/mine', authenticateToken, async (req, res) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await pool.query('SELECT * FROM assets WHERE owner_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
});

export default router;
