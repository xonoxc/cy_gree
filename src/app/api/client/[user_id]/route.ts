import prisma from "@/config/prisma/prisma.client"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ user_id: string }> }
) {
    try {
        const { user_id: userId } = await params

        const idValidationRes = idValidationSchema.safeParse(userId)
        if (!idValidationRes.success)
            return NextResponse.json(
                {
                    error: "Invalid id",
                },
                { status: 400 }
            )

        const profile = await prisma.userProfile.findFirst({
            where: {
                userId,
            },
        })

        if (!profile)
            return NextResponse.json(
                {
                    error: "User not found!",
                },
                { status: 404 }
            )

        return NextResponse.json(
            {
                total_points: profile.earnedPoints,
                plastic_collected: profile.totalPlasticRecycled,
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
