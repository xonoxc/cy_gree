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

        const idValidation = idValidationSchema.safeParse(userId)
        if (!idValidation.success) {
            return NextResponse.json(
                {
                    error: idValidation.error.format(),
                },
                { status: 400 }
            )
        }

        const unclaimed_requests = await prisma.plasticCollection.findMany({
            where: {
                AND: [{ userId }, { status: "Pending" }],
            },
            select: {
                amount: true,
                createdAt: true,
            },
        })

        if (!unclaimed_requests) {
            return NextResponse.json(
                { error: "Error retiving unclaimed requests" },
                { status: 500 }
            )
        }

        const pending_requests = await prisma.plasticCollection.findMany({
            where: {
                AND: [{ userId }, { status: "Claimed" }],
            },
            select: {
                amount: true,
                createdAt: true,
            },
        })

        if (!pending_requests) {
            return NextResponse.json(
                { error: "Error retiving pending requests" },
                { status: 500 }
            )
        }

        const completed_requests = await prisma.plasticCollection.findMany({
            where: {
                AND: [{ userId }, { status: "Collected" }],
            },
            select: {
                amount: true,
                createdAt: true,
            },
        })

        if (!completed_requests) {
            return NextResponse.json(
                { error: "Error retiving pending requests" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            unclaimed_requests,
            pending_requests,
            completed_requests,
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
