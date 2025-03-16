import prisma from "@/config/prisma/prisma.client"
import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"

export async function GET(req: NextRequest) {
    await checkAuth()
    try {
        const searchParams = req.nextUrl.searchParams

        const page = searchParams.get("page")
        const limit = searchParams.get("limit")
        const search = searchParams.get("search") || ""
        const type = searchParams.get("type") || "all"

        const currentPage = parseInt(page as string) || 1
        const itemsPerPage = parseInt(limit as string) || 10
        const skip = (currentPage - 1) * itemsPerPage

        const searchFilter: Record<string, object[] | string | object> = {}
        if (search) {
            searchFilter.OR = [
                {
                    user: {
                        user: {
                            name: {
                                contains: search as string,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    reward: {
                        title: {
                            contains: search as string,
                            mode: "insensitive",
                        },
                    },
                },
            ]
        }

        if (type !== "all") {
            searchFilter.reward = {
                rewardType: type,
            }
        }

        const totalRewards = await prisma.reward.count({
            where: searchFilter,
        })

        const rewards = await prisma.reward.findMany({
            where: searchFilter,
            skip,
            take: itemsPerPage,
            orderBy: {
                claimedDate: "desc",
            },
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
                reward: {
                    select: {
                        title: true,
                        rewardType: true,
                    },
                },
            },
        })

        const formattedRewards = rewards.map(reward => ({
            id: reward.id,
            userId: reward.userId,
            userName: reward.user.user.name,
            userImage: reward.user.profilePic,
            rewardId: reward.rewardId,
            rewardTitle: reward.reward.title,
            rewardType: reward.reward.rewardType,
            claimedDate: reward.claimedDate.toISOString(),
        }))

        return NextResponse.json({
            rewards: formattedRewards,
            total: totalRewards,
            currentPage,
            totalPages: Math.ceil(totalRewards / itemsPerPage),
        })
    } catch (e) {
        logErrors(e)
        return NextResponse.json({ message: "Internal server error" })
    } finally {
        await prisma.$disconnect()
    }
}
