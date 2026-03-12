// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
    // Avoid creating multiple instances in dev mode
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

// Use the existing instance if in dev mode
const prisma = globalThis.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma

export default prisma