import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"
import { PaginatedResponse } from "@/types/response"

export interface UsersResp {
    name: string
    id: string
    username: string
    email: string
    isActive: boolean
    joinedAt: Date
}

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

        const pageInt = parseInt(page)
        const limitInt = parseInt(limit)

        const skip = (pageInt - 1) * limitInt

        const searchFilter = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          username: {
                              contains: search,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          email: {
                              contains: search,
                              mode: "insensitive" as const,
                          },
                      },
                  ],
              }
            : ({} as any)

        if (status) {
            if (status === "all") {
                searchFilter["isActive"] = true
            } else {
                searchFilter["isActive"] = status === "active"
            }
        }

        const totalUsers = await prisma.user.count({
            where: {
                ...searchFilter,
            },
        })

        const totalPages = Math.ceil(totalUsers / limitInt)

        const users = await prisma.user.findMany({
            skip,
            take: limitInt,
            where: searchFilter,
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                isActive: true,
                joinedAt: true,
            },
        })

        const response: PaginatedResponse<UsersResp[]> = {
            data: users,
            pagination: {
                totalEntries: totalUsers,
                totalPages,
                currentPage: pageInt,
                limit: limitInt,
            },
        }

        return NextResponse.json(response, { status: 200 })
    } catch (e) {
        logErrors(e)
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 500 })
        }
    } finally {
        await prisma.$disconnect()
    }
}
