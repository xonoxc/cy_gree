import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { Status } from "@prisma/client"
import { logErrors } from "@/utils/errors/errorLogs"
import { adminCollcetionCreateSchema } from "@/utils/validation/collection/collection"
import { capitalizeFirstLetter } from "@/utils/capitalize"

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

        const searchFilter: any = {}

        if (search) {
            searchFilter.OR = [
                {
                    user: {
                        user: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    id: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    claimedBy: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ]
        }

        if (status && status !== "all") {
            const statusEnum = capitalizeFirstLetter(status) as Status
            if (!Object.values(Status).includes(statusEnum)) {
                return NextResponse.json(
                    { error: "Invalid status value" },
                    { status: 400 }
                )
            }
            searchFilter.status = statusEnum
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
                    include: {
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

        const collectionValidation = adminCollcetionCreateSchema.safeParse(body)
        if (!collectionValidation.success)
            return NextResponse.json(
                {
                    error: "Invalid body!",
                    message: collectionValidation.error.format(),
                },
                { status: 400 }
            )

        console.log("validation passed")

        const { imagePath, amount, status, claimedBy, userId } =
            collectionValidation.data

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            )
        }

        const createdCollection = await prisma.plasticCollection.create({
            data: {
                amount,
                userId,
                status,
                imagePath,
                claimedBy,
            },
        })

        if (!createdCollection) throw Error("Error creating collection !")

        return NextResponse.json(
            { message: "Collection created successfully!" },
            { status: 201 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "error creating collection" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
