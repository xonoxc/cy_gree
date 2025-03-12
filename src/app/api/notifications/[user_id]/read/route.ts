import prisma from "@/config/prisma/prisma.client"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    _: NextRequest,
    props: { params: Promise<{ notification_id: string }> }
) {
    const params = await props.params
    try {
        const { notification_id: notificationId } = params

        const idValidationResult = idValidationSchema.safeParse(notificationId)
        if (!idValidationResult.success) {
            return NextResponse.json(
                {
                    error: idValidationResult.error.format(),
                },
                { status: 400 }
            )
        }

        const updatedNotification = await prisma.notification.update({
            where: {
                id: notificationId,
            },
            data: {
                isRead: true,
            },
        })

        if (!updatedNotification) {
            return NextResponse.json(
                { message: "Notification not found!" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "notification read successfully!" },
            { status: 200 }
        )
    } catch (e) {
        return NextResponse.json(
            {
                response: "Cannot reacd notifications!",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
