import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"

const privateRoutes = ["/usr", "/agent", "/admin"]
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

    const pathName = request.nextUrl.pathname

    const isPrivateRoute = privateRoutes.some(route =>
        pathName.startsWith(route)
    )

    if (!token && isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    if (token) {
        const role = token.role
        const dashboardPath = `/${rolePrefixes[role]}/dashboard`

        if (!pathName.startsWith(dashboardPath) && isPrivateRoute) {
            return NextResponse.redirect(new URL(dashboardPath, request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
}
