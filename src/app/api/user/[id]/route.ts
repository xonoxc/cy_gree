import {
    idValidationSchema,
    userUpdateValidationSchema,
} from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"
import prisma from "@/config/prisma/prisma.client"
import { checkAuth } from "@/utils/check.auth"

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
            } catch (error: any) {
                throw new Error("error updating user", error)
            }
        })

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: "cannot update user details" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
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
    } catch (error) {
        console.error("Error deleting user:", error)
        if (
            error instanceof Error &&
            "code" in error &&
            error.code === "P2003"
        ) {
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
