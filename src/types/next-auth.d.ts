import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import { Role } from "@prisma/client"

declare module "next-auth" {
    interface User {
        role: Role
    }

    interface Session {
        user: {
            role: Role
            id: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: Role
        id: string
    }
}
