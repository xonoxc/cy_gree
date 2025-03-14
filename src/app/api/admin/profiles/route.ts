import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { Record } from "@prisma/client/runtime/library"
import { NextRequest, NextResponse } from "next/server"
import { PaginatedResponse } from "@/types/response"
import { Role } from "@prisma/client"

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

        const searchFilter: Record<string, Object[] | string> = {}
        if (search) {
            searchFilter["OR"] = [
                {
                    user: {
                        name: {
                            contains: search as string,
                            mode: "insensitive",
                        },
                    },
                },
                { city: { contains: search as string, mode: "insensitive" } },
                { state: { contains: search as string, mode: "insensitive" } },
                { phoneNumber: { contains: search as string } },
            ]
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
                error: "Soemthing went wrong while fetching user profiles",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
