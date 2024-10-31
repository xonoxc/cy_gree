"use client"

import { useState } from "react"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useNotifications } from "@/hooks/useNotifications"
import useTokenStore from "@/store/token"
import getRelativeTime from "@/utils/date"

export default function NotificationPopup() {
    const [open, setOpen] = useState(false)

    const { id: userId } = useTokenStore()

    const { unreadCount, markAllAsRead, markAsRead, notifications } =
        useNotifications(userId)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="rounded-lg">
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] rounded-xl">
                <Card>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </Button>
                    </div>
                    <ScrollArea className="h-[300px]">
                        {notifications.length === 0 ? (
                            <p className="text-center text-muted-foreground p-4">
                                No notifications
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {notifications.map(notification => (
                                    <li
                                        key={notification.id}
                                        className={`p-4 ${notification.is_read ? "bg-background" : "bg-muted"}`}
                                    >
                                        <div className="flex justify-between items-start flex-col">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {getRelativeTime(
                                                        notification.notification_date
                                                    )}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >
                                                    <Check size={20} /> Read
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </ScrollArea>
                </Card>
            </PopoverContent>
        </Popover>
    )
}
