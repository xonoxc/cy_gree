import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    _: NextRequest,
    props: { params: Promise<{ user_id: string }> }
) {
    const params = await props.params
    await checkAuth()
    try {
        const { user_id: userId } = params

        const idValidationRes = idValidationSchema.safeParse(userId)
        if (!idValidationRes.success) {
            return NextResponse.json(
                {
                    message: idValidationRes.error.format(),
                },
                { status: 400 }
            )
        }

        const allUserNotifications = await prisma.notification.updateMany({
            where: {
                AND: [{ userId: userId }, { isRead: false }],
            },
            data: {
                isRead: true,
            },
        })

        if (allUserNotifications) {
            return NextResponse.json(
                { error: "cannot read notifications!" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "All notifications read successfully" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            {
                error: "Something went wrong!",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
