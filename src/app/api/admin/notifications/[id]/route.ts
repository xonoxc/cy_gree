import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await checkAuth()

    const { id: notificationId } = await params
    const idValidationRes = idValidationSchema.safeParse(notificationId)
    if (!idValidationRes.success) {
        return NextResponse.json(
            {
                error: "Invalid notificationId",
            },
            { status: 400 }
        )
    }

    try {
        const existingNotification = await prisma.notification.findUnique({
            where: { id: notificationId },
        })
        if (!existingNotification) {
            return NextResponse.json(
                {
                    error: "Notification not found",
                },
                { status: 404 }
            )
        }

        await prisma.notification.delete({
            where: { id: notificationId },
        })

        return NextResponse.json(
            { message: "Notification deleted successfully" },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong while deleting notification" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
