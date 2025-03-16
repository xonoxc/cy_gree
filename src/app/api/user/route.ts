import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextResponse } from "next/server"

export async function GET() {
    await checkAuth()
    try {
        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: { id: true, name: true },
        })

        return NextResponse.json({ users }, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
