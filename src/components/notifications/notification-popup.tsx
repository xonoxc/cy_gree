import { useState } from "react"
import { Bell, Check, Clock } from "lucide-react"
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

    const { unreadCount, markAllAsRead, markAsRead, notifications, loading } =
        useNotifications(userId)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full border-gray-700"
                >
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full dark:bg-white bg-black text-xs dark:text-black text-white border border-gray-700 flex items-center justify-center animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 rounded-xl border-gray-700">
                {loading ? (
                    <span>loading....</span>
                ) : (
                    <Card className="border-gray-700 bg-white dark:bg-black">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-100 dark:bg-black rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                <h2 className="text-lg font-semibold">
                                    Notifications
                                </h2>
                            </div>
                            {notifications.length > 0 && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                        <ScrollArea className="h-[400px]">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[200px] text-gray-100">
                                    <Bell className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-sm">
                                        No notifications yet
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-700">
                                    {notifications.map(notification => (
                                        <li
                                            key={notification.id}
                                            className={`p-4  duration-200 ${
                                                notification.is_read
                                                    ? "bg-white dark:bg-black"
                                                    : "bg-gray-100 dark:bg-muted"
                                            }`}
                                        >
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        <span className="text-xs">
                                                            {getRelativeTime(
                                                                notification.notification_date
                                                            )}
                                                        </span>
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
                                                            className="text-xs text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            <Check className="h-3 w-3 mr-1" />
                                                            Mark as read
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </ScrollArea>
                    </Card>
                )}
            </PopoverContent>
        </Popover>
    )
}
