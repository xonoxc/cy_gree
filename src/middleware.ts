import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

const publicRoutes = ["/", "/sign-in", "/sign-up"]
const privateRoutes = ["/usr/dashboard", "/agent/dashboard", "/admin/dashboard"]
const rolePrefixes = {
    Client: "usr",
    Agent: "agent",
    Admin: "admin",
}

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_AUTH_SECRET,
    })

    const role = token?.role as "Admin" | "Client" | "Agent"
    const pathName = request.nextUrl.pathname

    if (token && publicRoutes.includes(pathName)) {
        return NextResponse.redirect(
            new URL(`/${rolePrefixes[role]}/dashboard`, request.url)
        )
    }

    if (!token && privateRoutes.includes(pathName)) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    if (token && privateRoutes.includes(pathName)) {
        if (!pathName.startsWith(`/${rolePrefixes[role]}`))
            return NextResponse.redirect(
                new URL(`/${rolePrefixes[role]}/dashboard`, request.url)
            )
    }

    return NextResponse.next()
}

export const matcher = [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
]
