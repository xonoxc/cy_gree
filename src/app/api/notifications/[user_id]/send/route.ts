import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const searchParamsSchema = z.object({
    message: z.string(),
    importance_level: z.enum(["Low", "Medium", "High"]),
})

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ user_id: string }> }
) {
    const currentUser = (await checkAuth()) as {
        id: string
        role: string
    }

    const params = await props.params

    try {
        const { user_id: userId } = params

        const paramsValidationResult = searchParamsSchema.safeParse(
            Object.entries(request.nextUrl.searchParams)
        )
        if (!paramsValidationResult.success) {
            return NextResponse.json(
                {
                    error: paramsValidationResult.error.format(),
                },
                { status: 400 }
            )
        }

        const { message, importance_level } = paramsValidationResult.data

        const idValidationRes = idValidationSchema.safeParse(userId)
        if (!idValidationRes.success) {
            return NextResponse.json(
                {
                    error: idValidationRes.error.format(),
                },
                { status: 400 }
            )
        }

        const createdNotification = await prisma.notification.create({
            data: {
                userId: currentUser.id,
                toUserId: userId,
                message,
                importanceLevel: importance_level,
            },
        })

        if (!createdNotification) {
            return NextResponse.json(
                { error: "Error while creating notification" },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                message: "Notification sent successfully",
            },
            { status: 200 }
        )
    } catch (e) {
        return NextResponse.json(
            { error: "Error while sending notifications" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
