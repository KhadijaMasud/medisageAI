// For local development, use standard pg package
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";

// Use local connection string
const dbUrl = 'postgresql://postgres:babar@localhost:5432/medisage_db';
console.log('Using database connection string:', dbUrl);

// Create connection pool
export const pool = new Pool({ 
  connectionString: dbUrl 
});

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });