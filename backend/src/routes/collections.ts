import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

// Get all collections (public)
router.get('/', async (_req, res) => {
    const result = await pool.query('SELECT * FROM public.collections ORDER BY name ASC');
    res.json(result.rows);
});

export default router;
