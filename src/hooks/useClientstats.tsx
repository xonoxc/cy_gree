
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type ClientStatsContextType = {
	/**
	 * Errors
	 */
	isfetchProfileDataError: boolean
	isfetchUserBadgesError: boolean
	isfetchRequestsError: boolean
	isfetchClaimedRewardsError: boolean
	isfetchAvailableRewards: boolean

	/**
	 * loading states
	 */
	isProfileDataLoading: boolean
	isUserBadgesLoading: boolean
	isRequestsLoading: boolean
	isLoadingClaimedRewards: boolean
	isAvailableRewardsLoading: boolean

	/**
	 * data
	 */
	userData: IUserData | undefined
	requestsData: IRequestsData
	userBadges: IUserbadge[] | undefined
	availableRewards: IAvailableRewards[] | [] | undefined
	claimedRewards: IClaimedRewards[] | undefined

	/**
	 * functions
	 */
	handleInputChange: (
		e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
	) => void
	handleCollectionCreate: (args: { amount_collected: string, picture: string }) => void
	handleClaimReward: (rewardId: string) => void
	handleProfileUpdate: (avatar?: string) => void
	formData: IUserData | null
}

export type IRequestsData =
	| {
		unclaimed_requests: ICollection[] | []
		pending_requests: ICollection[] | []
		completed_requests: ICollection[] | []
	}
	| undefined

export type DefiniteIRequestsData = Exclude<IRequestsData, undefined>


export interface IUserData {
	profilePic: string
	user: {
		id: number
		name: string
		email: string
	}
	phoneNumber: string
	email: string
	address: string
	totalPlasticRecycled: string
	city: string
	state: string
	country: string
	earnedPoints: string
}

export interface ICollection {
	amount: string
	createdAt: string
}

export interface IAvailableRewards {
	id: string
	title: string
	pointsRequired: number
}

export interface IClaimedRewards {
	id: string
	reward: {
		title: string
	}
	claimedDate: string
}

export interface IUserbadge {
	name: string
	issue_date: string
}

const ClientStatsContext = createContext<ClientStatsContextType | null>(null)

