import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_change_me"
)

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                palettes: {
                    orderBy: { createdAt: 'desc' }
                },
                projects: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!user || !(await compare(password, user.password))) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("30d")
            .sign(JWT_SECRET)

        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    accountStatus: user.accountStatus,
                    attemptsRemaining: user.attemptsRemaining,
                    palettes: user.palettes,
                    projects: user.projects,
                },
            },
            { status: 200 }
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        })

        return response
    } catch (error: any) {
        console.error("Login error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
