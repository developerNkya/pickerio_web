import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_change_me"
)

async function getUserId() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload.userId as string
    } catch {
        return null
    }
}

export async function GET() {
    const userId = await getUserId()
    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
        const palettes = await prisma.palette.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json({ palettes })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch palettes" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const userId = await getUserId()
    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
        const { colors, name, projectId } = await req.json()

        const palette = await prisma.palette.create({
            data: {
                colors,
                name,
                userId,
                projectId,
            },
        })

        return NextResponse.json({ palette }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to save palette" }, { status: 500 })
    }
}
