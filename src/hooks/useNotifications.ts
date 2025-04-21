import { logErrors } from "@/utils/errors/errorLogs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

/**
 * this is a custom responsable for handling notification component details
 * @param userId string | undefined
 * notifications concerned about a perticular user with
 */

interface Notification {
	id: string
	message: string
	notification_date: string
	is_read: boolean
}

export const useNotifications = (userId: string | undefined) => {
	const queryClient = useQueryClient()

	const {
		data: notifications,
		isError: isNotificationsFetchError,
		isLoading: isNotificationsLoading,
		refetch: refetchNotifications,
	} = useQuery<Notification[] | []>({
		queryKey: ["notifications", userId],
		queryFn: async () => {
			const response = await fetch(`/api/notifications/${userId}`)

			if (!response.ok)
				throw new Error("Error fetching initial notifications")

			const jsonResponse = (await response.json()) as {
				notifications: Notification[] | []
			}

			return jsonResponse.notifications
		},
		enabled: !!userId,
	})

	let unreadCount = notifications?.filter(noti => !noti.is_read).length

	const markAsRead = useMutation({
		mutationFn: async (id: string) => {
			const statusResponse = await fetch(
				`/api/notifications/${userId}/read?notification_id=${id}`,
				{
					method: "PATCH",
				}
			)
			if (!statusResponse.ok)
				throw new Error("Error while updating notifications")
		},
		onMutate: async notificationId => {
			await queryClient.cancelQueries({
				queryKey: ["notifications", userId],
			})

			const previousNotifications = queryClient.getQueryData<
				Notification[] | []
			>(["notifications", userId])

			if (!previousNotifications || previousNotifications.length === 0)
				return
			const unreadNotifications = previousNotifications?.filter(
				noti => noti.id !== notificationId
			)

			queryClient.setQueryData<Notification[] | []>(
				["notifications", userId],
				unreadNotifications
			)

			if (unreadCount) {
				unreadCount = unreadCount - 1
			}

			return { previousNotifications }
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(
				["notifications", userId],
				context?.previousNotifications
			)
		},
	})

	const markAllAsRead = useMutation({
		mutationFn: async () => {
			if (!userId) return
			await fetch(`/api/notifications/${userId}/read/all`, {
				method: "PATCH",
			})
		},
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ["notifications", userId],
			})

			const previousNotifications = queryClient.getQueryData<
				Notification[] | []
			>(["notifications", userId])

			queryClient.setQueryData(["notifications", userId], [])

			unreadCount = 0

			return { previousNotifications }
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(
				["notifications", userId],
				context?.previousNotifications
			)
		},
	})

	/* probably simple enough that no need to use Query*/
	const sendNotification = async () => {
		if (!userId) return
		try {
			const response = await fetch(`/api/notifications/${userId}/send`)

			if (response.status === 200) {
				return true
			}

			return false
		} catch (e) {
			logErrors(e)
			return false
		}
	}

	return {
		markAsRead,
		markAllAsRead,
		notifications,
		unreadCount,
		isNotificationsFetchError,
		isNotificationsLoading,
		sendNotification,
		refetchNotifications,
	}
}
