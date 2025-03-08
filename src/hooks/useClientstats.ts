import { RequestStatus } from "@/types/requests.status"
import { useCallback, useEffect, useState } from "react"

interface IUserData {
    profilePic: string
    user: number
    name: string
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

export const useClientstats = (userId: string | undefined) => {
    const [loading, setLoading] = useState<RequestStatus>("pending")

    const [userData, setUserData] = useState<IUserData>({
        profilePic: "",
        user: -1,
        phoneNumber: "",
        email: "",
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        totalPlasticRecycled: "",
        earnedPoints: "",
    })
    const [userBadges, setUserBadges] = useState<IUserbadge[]>([])

    const [collectedPlastic, setCollectedPlastic] = useState<ICollection[]>([])
    const [unclaimedRequests, setUnclaimedRequests] = useState<ICollection[]>(
        []
    )
    const [pendingRequests, setPendingRequests] = useState<any[]>([])
    const [availableRewards, setAvailableRewards] = useState<
        IAvailableRewards[] | []
    >([])
    const [claimedRewards, setClaimedRewards] = useState<IClaimedRewards[]>([])

    const fetchUserProfileData = useCallback(async () => {
        const response = await fetch(`/api/profile/${userId}`, {
            method: "GET",
        })

        if (response.status === 200) {
            const json = await response.json()

            console.log("user data from api", json)

            setUserData(prev => ({
                ...prev,
                name: json.user.username,
                user: json.user.id,
                phoneNumber: json.phoneNumber,
                email: json.user.email,
                address: json.address,
                state: json.state,
                country: json.country,
                city: json.city,
                profilePic: json.profilePic,
                totalPlasticRecycled: json.totalPlasticRecycled,
                earned_points: json.earnedPoints,
            }))
        }
    }, [userId])

    const fetchCollectionHistory = useCallback(async () => {
        const response = await fetch(`/api/client/${userId}/history`)

        if (response.status === 200) {
            const jsonResponse = await response.json()

            console.log("collection history response", jsonResponse)

            setCollectedPlastic(jsonResponse.completed_requests || [])
            setUnclaimedRequests(jsonResponse.unclaimed_requests || [])
            setPendingRequests(jsonResponse.pending_requests || [])
        }
    }, [userId])

    const fetchUserBadges = useCallback(async () => {
        const result = await fetch(`/api/client/${userId}/badges`)
        if (result.status === 200) {
            const json = await result.json()
            setUserBadges(json)
        }
    }, [userId])

    const fetchAvailableRewards = useCallback(async () => {
        const result = await fetch(`/api/client/${userId}/rewards`)
        const jsonResponse = await result.json()
        setAvailableRewards(jsonResponse)
    }, [userId])

    const fetchClaimedRewards = useCallback(async () => {
        const result = await fetch(`/api/client/${userId}/rewards/history`)

        if (result.status === 200) {
            const jsonResponse = (await result.json()) as {
                claimedRewards: IClaimedRewards[]
            }
            setClaimedRewards(jsonResponse.claimedRewards)
        }
    }, [userId])

    const handelClaimReward = useCallback(
        async (rewardId: string, expense: number) => {
            const result = await fetch(
                `/api/client/${userId}/rewards/${rewardId}/claim`,
                {
                    method: "POST",
                }
            )
            if (result.status === 200) {
                await fetchAvailableRewards()
                await fetchClaimedRewards()
                setUserData(prev => ({
                    ...prev,
                    earned_points: +prev.earnedPoints - expense,
                }))
            }
        },
        []
    )

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target
            setUserData(prevData => ({ ...prevData, [name]: value }))
        },
        []
    )

    const handleProfileUpdate = useCallback(
        async (pic: string | undefined) => {
            try {
                await updateEmailId(userId as string)

                const result = await fetch(`/api/profile/${userId}`, {
                    method: "POST",
                    body: JSON.stringify({
                        ...userData,
                    }),
                })

                if (result.status === 200) {
                    const json = await result.json()
                    return json
                } else {
                    const error = await result.json()
                    throw new Error(error.message || "Profile update failed")
                }
            } catch (error) {
                setLoading("error")
                throw error
            }
        },
        [userId]
    )

    const updateEmailId = useCallback(
        async (userId: string) => {
            try {
                const response = await fetch(`/api/user/${userId}`, {
                    method: "PATCH",
                    body: JSON.stringify({ email: userData.email }),
                })

                if (response.status === 200) {
                    const jsonResponse = await response.json()
                    setUserData(prev => ({
                        ...prev,
                        email: jsonResponse.email,
                    }))
                }
            } catch (error: any) {
                setLoading("error")
                throw new Error(error.message || "Error updating emailId")
            }
        },
        [userId]
    )

    const handleCollectionCreate = useCallback(
        async (amount_collected: string, pic?: string | null) => {
            try {
                const response = await fetch(
                    `/api/client/${userId}/collection`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            amount_collected,
                            pic,
                        }),
                    }
                )
                if (response.status === 201) {
                    await fetchCollectionHistory()
                    return true
                }
                return false
            } catch (error) {
                setLoading("error")
                throw error
            }
        },
        []
    )

    useEffect(() => {
        if (!userId) return
        ;(async () => {
            try {
                await Promise.all([
                    fetchUserProfileData(),
                    fetchUserBadges(),
                    fetchCollectionHistory(),
                    fetchAvailableRewards(),
                    fetchClaimedRewards(),
                ])
                setLoading("success")
            } catch (error) {
                setLoading("error")
            }
        })()
    }, [userId])

    return {
        userData,
        pendingRequests,
        collectedPlastic,
        unclaimedRequests,
        handleInputChange,
        claimedRewards,
        fetchUserProfileData,
        availableRewards,
        handelClaimReward,
        handleProfileUpdate,
        userBadges,
        loading,
        handleCollectionCreate,
    }
}
