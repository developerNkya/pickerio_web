// lib/prisma.ts - Simplified for Prisma 5
import { PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

function createPrismaClient() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not set in environment variables')
        }

        return new PrismaClient({
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
        })
    } catch (error) {
        console.error('Failed to create PrismaClient:', error)
        throw error
    }
}

export const prisma = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma
}

export default prisma