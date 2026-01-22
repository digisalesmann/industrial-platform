import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
    await pool.connect();
    console.log('Connected to PostgreSQL');
    // Log current database and schema for debugging
    try {
        const dbRes = await pool.query('SELECT current_database(), current_schema();');
        console.log('DB Info:', dbRes.rows[0]);
    } catch (err) {
        console.error('Failed to fetch DB info:', err);
    }
};

export default pool;
