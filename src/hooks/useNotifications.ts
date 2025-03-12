import { useCallback, useEffect, useState } from "react"

interface Notification {
    id: string
    message: string
    notification_date: string
    is_read: boolean
}

export const useNotifications = (userId: string | undefined) => {
    const [notifications, setNotifications] = useState<Notification[] | []>([])
    const [loading, setLoading] = useState<boolean>(false)

    const unreadCount = notifications.filter(noti => !noti.is_read).length

    const fetchInitialNotifications = useCallback(async () => {
        if (!userId) return
        try {
            setLoading(true)
            const response = await fetch(`/api/notifications/${userId}`)

            if (response.status === 200) {
                const jsonResponse = (await response.json()) as {
                    notifications: Notification[] | []
                }

                setNotifications(jsonResponse.notifications)
            }
        } catch (e) {
            console.error("Error fetching initial notifications", e)
        } finally {
            setLoading(false)
        }
    }, [userId])

    const markAsRead = useCallback(
        async (id: string) => {
            if (!userId) return
            try {
                setLoading(true)
                const statusResponse = await fetch(
                    `/api/notifications/${userId}/read?notification_id=${id}`,
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
            } catch (e) {
                console.error("erorr while updating notifications", e)
            } finally {
                setLoading(false)
            }
        },
        [userId]
    )

    const markAllAsRead = useCallback(async () => {
        if (!userId) return
        try {
            setLoading(true)
            const response = await fetch(
                `/api/notifications/${userId}/read/all`,
                {
                    method: "PATCH",
                }
            )

            if (response.status === 200) {
                setNotifications([])
                await fetchInitialNotifications()
            }
        } catch (e) {
            console.log("error while updating notifications", e)
        } finally {
            setLoading(false)
        }
    }, [userId])

    const sendNotification = useCallback(async () => {
        if (!userId) return
        try {
            const response = await fetch(`/api/notifications/${userId}/send`)

            if (response.status === 200) {
                return true
            }

            return false
        } catch (e) {
            console.error("Error while sending notification", e)
            return false
        }
    }, [userId])

    useEffect(() => {
        ;(async () => {
            await fetchInitialNotifications()
        })()
    }, [userId])

    return {
        markAsRead,
        markAllAsRead,
        notifications,
        unreadCount,
        loading,
        sendNotification,
    }
}
