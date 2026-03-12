import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    const response = NextResponse.json({ message: "Logout successful" })

    response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    })

    return response
}
