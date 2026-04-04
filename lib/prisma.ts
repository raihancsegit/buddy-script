import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool) as any;
  return new PrismaClient({ adapter } as any) as PrismaClient;
}

export const prisma: PrismaClient =
  global.prismaGlobal ?? createClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
