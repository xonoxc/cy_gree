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

        const idValidation = idValidationSchema.safeParse(userId)
        if (!idValidation.success) {
            return NextResponse.json(
                { error: idValidation.error.format() },
                { status: 400 }
            )
        }

        const claimedRewards = await prisma.reward.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                claimedDate: true,
                reward: {
                    select: {
                        title: true,
                    },
                },
            },
        })

        if (!claimedRewards) {
            return NextResponse.json(
                { error: "Error retrieving claimed rewards" },
                { status: 500 }
            )
        }

        return NextResponse.json({ claimedRewards }, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
