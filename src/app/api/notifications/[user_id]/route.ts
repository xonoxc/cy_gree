import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    { params }: { params: { user_id: string } }
) {
    await checkAuth()
    try {
        const { user_id: userId } = params

        const idValidationRes = idValidationSchema.safeParse(userId)
        if (!idValidationRes.success) {
            return NextResponse.json(
                { error: idValidationRes.error.format() },
                { status: 400 }
            )
        }

        const userNotifications = await prisma.notification.findMany({
            where: {
                toUserId: userId,
            },
        })

        if (!userNotifications) {
            return NextResponse.json(
                {
                    message: "No notifications found",
                },
                { status: 404 }
            )
        }

        return NextResponse.json({}, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        )
    }
}
