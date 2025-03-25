import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"
import {
    idValidationSchema,
    updateProfileSchema,
} from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _: NextRequest,
    props: { params: Promise<{ user_id: string }> }
) {
    const params = await props.params
    await checkAuth()
    try {
        const { user_id: userId } = params

        const idValidationRes = idValidationSchema.safeParse(userId)
        if (!idValidationRes.success) {
            return NextResponse.json(
                {
                    error: idValidationRes.error.format(),
                },
                { status: 400 }
            )
        }

        const userProfile = await prisma.userProfile.findFirst({
            where: {
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!userProfile) {
            return NextResponse.json(
                { eorror: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ ...userProfile }, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ user_id: string }> }
) {
    const params = await props.params
    try {
        const [_, requestBody] = await Promise.all([checkAuth(), req.json()])

        const { success, data, error } =
            updateProfileSchema.safeParse(requestBody)

        if (!success) {
            return NextResponse.json(
                {
                    error: "Invalid update data",
                    details: error.format(),
                },
                { status: 400 }
            )
        }

        const definedFields = Object.entries(data).filter(
            ([_, value]) => value !== undefined
        )

        const updateData = Object.fromEntries(definedFields)

        const updatedProfile = await prisma.userProfile.update({
            where: { userId: params.user_id },
            data: {
                ...updateData,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        password: true,
                        isActive: true,
                        username: true,
                        joinedAt: true,
                    },
                },
            },
        })

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                profile: updatedProfile,
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
