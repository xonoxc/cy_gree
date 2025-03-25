import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/utils/check.auth"
import prisma from "@/config/prisma/prisma.client"

export async function GET(_: NextRequest) {
    await checkAuth()
    try {
        const availableRewards = await prisma.listReward.findMany({
            select: {
                id: true,
                title: true,
                pointsRequired: true,
            },
        })

        if (!availableRewards)
            return NextResponse.json(
                { message: "No rewards found" },
                { status: 404 }
            )

        return NextResponse.json({ availableRewards }, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            {
                message: "error fetching rewards",
            },
            { status: 500 }
        )
    }
}
