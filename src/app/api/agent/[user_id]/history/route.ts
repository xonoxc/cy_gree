import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"

import { NextResponse } from "next/server"

export async function GET({ params }: { params: { user_id: string } }) {
    await checkAuth()
    try {
        const { user_id: agentId } = params

        const userIdValidationRes = idValidationSchema.safeParse(agentId)
        if (!userIdValidationRes.success)
            return NextResponse.json(
                {
                    error: "Invalid userId provided",
                },
                { status: 400 }
            )

        const pendingRequests = await prisma.plasticCollection.findMany({
            where: {
                AND: [{ claimedBy: agentId }, { status: "Pending" }],
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
                AND: [{ claimedBy: agentId }, { status: "Claimed" }],
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

        return NextResponse.json(
            {
                pending_requests: pendingRequests,
                claimed_requests: claimedRequests,
            },
            { status: 200 }
        )
    } catch (error) {
        logErrors(error)
        return NextResponse.json(
            {
                error: "Something went wrong while fetching history",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
