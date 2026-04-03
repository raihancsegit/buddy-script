import { Pool } from 'pg';

// Lazy import to avoid issues with Prisma 7 adapter types
let _prisma: any;

function getPrisma() {
  if (_prisma) return _prisma;
  // Dynamically require to work around Prisma 7 type issues
  const { PrismaClient } = require('@prisma/client');
  try {
    const { PrismaPg } = require('@prisma/adapter-pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    _prisma = new PrismaClient({ adapter });
  } catch {
    // Fallback if adapter not available
    _prisma = new PrismaClient();
  }
  return _prisma;
}

export const prisma = getPrisma();
