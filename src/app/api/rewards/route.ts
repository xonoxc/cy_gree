import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest) {
    await checkAuth()
    try {
        const availableRewards = await prisma.listReward.findMany()

        if (!availableRewards)
            return NextResponse.json(
                { error: "No rewards found" },
                { status: 404 }
            )

        return NextResponse.json({ availableRewards }, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong while fetching rewards" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
