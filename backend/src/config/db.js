import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config()
export const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
})

export async function connectPostgrest() {
    try {
        await pool.query('SELECT 1');

        console.log('Conecxion establecida con exito');
    } catch (error) {
        console.error('Error al conectarse a la base de datos', error);
    }
}