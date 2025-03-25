import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"
import { logErrors } from "@/utils/errors/errorLogs"
import { checkAuth } from "@/utils/check.auth"
import { badgeAdminFormSchema as awardBageReqBodySchema } from "@/utils/validation/badge"
import { idValidationSchema } from "@/utils/validation/user"

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

        const searchFilter: Record<string, object[] | string> = {}
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

export async function POST(req: NextRequest) {
    await checkAuth()
    try {
        const body = await req.json()

        const bodyValidationRes = awardBageReqBodySchema.safeParse(body)
        if (!bodyValidationRes.success)
            return NextResponse.json(
                { error: bodyValidationRes.error.format() },
                { status: 400 }
            )

        const { userId, name } = bodyValidationRes.data

        const existingUser = await prisma.userProfile.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        })

        if (!existingUser)
            return NextResponse.json(
                {
                    error: "User not found",
                },
                { status: 404 }
            )

        await prisma.badge.create({
            data: {
                userId: existingUser.id,
                name,
            },
        })

        return NextResponse.json(
            { message: "Badge created successfully" },
            { status: 201 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            {
                error: "Something went wrong while creating reward",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(req: NextRequest) {
    await checkAuth()
    try {
        const id = req.nextUrl.searchParams.get("badgeId")

        const idValidationRes = idValidationSchema.safeParse(id)
        if (!idValidationRes.success)
            return NextResponse.json(
                {
                    error: idValidationRes.error.format(),
                },
                { status: 400 }
            )

        const badgeId = idValidationRes.data

        await prisma.badge.delete({
            where: {
                id: badgeId,
            },
        })

        return NextResponse.json(
            {
                message: "Badge revoked successfully",
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Error while revoking reward" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