export const ClientStatsProvider = ({
	children,
	userId,
}: {
	children: React.ReactNode
	userId: string | undefined
}) => {
	const [formData, setFormData] = useState<IUserData | null>(null)

	const queryClient = useQueryClient()

	const {
		data: userData = {
			profilePic: "",
			user: {
				id: 0,
				name: "",
				email: "",
			},
			phoneNumber: "",
			email: "",
			address: "",
			totalPlasticRecycled: "",
			city: "",
			state: "",
			country: "",
			earnedPoints: "",
		},
		isError: isfetchProfileDataError,
		isLoading: isProfileDataLoading,
	} = useQuery<IUserData>({
		queryKey: ["client", userId, "data"],
		queryFn: async () => {
			const response = await fetch(`/api/profile/${userId}`, {
				method: "GET",
			})
			if (!response.ok) throw new Error("Failed to fetch user data")

			const jsonResponse = await response.json()

			return jsonResponse
		},
		enabled: !!userId,
	})


	const {
		data: requestsData = {
			unclaimed_requests: [],
			pending_requests: [],
			completed_requests: [],
		},
		isError: isfetchRequestsError,
		isLoading: isRequestsLoading,
	} = useQuery<{
		unclaimed_requests: ICollection[] | []
		pending_requests: ICollection[] | []
		completed_requests: ICollection[] | []
	}>({
		queryKey: ["client", userId, "history"],
		queryFn: async () => {
			const response = await fetch(`/api/client/${userId}/history`)

			if (!response.ok) throw new Error("Failed to fetch user history")

			return await response.json()
		},
		enabled: !!userId,
	})

	const {
		data: userBadges = [],
		isError: isfetchUserBadgesError,
		isLoading: isUserBadgesLoading,
	} = useQuery<IUserbadge[] | []>({
		queryKey: ["client", userId, "badges"],
		queryFn: async () => {
			const result = await fetch(`/api/client/${userId}/badges`)

			if (!result.ok) throw new Error("Failed to fetch user badges")

			return await result.json()
		},
	})

	const {
		data: availableRewards = [],
		isError: isfetchAvailableRewards,
		isLoading: isAvailableRewardsLoading,
	} = useQuery<IAvailableRewards[] | []>({
		queryKey: ["client", userId, "availableRewards"],
		queryFn: async () => {
			const result = await fetch(`/api/client/${userId}/rewards`)

			if (!result.ok)
				throw new Error("Failed to fetch user availableRewads")

			return result.json()
		},
		enabled: !!userId,
	})

	const {
		data: claimedRewards = [],
		isError: isfetchClaimedRewardsError,
		isLoading: isLoadingClaimedRewards,
	} = useQuery<IClaimedRewards[]>({
		queryKey: ["client", userId, "claimedRewards"],
		queryFn: async () => {
			const result = await fetch(`/api/client/${userId}/rewards/history`)

			if (!result.ok) throw new Error("Failed to fetch claimed rewards")

			const jsonResponse = await result.json()

			return jsonResponse.claimedRewards
		},
		enabled: !!userId,
	})

	const handelClaimReward = async (rewardId: string) => {
		const result = await fetch(
			`/api/client/${userId}/rewards/${rewardId}/claim`,
			{
				method: "POST",
			}
		)

		return result.status === 200
	}

	const claimRewardMutation = useMutation({
		mutationFn: handelClaimReward,
		onMutate: async (rewardId: string) => {
			/* cancel the queries  */
			await Promise.all([
				queryClient.cancelQueries({
					queryKey: ["client", userId, "availableRewards"],
				}),
				queryClient.cancelQueries({
					queryKey: ["client", userId, "claimedRewards"],
				}),
				queryClient.cancelQueries({
					queryKey: ["client", userId, "data"],
				}),
			])

			/*fetch previous data states */
			const previousAvailableRewards = queryClient.getQueryData([
				"client",
				userId,
				"availableRewards",
			]) as IAvailableRewards[]
			const previousClaimedRewards = queryClient.getQueryData([
				"client",
				userId,
				"claimedRewards",
			]) as IClaimedRewards[]
			const previousUserProfile = queryClient.getQueryData([
				"client",
				userId,
				"data",
			]) as IUserData

			/* update data */
			const targetReward = previousAvailableRewards.find(
				reward => reward.id === rewardId
			) as IAvailableRewards
			const restAvailableRewards = previousAvailableRewards.filter(
				reward => reward.id !== rewardId
			)
			const updatedClaimedRewards = [
				...previousClaimedRewards,
				{
					id: targetReward.id,
					reward: {
						title: targetReward.title,
					},
					claimedDate: new Date().toISOString(),
				},
			]

			const remainingPoints =
				parseInt(previousUserProfile.earnedPoints) -
				targetReward.pointsRequired

			queryClient.setQueryData(
				["client", userId, "availableRewards"],
				restAvailableRewards
			)
			queryClient.setQueryData(
				["client", userId, "claimedRewards"],
				updatedClaimedRewards
			)
			queryClient.setQueryData(["client", userId, "data"], {
				...previousUserProfile,
				earnedPoints: remainingPoints.toString(),
			})

			/* returning data to the  context for rollback */
			return {
				previousUserProfile,
				previousClaimedRewards,
				previousAvailableRewards,
			}
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(
				["client", userId, "availableRewards"],
				context?.previousAvailableRewards
			)
			queryClient.setQueryData(
				["client", userId, "claimedRewards"],
				context?.previousClaimedRewards
			)
			queryClient.setQueryData(
				["client", userId, "data"],
				context?.previousUserProfile
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["client", userId, "availableRewards"],
			})
			queryClient.invalidateQueries({
				queryKey: ["client", userId, "claimedRewards"],
			})
			queryClient.invalidateQueries({
				queryKey: ["client", userId, "data"],
			})
		},
	})

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
	) => {
		let name: string
		let value: string

		if ("target" in e) {
			name = e.target.name
			value = e.target.value
		} else {
			name = e.name
			value = e.value
		}

		setFormData(prev => (prev ? { ...prev, [name]: value } : prev))
	}

	const handleProfileUpdate = useMutation({
		mutationFn: async (avatar?: string) => {
			if (formData && avatar) formData.profilePic = avatar

			await fetch(`/api/profile/${userId}`, {
				method: "PATCH",
				body: JSON.stringify({
					...formData,
				}),
			})
		},
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ["client", userId, "data"],
			})

			const previousData = queryClient.getQueryData<IUserData | null>([
				"client",
				userId,
				"data",
			])

			queryClient.setQueryData(["client", userId, "data"], {
				...previousData,
				...formData,
			})

			return { previousData }
		},
		onError: (_, __, context) => {
			queryClient.setQueryData(
				["client", userId, "data"],
				context?.previousData
			)
		},
	})

	const collectionCreate = async ({ amount_collected, picture }: { amount_collected: string, picture: string }) => {
		console.log(
			"Mutating with amount_collected:",
			amount_collected,
			"pic:",
			picture
		)
		if (!picture) throw new Error("Picture is required for creating collection")

		const response = await fetch(`/api/client/${userId}/collection`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				amount_collected,
				pic: picture,
			}),
		})
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error(
				"Failed to create collection:",
				response.status,
				errorData
			)
			throw new Error(
				`Failed to create collection: ${response.status} ${errorData.error || "Unknown error"}`
			)
		}
	}

	const handleCollectionCreate = useMutation({
		mutationFn: collectionCreate,
		onMutate: async ({ amount_collected }: { amount_collected: string, picture: string }) => {
			await queryClient.cancelQueries({
				queryKey: ["client", userId, "history"],
			})

			const previousData = queryClient.getQueryData<DefiniteIRequestsData>([
				"client",
				userId,
				"history",
			])


			queryClient.setQueryData<DefiniteIRequestsData>(["client", userId, "history"], {
				...previousData as DefiniteIRequestsData,
				unclaimed_requests: [
					...(previousData?.unclaimed_requests || []),
					{
						amount: amount_collected,
						createdAt: new Date().toISOString(),
					},

				]
			})


			return { previousData }
		},
		onError: (err, __, context) => {
			console.log("error while creating collection:", err.message)
			queryClient.setQueryData(
				["client", userId, "history"],
				context?.previousData
			)
		},
	})

	const memoizedUserData = useMemo(() => userData, [userData?.user.id])

	useEffect(() => {
		if (memoizedUserData) setFormData(memoizedUserData)
	}, [memoizedUserData])

	const contextValue: ClientStatsContextType = {
		isfetchProfileDataError,
		isfetchUserBadgesError,
		isfetchRequestsError,
		isfetchClaimedRewardsError,
		isfetchAvailableRewards,
		isProfileDataLoading,
		isUserBadgesLoading,
		isRequestsLoading,
		isLoadingClaimedRewards,
		isAvailableRewardsLoading,
		userData,
		formData,
		requestsData,
		userBadges,
		availableRewards,
		claimedRewards,
		handleInputChange,
		handleCollectionCreate: handleCollectionCreate.mutate,
		handleClaimReward: claimRewardMutation.mutate,
		handleProfileUpdate: handleProfileUpdate.mutate,
	}

	return (
		<ClientStatsContext.Provider value={contextValue}>
			{children}
		</ClientStatsContext.Provider>
	)
}

export const useClientstats = () => {
	const context = useContext(ClientStatsContext)
	if (!context) {
		throw new Error(
			"useClientstats must be used within a ClientStatsProvider"
		)
	}

	return context
}
