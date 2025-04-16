import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"
import { PaginatedResponse } from "@/types/response"
import { Role, State } from "@prisma/client"
import { AdminUserProfileCreateSchema } from "@/utils/validation/profile"

export type RoleFilter = Role | "all"

export interface ProfilesResp {
    id: string
    userId: string
    userName: string
    profilePic: string | null
    role: RoleFilter
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    phoneNumber: string | null
    totalPlasticRecycled: number
    earnedPoints: number
}

export async function GET(req: NextRequest) {
    await checkAuth()

    const searchParams = req.nextUrl.searchParams

    const page = searchParams.get("page")
    const limit = searchParams.get("limit")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || "all"

    if (!page || !limit) {
        return NextResponse.json(
            { error: "Both page and limit values are required" },
            { status: 400 }
        )
    }

    try {
        const pageInt = parseInt(page)
        const limitInt = parseInt(limit)
        const skip = (pageInt - 1) * limitInt

        const searchFilter: any = {}

        if (search) {
            const allStates = Object.values(State)
            const matchingStates = allStates.filter(state =>
                state.toLowerCase().includes(search.toLowerCase())
            )

            searchFilter["OR"] = [
                {
                    user: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    city: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    phoneNumber: {
                        contains: search,
                    },
                },
            ]

            if (matchingStates.length > 0) {
                searchFilter["OR"].push({
                    state: {
                        in: matchingStates,
                    },
                })
            }
        }

        if (role && role !== "all") {
            searchFilter["role"] = role
        }

        const [profiles, total] = await Promise.all([
            prisma.userProfile.findMany({
                where: searchFilter,
                skip,
                take: limitInt,
                include: {
                    user: {
                        select: { name: true },
                    },
                },
                orderBy: { userId: "asc" },
            }),
            prisma.userProfile.count({ where: searchFilter }),
        ])

        const formattedProfiles = profiles.map(profile => ({
            id: profile.id,
            userId: profile.userId,
            userName: profile.user.name,
            profilePic: profile.profilePic,
            role: profile.role,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            phoneNumber: profile.phoneNumber,
            totalPlasticRecycled: Number(profile.totalPlasticRecycled),
            earnedPoints: Number(profile.earnedPoints),
        }))

        const response: PaginatedResponse<ProfilesResp[]> = {
            data: formattedProfiles,
            pagination: {
                totalEntries: total,
                totalPages: Math.ceil(total / limitInt),
                currentPage: pageInt,
                limit: limitInt,
            },
        }

        return NextResponse.json(response, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            {
                error: "Something went wrong while fetching user profiles",
            },
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

        const updateDataValidationRes =
            AdminUserProfileCreateSchema.safeParse(body)

        if (!updateDataValidationRes.success)
            return NextResponse.json(
                { error: updateDataValidationRes.error.format() },
                { status: 400 }
            )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            {
                error: "Error while creating profile",
            },
            { status: 500 }
        )
    }
}
