import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { rwardUpdateValidationSchema } from "@/utils/validation/list-rewards"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const idValidationRes = idValidationSchema.safeParse(id)
        if (!idValidationRes.success)
            return NextResponse.json(
                {
                    error: idValidationRes.error.format(),
                },
                { status: 400 }
            )

        const rewardId = idValidationRes.data

        const reward = await prisma.listReward.findUnique({
            where: {
                id: rewardId,
            },
            include: {
                rewards: {
                    include: {
                        user: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        if (!reward)
            return NextResponse.json(
                { error: "Reward not found" },
                { status: 404 }
            )

        const claims = reward.rewards.map(r => ({
            id: r.id,
            userId: r.userId,
            userName: r.user.user.name,
            claimedDate: r.claimedDate.toISOString(),
        }))

        return NextResponse.json({
            reward: {
                id: reward.id,
                title: reward.title,
                pointsRequired: reward.pointsRequired,
                issuedDate: reward.issuedDate.toISOString(),
                rewardType: reward.rewardType,
                totalClaimed: reward.rewards.length,
            },
            claims,
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json(
            { error: "Cannot fetch reward" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await checkAuth()
    const { id } = await params
    try {
        const body = await req.json()
        const validationRes = rwardUpdateValidationSchema.safeParse(body)
        if (!validationRes.success) {
            return NextResponse.json(
                { error: validationRes.error.format() },
                { status: 400 }
            )
        }

        const updateData = validationRes.data

        const updatedReward = await prisma.listReward.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json(updatedReward, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Cannot update reward" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await checkAuth()
    const { id } = await params
    try {
        await prisma.listReward.delete({
            where: { id },
        })
        return NextResponse.json(
            { message: "Reward deleted successfully" },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { message: "Cannot delete reward" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
