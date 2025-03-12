import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextResponse } from "next/server"

export async function GET() {
    console.log("so we got stats requests")
    await checkAuth()
    try {
        const userCountPromise = prisma.user.count()
        const totalCollectedPromise = prisma.plasticCollection.aggregate({
            _count: true,
            where: {
                status: "Collected",
            },
        })
        const totalBadgesAwarded = prisma.badge.count()
        const totalClaimedRewards = prisma.reward.count()

        const [userCount, totalPlasticCollected, totalBadges, totalRewards] =
            await Promise.all([
                userCountPromise,
                totalCollectedPromise,
                totalBadgesAwarded,
                totalClaimedRewards,
            ])

        return NextResponse.json(
            {
                userCount,
                totalPlasticCollected: totalPlasticCollected._count,
                totalBadges,
                totalRewards,
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
