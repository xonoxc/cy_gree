import { PrismaClient } from "@prisma/client"

const prismaclientSingleton = () => {
    return new PrismaClient(
        process.env.NODE_ENV === "development"
            ? {
                  log: ["info", "warn"],
              }
            : undefined
    )
}

type PrismaClientType = ReturnType<typeof prismaclientSingleton>

const globalPrismaInstance = globalThis as unknown as {
    prisma: PrismaClientType | undefined
}

const prisma = globalPrismaInstance.prisma ?? prismaclientSingleton()

if (process.env.NODE_ENV === "development") {
    globalPrismaInstance.prisma = prisma
}


export default prisma
