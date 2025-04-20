import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
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
                    error: idValidationRes.error.format(),
                },
                { status: 400 }
            )
        }

        const userProfile = await prisma.userProfile.findUnique({
            where: {
                userId: userId,
            },
            select: {
                earnedPoints: true,
                id: true,
            },
        })

        if (!userProfile) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const claimedRewards = await prisma.reward.findMany({
            where: {
                userId: userProfile.id,
            },
            select: {
                rewardId: true,
            },
        })

        if (!claimedRewards) {
            return NextResponse.json(
                { error: "Error retriving rewards" },
                { status: 404 }
            )
        }

        const claimedRewardsIds = claimedRewards.map(reward => reward.rewardId)

        const claimableRewards = await prisma.listReward.findMany({
            where: {
                pointsRequired: { lte: userProfile.earnedPoints },
                id: { notIn: claimedRewardsIds },
            },
            select: {
                id: true,
                title: true,
                pointsRequired: true,
            },
        })

        if (!claimableRewards) {
            return NextResponse.json(
                { error: "Error retriving available rewards" },
                { status: 404 }
            )
        }

        return NextResponse.json([...claimableRewards], { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            {
                error: "Something weant wrong",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
