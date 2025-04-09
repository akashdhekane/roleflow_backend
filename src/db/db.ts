import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add other config if needed
});

export const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL DB');
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
};
