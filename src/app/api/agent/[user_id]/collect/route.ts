import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ user_id: string }> }
) {
    const params = await props.params
    await checkAuth()
    try {
        const { user_id: userId } = params
        const collectionId = request.nextUrl.searchParams.get("collection_id")

        if (!userId || !collectionId)
            return NextResponse.json(
                {
                    error: "Both user and collectionId are required",
                },
                { status: 400 }
            )

        const collection = await prisma.plasticCollection.findFirst({
            where: {
                AND: [
                    { id: collectionId },
                    { claimedBy: userId },
                    { status: "Claimed" },
                ],
            },
        })

        if (!collection)
            return NextResponse.json(
                { error: "Collection not found" },
                { status: 404 }
            )

        const updatedCollection = await prisma.plasticCollection.update({
            where: {
                id: collection.id,
            },
            data: {
                claimedBy: userId,
                status: "Collected",
            },
        })

        if (!updatedCollection)
            return NextResponse.json(
                { error: "Cannot claim request !" },
                { status: 500 }
            )

        return NextResponse.json(
            {
                message: "Request claimed successfully!",
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
