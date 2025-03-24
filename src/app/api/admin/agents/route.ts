import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest) {
    await checkAuth()
    try {
        const agents = await prisma.user.findMany({
            where: {
                profile: {
                    role: "Agent",
                },
            },
        })

        return NextResponse.json({ agents })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong while fecthing users" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
