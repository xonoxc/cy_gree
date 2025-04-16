import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { multipleIdValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    _: NextRequest,
    props: { params: Promise<{ user_id: string; reward_id: string }> }
) {
    const [__, params] = await Promise.all([checkAuth(), props.params])
    try {
        const { user_id: userId, reward_id: rewardId } = params

        const idsValidationRes = multipleIdValidationSchema.safeParse([
            userId,
            rewardId,
        ])
        if (!idsValidationRes.success) {
            return NextResponse.json(
                {
                    error: idsValidationRes.error.format(),
                },
                { status: 400 }
            )
        }

        const userProfile = await prisma.userProfile.findFirst({
            where: {
                userId,
            },
        })

        if (!userProfile) {
            return NextResponse.json(
                { error: "profile not found" },
                { status: 404 }
            )
        }

        const targetReward = await prisma.reward.findFirst({
            where: {
                rewardId,
            },
            select: {
                reward: {
                    select: {
                        pointsRequired: true,
                    },
                },
            },
        })

        const pointsRequired = targetReward?.reward.pointsRequired

        if (!pointsRequired) {
            return NextResponse.json(
                { error: "Error retriving required points for reward" },
                { status: 500 }
            )
        }

        if (!(userProfile.earnedPoints >= pointsRequired)) {
            return NextResponse.json(
                {
                    error: "Not enough points to claim this reward",
                },
                { status: 400 }
            )
        }

        const existingReward = await prisma.reward.findFirst({
            where: {
                AND: [{ userId }, { rewardId }],
            },
        })

        if (existingReward) {
            return NextResponse.json(
                { error: "Reward already claimed!" },
                { status: 400 }
            )
        }

        const createdReward = await prisma.reward.create({
            data: {
                rewardId,
                userId,
            },
        })

        if (!createdReward) {
            return NextResponse.json(
                { error: "Cannot create reward" },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: "Reward claimed successfully" },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "error creating reward" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
