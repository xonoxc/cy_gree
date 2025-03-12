import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextResponse } from "next/server"
import { monthNames } from "@/constants/months"

export async function GET() {
    console.warn("GET /api/admin/metrics recivied requests")
    await checkAuth()
    try {
        const monthlyPlasticCollections = (await prisma.$queryRaw`
            SELECT 
                EXTRACT(MONTH FROM "createdAt") as month,
                SUM(amount) as total
            FROM "PlasticCollection"
            WHERE status = 'Collected'
            GROUP BY EXTRACT(MONTH FROM "createdAt")
            ORDER BY month ASC
        `) as { month: number; total: string }[]

        const monthlyData = monthlyPlasticCollections.map(
            (item: { month: number; total: string }) => ({
                name: monthNames[item.month - 1],
                total: Number(item.total),
            })
        )

        return NextResponse.json(monthlyData)
    } catch (e) {
        logErrors(e)
        if (e instanceof Error) {
            return NextResponse.json({ error: e.message }, { status: 500 })
        }
    } finally {
        await prisma.$disconnect()
    }
}
