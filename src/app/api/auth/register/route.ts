import prisma from "@/config/prisma/prisma.client"
import { registerUserCredValidationSchema } from "@/utils/validation/user"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
    try {
        const credentails = await request.json()

        console.log("credentails", credentails)

        const validationResult =
            registerUserCredValidationSchema.safeParse(credentails)

        if (!validationResult.success) {
            return NextResponse.json(
                { message: validationResult.error.errors },
                { status: 400 }
            )
        }

        const { email, username, password, firstName, lastName } =
            validationResult.data

        const exisitingUserWithEmail = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })

        if (exisitingUserWithEmail) {
            return NextResponse.json(
                {
                    error: "Email aleady taken",
                },
                { status: 400 }
            )
        }

        const exisitingUserWithUsername = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })

        if (exisitingUserWithUsername) {
            return NextResponse.json(
                {
                    error: "username aleady taken",
                },
                { status: 400 }
            )
        }

        const transactionResult = await prisma.$transaction(async prisma => {
            const hashedPassword = await bcrypt.hash(password, 10)

            const userCreationResponse = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`,
                },
            })

            if (!userCreationResponse) {
                return false
            }

            const profileCreationResponse = await prisma.userProfile.create({
                data: {
                    userId: userCreationResponse.id,
                },
            })

            if (!profileCreationResponse) {
                return false
            }

            return true
        })

        if (!transactionResult) {
            return NextResponse.json(
                {
                    error: "User creation failed",
                },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
