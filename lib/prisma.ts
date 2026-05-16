import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

const prismaClientSingleton = () => {
  if (connectionString?.startsWith('prisma+postgres://')) {
    // When using Prisma Accelerate, we don't pass the pg adapter
    return new PrismaClient({
      accelerateUrl: connectionString,
    }).$extends(withAccelerate());
  } else {
    // For direct postgres connection, we use the driver adapter
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
