import { PrismaClient } from '@prisma/client';

// Singleton: módulos ES ficam em cache, então todo import recebe esta mesma instância.
export const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});