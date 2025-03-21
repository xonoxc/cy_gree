import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
/*
 *
 * this function is used to authenticate the user by session on server side
 *
 */

export async function checkAuth() {
    const session = await getServerSession(authOptions)

    const user = session?.user

    if (!user) {
        return NextResponse.json(
            {
                error: "Unauthorized Request",
            },
            {
                status: 401,
            }
        )
    }

    return user
}
