import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { Record } from "@prisma/client/runtime/library"

export async function GET(req: NextRequest) {
    await checkAuth()
    try {
        const searchParams = req.nextUrl.searchParams

        const page = searchParams.get("page")
        const limit = searchParams.get("limit")
        const search = searchParams.get("search") || ""
        const status = searchParams.get("status") || ""

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
                        name: {
                            contains: search as string,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    id: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    claimedBy: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
            ]
        }

        if (status !== "all") {
            searchFilter.status = status
        }

        const totalCollections = await prisma.plasticCollection.count({
            where: searchFilter,
        })

        const collections = await prisma.plasticCollection.findMany({
            where: searchFilter,
            skip,
            take: itemsPerPage,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: {
                    select: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        const formattedCollections = collections.map(collection => ({
            id: collection.id,
            userId: collection.userId,
            userName: collection.user.user.name,
            imagePath: collection.imagePath,
            amount: Number(collection.amount),
            status: collection.status,
            claimedBy: collection.claimedBy || "",
            createdAt: collection.createdAt.toISOString(),
            updatedAt: collection.updatedAt.toISOString(),
        }))

        return NextResponse.json(
            {
                collections: formattedCollections,
                total: totalCollections,
                currentPage,
                totalPages: Math.ceil(totalCollections / itemsPerPage),
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching plastic collections:", error)
        NextResponse.json({ message: "Internal server error" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
