// Standard PostgreSQL client for local development
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Use environment DATABASE_URL or fall back to local connection
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:babar@localhost:5432/medisage_db';

export const pool = new Pool({ 
  connectionString: dbUrl
});

export const db = drizzle(pool, { schema });