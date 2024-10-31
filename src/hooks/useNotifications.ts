import { fetchWithConfig } from "@/config/fetch.config"
import { useEffect, useState } from "react"

interface Notification {
    id: string
    message: string
    notification_date: string
    is_read: boolean
}

export const useNotifications = (userId: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const unreadCount = notifications.filter(noti => !noti.is_read).length

    const markAsRead = async (id: string) => {
        try {
            const statusResponse = await fetchWithConfig(
                `/notifications/${userId}/read?notification_id=${id}`,
                {
                    method: "PATCH",
                }
            )

            if (statusResponse.status === 200) {
                setNotifications(prevNotifications =>
                    prevNotifications.filter(noti => noti.id !== id)
                )
            }
        } catch (error) {
            console.error("erorr while updating notifications", error)
        }
    }

    const markAllAsRead = () => {
        console.log("marked all as read")
    }

    const fetchInitialNotifications = async () => {
        try {
            const response = await fetchWithConfig(`/notifications/${userId}`)

            if (response.status === 200) {
                const jsonResponse = await response.json()

                setNotifications(jsonResponse)
            }
        } catch (error) {
            console.error("Error fetching initial notifications", error)
        }
    }

    useEffect(() => {
        fetchInitialNotifications()
    }, [])

    return {
        markAsRead,
        markAllAsRead,
        notifications,
        unreadCount,
    }
}
