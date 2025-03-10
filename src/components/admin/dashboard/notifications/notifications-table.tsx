"use client"

import { useState } from "react"
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

// Mock data
const notifications = [
    {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        userImage: "/placeholder.svg?height=40&width=40&text=JD",
        toUserId: null,
        toUserName: null,
        message: "Your plastic collection has been approved.",
        importanceLevel: "Medium",
        notificationDate: "2023-06-15T10:30:00.000Z",
        isRead: true,
    },
    {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        userImage: "/placeholder.svg?height=40&width=40&text=JS",
        toUserId: "user3",
        toUserName: "Mike Johnson",
        message: "You have earned a new badge: Eco Warrior!",
        importanceLevel: "High",
        notificationDate: "2023-06-14T15:45:00.000Z",
        isRead: false,
    },
    {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        userImage: "/placeholder.svg?height=40&width=40&text=MJ",
        toUserId: null,
        toUserName: null,
        message: "Your reward has been processed.",
        importanceLevel: "Low",
        notificationDate: "2023-06-13T09:20:00.000Z",
        isRead: true,
    },
    {
        id: "4",
        userId: "user4",
        userName: "Sarah Williams",
        userImage: "/placeholder.svg?height=40&width=40&text=SW",
        toUserId: null,
        toUserName: null,
        message: "System maintenance scheduled for tomorrow.",
        importanceLevel: "High",
        notificationDate: "2023-06-12T14:10:00.000Z",
        isRead: false,
    },
    {
        id: "5",
        userId: "user5",
        userName: "David Brown",
        userImage: "/placeholder.svg?height=40&width=40&text=DB",
        toUserId: "user1",
        toUserName: "John Doe",
        message: "New plastic collection request submitted.",
        importanceLevel: "Medium",
        notificationDate: "2023-06-11T11:30:00.000Z",
        isRead: true,
    },
]

export function NotificationsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [importanceFilter, setImportanceFilter] = useState("all")
    const [readFilter, setReadFilter] = useState("all")

    const itemsPerPage = 10

    // Filter notifications based on search query, importance level, and read status
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch =
            notification.message
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (notification.userName &&
                notification.userName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (notification.toUserName &&
                notification.toUserName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))

        const matchesImportance =
            importanceFilter === "all" ||
            importanceFilter === notification.importanceLevel

        const matchesReadStatus =
            readFilter === "all" ||
            (readFilter === "read" && notification.isRead) ||
            (readFilter === "unread" && !notification.isRead)

        return matchesSearch && matchesImportance && matchesReadStatus
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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

    // Format date to relative time
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        )

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
        }

        const diffInHours = Math.floor(diffInMinutes / 60)
        if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
        }

        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 30) {
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
        }

        return date.toLocaleDateString()
    }

    return (
        <div className="space-y-4">
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
                        onValueChange={setImportanceFilter}
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
                        {paginatedNotifications.length > 0 ? (
                            paginatedNotifications.map(notification => {
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
                                                            ?.split(" ")
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
                                            {formatRelativeTime(
                                                notification.notificationDate
                                            )}
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
                                                        <DropdownMenuItem>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Mark as Read
                                                        </DropdownMenuItem>
                                                    )}
                                                    {notification.isRead && (
                                                        <DropdownMenuItem>
                                                            <Bell className="mr-2 h-4 w-4" />
                                                            Mark as Unread
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-destructive">
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
            {filteredNotifications.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            filteredNotifications.length,
                            (currentPage - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            filteredNotifications.length,
                            currentPage * itemsPerPage
                        )}{" "}
                        of {filteredNotifications.length} notifications
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
