import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"

const publicRoutes = ["/", "/sign-in", "/sign-up"]
const privateRoutes = ["/usr/dashboard", "/usr/dashboard", "/api/ai/chat"]

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXT_AUTH_SECRET,
    })

    const role = token?.role
    const pathName = request.nextUrl.pathname

    if (token && role && publicRoutes.includes(pathName)) {
        return NextResponse.redirect(
            `/${role === "Client" ? "usr" : "agent"}/dashboard`
        )
    }

    if (!token && privateRoutes.includes(pathName)) {
        return NextResponse.redirect("/sign-in")
    }
}

export const matcher = [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
]
