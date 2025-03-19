"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"

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
    handleCollectionCreate: any
    handelClaimReward: (rewardId: string) => Promise<void>
    handleProfileUpdate: any
}

export type IRequestsData =
    | {
          unclaimed_requests: ICollection[] | []
          pending_requests: ICollection[] | []
          completed_requests: ICollection[] | []
      }
    | undefined

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
    name: string
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

            return await result.json()
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
        if (result.status === 200) {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["client", userId, "rewards"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["client", userId, "claimedRewards"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["client", userId, "data"],
                }),
            ])
        }
    }

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
        mutationFn: async () => {
            console.log("formData", formData)
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

    const handleCollectionCreate = useMutation({
        mutationFn: async (amount_collected: string, pic?: string | null) => {
            const response = await fetch(`/api/client/${userId}/collection`, {
                method: "POST",
                body: JSON.stringify({
                    amount_collected,
                    pic,
                }),
            })
            if (!response.ok) throw new Error("Failed to create collection")
        },
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: ["client", userId, "history"],
            })
            const previousData = queryClient.getQueryData<ICollection[]>([
                "client",
                userId,
                "history",
            ]) as ICollection[]

            queryClient.setQueryData(
                ["client", userId, "history"],
                [
                    ...previousData,
                    {
                        amount: formData?.totalPlasticRecycled,
                        createdAt: new Date().toISOString(),
                    },
                ]
            )
            return { previousData }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(
                ["client", userId, "history"],
                context?.previousData
            )
        },
    })

    useEffect(() => {
        if (userData) setFormData(userData)
    }, [userData])

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
        requestsData,
        userBadges,
        availableRewards,
        claimedRewards,
        handleInputChange,
        handleCollectionCreate: handleCollectionCreate.mutate,
        handelClaimReward,
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
