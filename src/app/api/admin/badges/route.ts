import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams

        const page = searchParams.get("page")
        const limit = searchParams.get("limit")
        const search = searchParams.get("search") || ""
        const badge = searchParams.get("badge") || ""

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
                    user: {
                        user: {
                            name: {
                                contains: search as string,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                { id: { contains: search as string, mode: "insensitive" } },
            ]
        }

        if (badge !== "all") {
            searchFilter.name = badge
        }

        const totalBadges = await prisma.badge.count({ where: searchFilter })

        const badges = await prisma.badge.findMany({
            where: searchFilter,
            skip,
            take: itemsPerPage,
            orderBy: { issuedDate: "desc" },
            include: {
                user: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
            },
        })

        const formattedBadges = badges.map(badge => ({
            id: badge.id,
            userId: badge.userId,
            userName: badge.user.user.name,
            userImage:
                badge.user.profilePic || "/placeholder.svg?height=40&width=40",
            name: badge.name,
            issuedDate: badge.issuedDate.toISOString(),
        }))

        return NextResponse.json(
            {
                badges: formattedBadges,
                total: totalBadges,
                currentPage,
                totalPages: Math.ceil(totalBadges / itemsPerPage),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching badges:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
