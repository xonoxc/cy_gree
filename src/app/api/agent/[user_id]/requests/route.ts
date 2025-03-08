import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, props: { params: Promise<{ user_id: string }> }) {
    const params = await props.params;
    await checkAuth()
    try {
        const { user_id: agentId } = params

        const idValidationRes = idValidationSchema.safeParse(agentId)
        if (!idValidationRes.success)
            return NextResponse.json(
                {
                    error: "Invalid id",
                },
                { status: 400 }
            )

        const agentProfile = await prisma.userProfile.findFirst({
            where: {
                id: agentId,
            },
        })

        if (!agentProfile) {
            return NextResponse.json(
                {
                    error: "user profile not found!",
                },
                { status: 404 }
            )
        }

        const { city, state, country } = agentProfile
        if (!city && !state && !country)
            return NextResponse.json(
                {
                    message:
                        "Please update your profile details, especially your location",
                },
                { status: 406 }
            )

        const filters: Record<string, string>[] = []

        if (city) filters.push({ city })

        if (state) filters.push({ state })

        if (country) filters.push({ country })

        const collectionRequests = await prisma.plasticCollection.findMany({
            where: {
                status: "Pending",
                user: {
                    AND: {
                        ...filters,
                    },
                },
            },
            orderBy: {
                user: {
                    city: "asc",
                    state: "asc",
                },
            },
        })

        if (!collectionRequests)
            return NextResponse.json(
                {
                    error: "Cannot get Requests",
                },
                { status: 500 }
            )

        return NextResponse.json(collectionRequests, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
