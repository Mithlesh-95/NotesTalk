import { PrismaClient } from '../../generated/prisma';

// Create a global instance of Prisma Client to avoid too many connections in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 