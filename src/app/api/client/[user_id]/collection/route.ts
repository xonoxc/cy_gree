import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import { collectionCreateValidationSchema } from "@/utils/validation/collection/collection"
import { idValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    req: NextRequest,
    { params }: { params: { user_id: string } }
) {
    await checkAuth()
    try {
        const { user_id: userId } = params
        const body = req.body

        const idValidation = idValidationSchema.safeParse(userId)
        if (!idValidation.success)
            return NextResponse.json(
                {
                    error: "Invalid user Id",
                },
                { status: 400 }
            )

        const collectionValidation =
            collectionCreateValidationSchema.safeParse(body)
        if (!collectionValidation.success)
            return NextResponse.json(
                {
                    error: "Invalid body!",
                    message: collectionValidation.error.format(),
                },
                { status: 400 }
            )

        const { amount_collected, pic } = collectionValidation.data

        const createdCollection = await prisma.plasticCollection.create({
            data: {
                amount: amount_collected,
                imagePath: pic,
                userId,
            },
        })

        if (!createdCollection) throw Error("Error creating collection !")

        return NextResponse.json(
            { message: "Collection created successfully!" },
            { status: 201 }
        )
    } catch (error) {
        logErrors(error)
        return NextResponse.json(
            { error: "error creating collection" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
