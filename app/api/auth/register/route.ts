import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_change_me"
)

export async function POST(req: Request) {
    console.log("Registration request received")
    try {
        const { email, password } = await req.json()
        console.log("Registration for:", email)

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        console.log("Checking if user exists...")
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        console.log("Hashing password...")
        const hashedPassword = await hash(password, 12)

        console.log("Creating user in DB...")
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                status: "trial",
                attemptsRemaining: 3,
            },
        })

        console.log("User created:", user.id)
        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("30d")
            .sign(JWT_SECRET)

        const response = NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    status: user.status,
                    attemptsRemaining: user.attemptsRemaining,
                },
            },
            { status: 201 }
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
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
