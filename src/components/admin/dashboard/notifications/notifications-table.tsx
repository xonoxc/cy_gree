"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Search,
    Trash,
    Bell,
    CheckCircle,
    AlertTriangle,
    AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Time from "@/components/time"
import { ITEMS_PER_PAGE } from "@/constants/pagination"

interface Notification {
    id: string
    userId: string
    userName: string
    userImage: string
    toUserId: string | null
    toUserName: string | null
    message: string
    importanceLevel: string
    notificationDate: string
    isRead: boolean
}

interface ApiResponse {
    notifications: Notification[]
    total: number
    currentPage: number
    totalPages: number
}

export function NotificationsTable() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [importanceFilter, setImportanceFilter] = useState<string>("all")
    const [readFilter, setReadFilter] = useState<string>("all")

    const queryClient = useQueryClient()

    const getQueryKey = () => [
        "notifications",
        currentPage,
        searchQuery,
        importanceFilter,
        readFilter,
    ]

    const { data, isLoading, isError, error } = useQuery({
        queryKey: getQueryKey(),
        queryFn: () =>
            fetchNotifications({
                page: currentPage,
                search: searchQuery,
                importance: importanceFilter,
                read: readFilter,
                limit: ITEMS_PER_PAGE,
            }),
    })

    const notifications = data?.notifications || []
    const totalPages = data?.totalPages || 1
    const totalNotifications = data?.total || 0

    const deleteMutation = useMutation({
        mutationFn: handleDeleteNotification,
        onMutate: async (notificationId: string) => {
            const queryKey = getQueryKey()

            await queryClient.cancelQueries({ queryKey })

            const previousNotifications =
                queryClient.getQueryData<ApiResponse>(queryKey)

            if (previousNotifications) {
                const updatedNotifications =
                    previousNotifications.notifications.filter(
                        notification => notification.id !== notificationId
                    )

                queryClient.setQueryData(queryKey, {
                    ...previousNotifications,
                    notifications: updatedNotifications,
                    total: previousNotifications.total - 1,
                })
            }
            return {
                previousNotifications,
            }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(
                ["notifications"],
                context?.previousNotifications
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: getQueryKey() })
        },
    })

    const toggleReadStatusMutation = useMutation({
        mutationFn: toggleMarkRead,
        onMutate: async (notificationId: string) => {
            await queryClient.cancelQueries({ queryKey: getQueryKey() })

            const previousNotifications =
                queryClient.getQueryData<ApiResponse>(getQueryKey())

            if (!previousNotifications) return

            const modifiedNotifications =
                previousNotifications.notifications.map(notification => {
                    if (notification.id === notificationId) {
                        return { ...notification, isRead: !notification.isRead }
                    }
                    return notification
                })

            queryClient.setQueryData(getQueryKey(), {
                ...previousNotifications,
                notifications: modifiedNotifications,
            })

            return { previousNotifications }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(
                getQueryKey(),
                context?.previousNotifications
            )
        },
    })

    return (
        <div className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search notifications..."
                        className="w-full pl-8 bg-background"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Select
                        value={importanceFilter}
                        onValueChange={(value: string) =>
                            setImportanceFilter(value)
                        }
                    >
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Importance" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={readFilter} onValueChange={setReadFilter}>
                        <SelectTrigger className="w-full sm:w-36">
                            <SelectValue placeholder="Read Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="unread">Unread</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Importance</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : deleteMutation.isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    Error:
                                    {(deleteMutation.error as Error)?.message ||
                                        "Cannot delete notification. Please refresh to continue"}
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    Error:
                                    {(error as Error)?.message ||
                                        "Something went wrong"}
                                </TableCell>
                            </TableRow>
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => {
                                const importanceDetails = getImportanceDetails(
                                    notification.importanceLevel
                                )
                                return (
                                    <TableRow
                                        key={notification.id}
                                        className={
                                            notification.isRead
                                                ? ""
                                                : "bg-muted/20"
                                        }
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            notification.userImage
                                                        }
                                                        alt={
                                                            notification.userName
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {notification.userName
                                                            .split(" ")
                                                            .map(n => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {notification.userName}
                                                    </div>
                                                    {notification.toUserName && (
                                                        <div className="text-xs text-muted-foreground">
                                                            To:{" "}
                                                            {
                                                                notification.toUserName
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate">
                                            {notification.message}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    importanceDetails.variant as any
                                                }
                                                className="flex w-fit items-center"
                                            >
                                                {importanceDetails.icon}
                                                {notification.importanceLevel}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {notification.isRead ? (
                                                <span className="flex items-center text-muted-foreground">
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Read
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-blue-500 font-medium">
                                                    <Bell className="h-4 w-4 mr-1" />
                                                    Unread
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Time
                                                timeStamp={
                                                    notification.notificationDate
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {!notification.isRead && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                toggleReadStatusMutation.mutate(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark as Read
                                                        </DropdownMenuItem>
                                                    )}
                                                    {notification.isRead && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                toggleReadStatusMutation.mutate(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <Bell className="mr-2 h-4 w-4" />
                                                            Mark as Unread
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            deleteMutation.mutate(
                                                                notification.id
                                                            )
                                                        }
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    No notifications found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {notifications.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            totalNotifications,
                            (currentPage - 1) * ITEMS_PER_PAGE + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            totalNotifications,
                            currentPage * ITEMS_PER_PAGE
                        )}{" "}
                        of {totalNotifications} notifications
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

/* helping functions  */

async function fetchNotifications({
    page,
    search,
    importance,
    read,
    limit,
}: {
    page: number
    search: string
    importance: string
    read: string
    limit: number
}): Promise<ApiResponse> {
    const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        importance,
        read,
    })

    const response = await fetch(`/api/admin/notifications?${searchParams}`)
    if (!response.ok) {
        throw new Error("Failed to fetch notifications")
    }
    return response.json()
}

async function handleDeleteNotification(notificationId: string) {
    const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })
    console.log("delete Response", response)

    if (!response.ok) {
        throw new Error("Failed to delete notification")
    }

    return response.json()
}

async function toggleMarkRead(notificationId: string) {
    const response = await fetch(`/api/admin/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (!response.ok) {
        throw new Error("Failed to mark notification as read")
    }
}

function getImportanceDetails(level: string) {
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
