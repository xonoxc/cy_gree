import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { loginUserSchemaValidation } from "@/utils/validation/user"
import prisma from "@/config/prisma/prisma.client"
import bcrypt from "bcryptjs"
import { Role } from ".prisma/client"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "username",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "password",
                },
            },
            async authorize(credentials) {
                if (!credentials) throw new Error("No credentials provided")
                try {
                    const validationResult =
                        loginUserSchemaValidation.safeParse(credentials)

                    if (!validationResult.success) {
                        throw new Error("Invalid credentials")
                    }

                    const user = await prisma.user.findFirst({
                        where: {
                            username: credentials.username,
                        },
                        include: {
                            profile: {
                                select: {
                                    role: true,
                                },
                            },
                        },
                    })
                    if (!user) throw new Error("User not found")

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )
                    if (!isPasswordCorrect)
                        throw new Error("Incorrect password!")

                    return {
                        ...user,
                        id: user.id.toString(),
                        role: user.profile?.role as Role,
                    }
                } catch (e: any) {
                    throw new Error(e)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }

            return token
        },

        async session({ session, token }) {
            if (session) {
                session.user.id = token.id
                session.user.role = token.role
            }

            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET!,
    pages: {
        signIn: "/sign-in",
    },
}
