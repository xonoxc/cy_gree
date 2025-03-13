import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    await checkAuth()

    const { userId } = await params

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        })

        if (!user || !user.profile) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        const { id: profileId } = user.profile

        const plasticCollections = await prisma.plasticCollection.findMany({
            where: { userId: profileId },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, createdAt: true },
        })

        const rewards = await prisma.reward.findMany({
            where: { userId: profileId },
            orderBy: { claimedDate: "desc" },
            take: 5,
            select: { id: true, claimedDate: true },
        })

        const badges = await prisma.badge.findMany({
            where: { userId: profileId },
            orderBy: { issuedDate: "desc" },
            take: 5,
            select: { id: true, issuedDate: true, name: true },
        })

        const activityItems = [
            ...plasticCollections.map(pc => ({
                id: pc.id,
                action: "Added plastic collection",
                timestamp: pc.createdAt,
            })),
            ...rewards.map(r => ({
                id: r.id,
                action: "Claimed reward",
                timestamp: r.claimedDate,
            })),
            ...badges.map(b => ({
                id: b.id,
                action: `Earned badge: ${b.name}`,
                timestamp: b.issuedDate,
            })),
        ]

        const recentActivity = activityItems
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10)

        const totalRewardsClaimed = await prisma.reward.count({
            where: { userId: profileId },
        })

        const totalBadgesEarned = await prisma.badge.count({
            where: { userId: profileId },
        })

        const response = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
                isActive: user.isActive,
                joinedAt: user.joinedAt.toISOString(),
                lastLogin: null,
                profilePic: user.profile.profilePic || "",
            },
            activity: recentActivity.map(item => ({
                id: item.id,
                action: item.action,
                timestamp: item.timestamp.toISOString(),
            })),
            stats: {
                totalPlasticCollected: Number(
                    user.profile.totalPlasticRecycled || 0
                ),
                totalRewardsClaimed,
                totalBadgesEarned,
                totalPoints: Number(user.profile.earnedPoints || 0),
            },
        }

        return NextResponse.json(response, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
