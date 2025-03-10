import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ user_id: string }> }
) {
    const params = await props.params
    await checkAuth()
    try {
        const { user_id: userId } = params
        const collectionId = request.nextUrl.searchParams.get("collection_id")

        const userIdValidationRes = idValidationSchema.safeParse(userId)
        if (!userIdValidationRes.success)
            return NextResponse.json(
                { error: "Invalid user id" },
                { status: 400 }
            )

        const collectionIdValidationRes =
            idValidationSchema.safeParse(collectionId)
        if (!collectionIdValidationRes.success)
            return NextResponse.json(
                { error: "Invalid collection Id" },
                { status: 400 }
            )

        if (!userId || !collectionId)
            return NextResponse.json(
                {
                    error: "Both user and collectionId are required",
                },
                { status: 400 }
            )

        const collection = await prisma.plasticCollection.findFirst({
            where: {
                AND: [{ id: collectionId }, { status: "Pending" }],
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
                status: "Claimed",
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
    } catch (error) {
        logErrors(error)
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
