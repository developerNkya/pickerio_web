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

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const userId = await getUserId()
    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
        const { id } = params

        const palette = await prisma.palette.findUnique({
            where: { id },
        })

        if (!palette || palette.userId !== userId) {
            return NextResponse.json({ error: "Palette not found" }, { status: 404 })
        }

        await prisma.palette.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Palette deleted successfully" })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
