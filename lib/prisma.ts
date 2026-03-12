import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    // In Prisma 7, if url is missing from schema, it must be provided here.
    // datasourceUrl is the correct property for some configurations, 
    // but let's use the object syntax which is more widely supported if datasourceUrl fails lint.
    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    } as any)
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
