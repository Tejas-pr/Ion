import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from "../generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Create the Pool specifically for the adapter
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
});

// 2. Pass the pool to the adapter
// Cast needed due to dual @types/pg resolution between root and @prisma/adapter-pg
const adapter = new PrismaPg(pool as any);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Optional: Log queries to see if connection works
    // log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "../generated/client";
