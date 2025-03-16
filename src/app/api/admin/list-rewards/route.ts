import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/utils/check.auth"
import prisma from "@/config/prisma/prisma.client"

export async function GET(req: NextRequest) {
    await checkAuth()
    try {
        const searchParams = req.nextUrl.searchParams

        const page = searchParams.get("page")
        const limit = searchParams.get("limit")
        const search = searchParams.get("search") || ""
        const type = searchParams.get("type") || ""

        if (!page || !limit) {
            return NextResponse.json(
                { error: "Both page and limit values are required" },
                { status: 400 }
            )
        }

        const currentPage = parseInt(page as string) || 1
        const itemsPerPage = parseInt(limit as string) || 10
        const skip = (currentPage - 1) * itemsPerPage

        const searchFilter: Record<string, Object[] | string> = {}
        if (search) {
            searchFilter.OR = [
                {
                    title: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    id: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
            ]
        }

        if (type !== "all") {
            searchFilter.rewardType = type
        }

        const totalRewards = await prisma.listReward.count({
            where: searchFilter,
        })

        const rewards = await prisma.listReward.findMany({
            where: searchFilter,
            skip,
            take: itemsPerPage,
            orderBy: {
                issuedDate: "desc",
            },
        })

        return NextResponse.json(
            {
                rewards,
                total: totalRewards,
                currentPage,
                totalPages: Math.ceil(totalRewards / itemsPerPage),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching list rewards:", error)
        NextResponse.json({ message: "Internal server error" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
