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
        const projects = await prisma.project.findMany({
            where: { userId },
            include: { palettes: true },
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json({ projects })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const userId = await getUserId()
    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
        const { name } = await req.json()

        const project = await prisma.project.create({
            data: {
                name,
                userId,
            },
            include: { palettes: true }
        })

        return NextResponse.json({ project }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}
