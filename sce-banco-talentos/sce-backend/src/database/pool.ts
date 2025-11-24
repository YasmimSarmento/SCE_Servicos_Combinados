// pool.ts
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Tipagem explícita opcional
export type PoolType = typeof pool;
