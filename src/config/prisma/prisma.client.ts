import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient(
    process.env.NODE_ENV === "development"
        ? {
              log: ["error", "info", "warn"],
          }
        : undefined
)

const globalPrismaInstance = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== "production") globalPrismaInstance.prisma = prisma

export default prisma
