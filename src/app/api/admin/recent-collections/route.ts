import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextResponse } from "next/server"

export async function GET() {
    await checkAuth()
    try {
        const recentCollections = (await prisma.$queryRaw`
			SELECT 
				pc."updatedAt",
				pc.amount,
				u.name
			FROM "PlasticCollection" pc
			JOIN "UserProfile" up ON pc."userId" = up."userId"
			JOIN "User" u ON up."userId" = u.id
			WHERE pc.status = 'Collected'
			ORDER BY pc."createdAt" DESC
			LIMIT 5
		`) as { name: string; amount: number; updatedAt: string }[]

        return NextResponse.json(recentCollections, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Somethign went wrong" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
