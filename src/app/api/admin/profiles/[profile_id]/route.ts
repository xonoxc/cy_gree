import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    params: Promise<{ profile_id: string }>
) {
    await checkAuth()
    try {
        const { profile_id } = await params

        const idValidatioRes = idValidationSchema.safeParse(profile_id)
        if (!idValidatioRes.success)
            return NextResponse.json(
                {
                    error: idValidatioRes.error.format(),
                },
                { status: 400 }
            )

        const profileId = idValidatioRes.data

        const userProfile = await prisma.userProfile.findUnique({
            where: {
                id: profileId,
            },
            select: {
                profilePic: true,
                role: true,
                city: true,
                state: true,
                country: true,
                phoneNumber: true,
                totalPlasticRecycled: true,
                earnedPoints: true,
            },
        })

        if (!userProfile)
            return NextResponse.json(
                {
                    message: "User profile not found",
                },
                { status: 404 }
            )

        return NextResponse.json({ ...userProfile }, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            {
                error: "Something went wrong while fetching user profile",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(
    _: NextRequest,
    params: Promise<{ profile_id: string }>
) {
    await checkAuth()
    try {
        const { profile_id } = await params

        const idValidationRes = idValidationSchema.safeParse(profile_id)
        if (!idValidationSchema.safeParse) {
            return NextResponse.json(
                {
                    error: idValidationRes.error?.format(),
                },
                { status: 400 }
            )
        }
    } catch (e) {}
}

export async function PATCH() {
    try {
    } catch (e) {}
}
