import {
    idValidationSchema,
    userUpdateValidationSchema,
} from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"
import { logErrors } from "@/utils/errors/errorLogs"

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await checkAuth()
    try {
        const { id } = await params

        const idValidationResult = idValidationSchema.safeParse(id)
        if (!idValidationResult.success)
            return NextResponse.json(
                { error: "Invalid user id provided" },
                { status: 400 }
            )

        const user = await prisma.user.findUnique({
            where: { id },
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(user, { status: 200 })
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { error: "cannot update user details" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    await checkAuth()
    try {
        const { id } = params
        const body = await request.json()

        const idValidationResult = idValidationSchema.safeParse(id)
        if (!idValidationResult.success)
            return NextResponse.json({ error: "Invalid id" }, { status: 400 })

        const userId = idValidationResult.data

        const validationResult = userUpdateValidationSchema.safeParse(body)
        if (!validationResult.success)
            return NextResponse.json(
                { error: validationResult.error.format() },
                { status: 400 }
            )

        const { firstName, lastName, ...directFields } = validationResult.data

        const existingUser =
            firstName || lastName
                ? await prisma.user.findUnique({ where: { id: userId } })
                : null

        if ((firstName || lastName) && !existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const updateData: any = { ...directFields }

        if (firstName || lastName) {
            const [currentFirst, ...currentLastParts] =
                existingUser!.name.split(" ")
            const currentLast = currentLastParts.join("")

            updateData.name = `${firstName || currentFirst} ${lastName || currentLast}`
        }

        if (Object.keys(updateData).length === 0)
            return NextResponse.json(
                { message: "No changes to apply" },
                { status: 200 }
            )

        const result = await prisma.$transaction(async txn => {
            try {
                const updatedUser = await txn.user.update({
                    where: { id: userId },
                    data: updateData,
                })

                const { password, ...updatedResult } = updatedUser

                return {
                    success: true,
                    updatedUser: updatedResult,
                }
            } catch (e: any) {
                throw new Error("error updating user", e)
            }
        })

        return NextResponse.json(result, { status: 200 })
    } catch (e) {
        return NextResponse.json(
            { error: "cannot update user details" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params
    try {
        const { id } = params

        const idValidationResult = idValidationSchema.safeParse(id)
        if (!idValidationResult.success)
            return NextResponse.json({ error: "Invalid id" }, { status: 400 })

        const userId = idValidationResult.data

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        await prisma.user.delete({
            where: { id: userId },
        })

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        )
    } catch (e) {
        console.error("Error deleting user:", e)
        if (e instanceof Error && "code" in e && e.code === "P2003") {
            return NextResponse.json(
                {
                    error: "Cannot delete user due to existing related records",
                    details:
                        "This user has associated data that must be deleted first",
                },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
