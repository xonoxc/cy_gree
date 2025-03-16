import { NextRequest, NextResponse } from "next/server"
import { checkAuth } from "@/utils/check.auth"
import prisma from "@/config/prisma/prisma.client"
import { logErrors } from "@/utils/errors/errorLogs"
import { adminNotificationSchema } from "@/types/admin/notifications"

export async function GET(req: NextRequest) {
    await checkAuth()
    try {
        const searchParams = req.nextUrl.searchParams

        const page = searchParams.get("page")
        const limit = searchParams.get("limit")
        const search = searchParams.get("search") || ""
        const importance = searchParams.get("importance") || "all"
        const read = searchParams.get("read") || "all"

        if (!page || !limit) {
            return NextResponse.json(
                { error: "Both page and limit values are required" },
                { status: 400 }
            )
        }

        const currentPage = parseInt(page as string) || 1
        const itemsPerPage = parseInt(limit as string) || 10
        const skip = (currentPage - 1) * itemsPerPage

        const where: Record<string, Object[] | string | boolean> = {}
        if (search) {
            where.OR = [
                { message: { contains: search, mode: "insensitive" } },
                {
                    user: {
                        user: {
                            name: { contains: search, mode: "insensitive" },
                        },
                    },
                },
                {
                    toUser: {
                        user: {
                            name: { contains: search, mode: "insensitive" },
                        },
                    },
                },
            ]
        }

        if (importance !== "all") {
            where.importanceLevel = importance
        }

        if (read === "read") {
            where.isRead = true
        } else if (read === "unread") {
            where.isRead = false
        }

        const totalNotifications = await prisma.notification.count({ where })

        const notifications = await prisma.notification.findMany({
            where,
            skip,
            take: itemsPerPage,
            orderBy: { notificationDate: "desc" },
            include: {
                user: { include: { user: { select: { name: true } } } },
                toUser: { include: { user: { select: { name: true } } } },
            },
        })

        const formattedNotifications = notifications.map(notification => ({
            id: notification.id,
            userId: notification.userId,
            userName: notification.user.user.name,
            userImage:
                notification.user.profilePic ||
                "/placeholder.svg?height=40&width=40",
            toUserId: notification.toUserId,
            toUserName: notification.toUser?.user.name || null,
            message: notification.message,
            importanceLevel: notification.importanceLevel,
            notificationDate: notification.notificationDate.toISOString(),
            isRead: notification.isRead,
        }))

        return NextResponse.json(
            {
                notifications: formattedNotifications,
                total: totalNotifications,
                currentPage,
                totalPages: Math.ceil(totalNotifications / itemsPerPage),
            },
            { status: 200 }
        )
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(req: NextRequest) {
    await checkAuth()
    try {
        const body = await req.json()

        const bodyValidationRes = adminNotificationSchema.safeParse(body)
        if (!bodyValidationRes.success) {
            return NextResponse.json(
                { error: bodyValidationRes.error.flatten() },
                { status: 400 }
            )
        }

        const { sendToAll, userId, toUserId, message, importanceLevel } =
            bodyValidationRes.data

        if (userId === toUserId) {
            return NextResponse.json(
                {
                    error: "Sender and recipient cannot be the same",
                },
                { status: 400 }
            )
        }

        const senderProfile = await prisma.userProfile.findUnique({
            where: { userId: userId },
        })
        if (!senderProfile) {
            return NextResponse.json(
                { error: "Sender UserProfile does not exist" },
                { status: 400 }
            )
        }

        if (sendToAll) {
            const allUserProfiles = await prisma.userProfile.findMany({
                where: {
                    AND: [
                        {
                            user: { isActive: true },
                        },
                        {
                            id: { not: toUserId },
                        },
                    ],
                },
                select: { id: true },
            })

            const notifications = allUserProfiles.map(profile => ({
                userId: senderProfile.id,
                toUserId: profile.id,
                message,
                importanceLevel,
                notificationDate: new Date(),
                isRead: false,
            }))

            await prisma.notification.createMany({
                data: notifications,
            })

            return NextResponse.json(
                {
                    message: `Notifications sent to ${allUserProfiles.length} users`,
                },
                { status: 201 }
            )
        } else {
            let toUserProfileId = undefined
            if (toUserId && toUserId !== "none") {
                const recipientProfile = await prisma.userProfile.findFirst({
                    where: { userId: toUserId },
                })
                if (!recipientProfile) {
                    return NextResponse.json(
                        { error: "Recipient UserProfile does not exist" },
                        { status: 400 }
                    )
                }

                toUserProfileId = recipientProfile.id
            }

            const notification = await prisma.notification.create({
                data: {
                    userId: senderProfile.id,
                    toUserId: toUserProfileId,
                    message,
                    importanceLevel,
                    notificationDate: new Date(),
                    isRead: false,
                },
            })
            return NextResponse.json(notification, { status: 201 })
        }
    } catch (e) {
        logErrors(e)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

export async function PUT(req: NextRequest) {
    await checkAuth()

    const { notificationId: id } = Object.fromEntries(
        req.nextUrl.searchParams
    ) as {
        notificationId?: string
    }
    if (!id) {
        return NextResponse.json(
            { error: "Notification ID is required for update" },
            { status: 400 }
        )
    }

    try {
        const body = await req.json()

        const bodyValidationRes = adminNotificationSchema.safeParse(body)
        if (!bodyValidationRes.success) {
            return NextResponse.json(
                { error: bodyValidationRes.error.flatten() },
                { status: 400 }
            )
        }

        const { sendToAll, userId, toUserId, message, importanceLevel } =
            bodyValidationRes.data

        if (sendToAll) {
            return NextResponse.json(
                { error: "Send to all is not supported for updates" },
                { status: 400 }
            )
        }

        const senderProfile = await prisma.userProfile.findUnique({
            where: { id: userId },
        })
        if (!senderProfile) {
            return NextResponse.json(
                { error: "Sender UserProfile does not exist" },
                { status: 400 }
            )
        }

        if (toUserId && toUserId !== "none") {
            const recipientProfile = await prisma.userProfile.findUnique({
                where: { id: toUserId },
            })
            if (!recipientProfile) {
                return NextResponse.json(
                    { error: "Recipient UserProfile does not exist" },
                    { status: 400 }
                )
            }
        }

        const updatedNotification = await prisma.notification.update({
            where: { id },
            data: {
                userId,
                toUserId: toUserId === "none" ? null : toUserId,
                message,
                importanceLevel,
            },
        })

        return NextResponse.json(updatedNotification, { status: 200 })
    } catch (error) {
        console.error("Error updating notification:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
