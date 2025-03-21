import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import prisma from "@/config/prisma/prisma.client"
import { claimRewardSchema } from "@/utils/validation/user"
import z from "zod"

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

export default async function POST(req: NextRequest) {
    try {
        const { userId, rewardId } = claimRewardSchema.parse(req.body)

        const result = await prisma.$transaction(async tx => {
            const userProfile = await tx.userProfile.findUnique({
                where: { userId },
                select: {
                    earnedPoints: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            })

            if (!userProfile) {
                throw new Error("User not found")
            }

            const reward = await tx.listReward.findUnique({
                where: { id: rewardId },
                select: {
                    pointsRequired: true,
                    title: true,
                    rewardType: true,
                },
            })

            if (!reward) {
                throw new Error("Reward not found")
            }

            if (userProfile.earnedPoints < reward.pointsRequired) {
                throw new Error("Insufficient points")
            }

            const existingClaim = await tx.reward.findUnique({
                where: {
                    userId_rewardId: {
                        userId,
                        rewardId,
                    },
                },
            })

            if (existingClaim) {
                throw new Error("Reward already claimed by this user")
            }

            const newReward = await tx.reward.create({
                data: {
                    userId,
                    rewardId,
                },
            })

            await tx.userProfile.update({
                where: { userId },
                data: {
                    earnedPoints: {
                        decrement: reward.pointsRequired,
                    },
                },
            })

            await tx.notification.create({
                data: {
                    userId,
                    message: `You've successfully claimed "${reward.title}" reward!`,
                    importanceLevel: "Medium",
                },
            })

            return {
                reward: newReward,
                remainingPoints:
                    Number(userProfile.earnedPoints) -
                    Number(reward.pointsRequired),
                rewardTitle: reward.title,
                rewardType: reward.rewardType,
            }
        })

        return NextResponse.json(
            {
                success: true,
                data: result,
                message: "Reward claimed successfully",
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)

        if (e instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: "Invalid request data",
                errors: e.errors,
            })
        }

        return NextResponse.json({
            success: false,
            message: e instanceof Error ? e.message : "Failed to claim reward",
        })
    } finally {
        await prisma.$disconnect()
    }
}
