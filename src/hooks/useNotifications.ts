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
    const [loading, setLoading] = useState<boolean>(false)

    const unreadCount = notifications.filter(noti => !noti.is_read).length

    const markAsRead = async (id: string) => {
        try {
            setLoading(true)
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
                await fetchInitialNotifications()
            }
        } catch (error) {
            console.error("erorr while updating notifications", error)
        } finally {
            setLoading(false)
        }
    }

    const markAllAsRead = async () => {
        try {
            setLoading(true)
            const response = await fetchWithConfig(
                `/notifications/${userId}/read/all`,
                {
                    method: "PATCH",
                }
            )

            if (response.status === 200) {
                setNotifications([])
                await fetchInitialNotifications()
            }
        } catch (error) {
            console.log("error while updating notifications", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchInitialNotifications = async () => {
        try {
            setLoading(true)
            const response = await fetchWithConfig(`/notifications/${userId}`)

            if (response.status === 200) {
                const jsonResponse = await response.json()

                setNotifications(jsonResponse)
            }
        } catch (error) {
            console.error("Error fetching initial notifications", error)
        } finally {
            setLoading(false)
        }
    }

    const sendNotification = async (userId: string) => {
        try {
            const response = await fetchWithConfig(
                `/notifications/${userId}/send`
            )

            if (response.status === 200) {
                return true
            }

            return false
        } catch (error) {
            console.error("Error while sending notification", error)
            return false
        }
    }

    useEffect(() => {
        ;(async () => {
            await fetchInitialNotifications()
        })()
    }, [])

    return {
        markAsRead,
        markAllAsRead,
        notifications,
        unreadCount,
        loading,
        sendNotification,
    }
}
