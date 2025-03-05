import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    { params }: { params: { user_id: string } }
) {
    await checkAuth()
    try {
        const { user_id: userId } = params

        const idValidation = idValidationSchema.safeParse(userId)
        if (!idValidation.success)
            return NextResponse.json(
                {
                    error: "Invalid user Id",
                },
                { status: 400 }
            )

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        })

        if (!user)
            return NextResponse.json(
                {
                    error: "User not found!",
                },
                { status: 404 }
            )

        const userBadges = await prisma.badge.findMany({
            where: {
                userId,
            },
            select: {
                name: true,
                issuedDate: true,
            },
        })

        if (!userBadges)
            return NextResponse.json(
                {
                    error: "Something went wrong",
                },
                { status: 500 }
            )

        return NextResponse.json(
            {
                ...userBadges,
            },
            { status: 200 }
        )
    } catch (error) {
        logErrors(error)
        return NextResponse.json(
            { error: "Error while retriving badges" },
            { status: 500 }
        )
    }
}
