import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_change_me"
)

export async function GET() {
    console.log("Auth me request received")
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            console.log("No token found in cookies")
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        console.log("Verifying token...")
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const userId = payload.userId as string
        console.log("Token verified for user:", userId)

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                palettes: {
                    orderBy: { createdAt: 'desc' }
                },
                projects: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                status: user.status,
                attemptsRemaining: user.attemptsRemaining,
                palettes: user.palettes,
                projects: user.projects,
            }
        })
    } catch (error: any) {
        console.error("Auth me error:", error)
        return NextResponse.json({ error: error.message || "Not authenticated" }, { status: 401 })
    }
}
