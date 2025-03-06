import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    { params }: { params: { user_id: string } }
) {
    await checkAuth()
    try {
        const { user_id: userId } = params

        const userIdValidationRes = idValidationSchema.safeParse(userId)
        if (!userIdValidationRes.success)
            return NextResponse.json(
                {
                    error: "Invalid userId provided",
                },
                { status: 400 }
            )

        const pendingRequests = await prisma.plasticCollection.findMany({
            where: {
                AND: [
                    {
                        userId,
                    },
                    { status: "Pending" },
                ],
            },
        })

        if (!pendingRequests) {
            return NextResponse.json(
                {
                    error: "Error while fetching pending request",
                },
                { status: 500 }
            )
        }

        const claimedRequests = await prisma.plasticCollection.findMany({
            where: {
                AND: [{ userId }, { status: "Claimed" }],
            },
        })

        if (!claimedRequests) {
            return NextResponse.json(
                {
                    error: "Error while fetching pending request",
                },
                { status: 500 }
            )
        }

        const completedRequests = await prisma.plasticCollection.findMany({
            where: { AND: [{ userId }, { status: "Collected" }] },
        })

        if (!completedRequests) {
            return NextResponse.json(
                {
                    error: "Error while fetching completed request",
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                pending_requests: pendingRequests,
                claimed_requests: claimedRequests,
                completed_requests: completedRequests,
            },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}
