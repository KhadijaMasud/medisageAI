import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

// This is the correct way neon config - DO NOT change this
neonConfig.webSocketConstructor = ws;

// Use environment DATABASE_URL or fall back to local connection
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:babar@localhost:5432/medisage';

export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle({ client: pool, schema });