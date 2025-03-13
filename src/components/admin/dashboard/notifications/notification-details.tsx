"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Loader2,
    Bell,
    AlertCircle,
    AlertTriangle,
    User,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Mock notification data
const mockNotification = {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userImage: "/placeholder.svg?height=100&width=100&text=JD",
    toUserId: null,
    toUserName: null,
    message: "Your plastic collection has been approved.",
    importanceLevel: "Medium",
    notificationDate: "2023-06-15T10:30:00.000Z",
    isRead: true,
    readDate: "2023-06-15T10:35:00.000Z",
}

export function NotificationDetails({
    notificationId,
}: {
    notificationId: string
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [notification, setNotification] = useState<any>(null)

    useEffect(() => {
        // Simulate API call to fetch notification data
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // In a real app, you would fetch data from your API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Set mock data
                setNotification(mockNotification)
            } catch (error) {
                console.error("Error fetching notification data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [notificationId])

    const handleToggleReadStatus = async () => {
        setIsUpdating(true)
        try {
            // In a real app, you would call your API to update the notification
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Update local state
            setNotification({
                ...notification,
                isRead: !notification.isRead,
                readDate: notification.isRead ? null : new Date().toISOString(),
            })

            toast({
                title: notification.isRead
                    ? "Marked as unread"
                    : "Marked as read",
                description: `The notification has been marked as ${notification.isRead ? "unread" : "read"}.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Failed to update the notification. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteNotification = async () => {
        if (
            !confirm(
                "Are you sure you want to delete this notification? This action cannot be undone."
            )
        ) {
            return
        }

        setIsUpdating(true)
        try {
            // In a real app, you would call your API to delete the notification
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: "Notification deleted",
                description: "The notification has been successfully deleted.",
            })

            router.push("/dashboard/notifications")
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Failed to delete the notification. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading notification data...
                    </p>
                </div>
            </Card>
        )
    }

    if (!notification) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Bell className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">
                        Notification Not Found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        The notification you are looking for does not exist or
                        has been deleted.
                    </p>
                </div>
            </Card>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Importance level badge variant and icon
    const getImportanceDetails = (level: string) => {
        switch (level) {
            case "Low":
                return {
                    variant: "outline",
                    icon: <Bell className="h-4 w-4 mr-1" />,
                }
            case "Medium":
                return {
                    variant: "warning",
                    icon: <AlertCircle className="h-4 w-4 mr-1" />,
                }
            case "High":
                return {
                    variant: "destructive",
                    icon: <AlertTriangle className="h-4 w-4 mr-1" />,
                }
            default:
                return { variant: "secondary", icon: null }
        }
    }

    const importanceDetails = getImportanceDetails(notification.importanceLevel)

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={notification.userImage}
                                        alt={notification.userName}
                                    />
                                    <AvatarFallback>
                                        {notification.userName
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {notification.userName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Sent{" "}
                                        {formatDate(
                                            notification.notificationDate
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Badge
                                variant={importanceDetails.variant as any}
                                className="flex items-center"
                            >
                                {importanceDetails.icon}
                                {notification.importanceLevel}
                            </Badge>
                        </div>

                        {notification.toUserName && (
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    To: {notification.toUserName}
                                </span>
                            </div>
                        )}

                        <div className="bg-muted p-4 rounded-md">
                            <p className="text-lg">{notification.message}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                {notification.isRead ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Read{" "}
                                            {notification.readDate
                                                ? formatDate(
                                                      notification.readDate
                                                  )
                                                : ""}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Bell className="h-4 w-4 mr-1 text-blue-500" />
                                        <span className="text-sm text-blue-500 font-medium">
                                            Unread
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            onClick={handleToggleReadStatus}
                            disabled={isUpdating}
                            className="flex-1"
                        >
                            {isUpdating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : notification.isRead ? (
                                <Bell className="mr-2 h-4 w-4" />
                            ) : (
                                <CheckCircle className="mr-2 h-4 w-4" />
                            )}
                            {notification.isRead
                                ? "Mark as Unread"
                                : "Mark as Read"}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleDeleteNotification}
                            disabled={isUpdating}
                            className="flex-1"
                        >
                            {isUpdating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <XCircle className="mr-2 h-4 w-4" />
                            )}
                            Delete Notification
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
