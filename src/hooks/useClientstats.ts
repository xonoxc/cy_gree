import { useCallback, useEffect, useState } from "react"

interface IUserData {
    profile_pic: string
    user: number
    name: string
    phone_number: string
    email: string
    address: string
    total_plastic_recycled: string
    city: string
    state: string
    country: string
    earned_points: number
}

interface ICollection {
    amount_collected: string
    collection_date: string
}

interface IAvailableRewards {
    id: string
    name: string
    points_required: number
}

interface IClaimedRewards {
    id: number
    title: string
    claimed_date: string
}

interface IUserbadge {
    name: string
    issue_date: string
}

export const useClientstats = (userId: string | undefined) => {
    const [userData, setUserData] = useState<IUserData>({
        profile_pic: "",
        user: -1,
        phone_number: "",
        email: "",
        name: "",
        address: "",
        city: "",
        state: "",
        country: "",
        total_plastic_recycled: "",
        earned_points: 0,
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

            setUserData(prev => ({
                ...prev,
                name: json.user.username,
                user: json.user.id,
                phone_number: json.phone_number,
                email: json.user.email,
                address: json.address,
                state: json.state,
                country: json.country,
                city: json.city,
                profile_pic: json.profile_pic,
                total_plastic_recycled: json.total_plastic_recycled,
                earned_points: json.earned_points,
            }))
        }
    }, [userId])

    const fetchCollectionHistory = useCallback(async () => {
        const response = await fetch(`/api/client/${userId}/history`)

        if (response.status === 200) {
            const jsonResponse = await response.json()

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
            const jsonResponse = await result.json()
            setClaimedRewards(jsonResponse)
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
                    earned_points: prev.earned_points - expense,
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
        async (file?: File | Blob | undefined) => {
            try {
                const formData = new FormData()

                if (file && file instanceof File) {
                    formData.append("pic", file as File, file.name)
                }

                await updateEmailId(userId as string)

                formData.append("data", JSON.stringify({ ...userData }))

                const result = await fetch(`/api/profile/${userId}`, {
                    method: "POST",
                    body: formData,
                })

                if (result.status === 200) {
                    const json = await result.json()
                    return json
                } else {
                    const error = await result.json()
                    throw new Error(error.message || "Profile update failed")
                }
            } catch (error) {
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
                if (response.status === 200) {
                    const jsonResponse = await response.json()
                    console.log("Form submitted successfully", jsonResponse)

                    return true
                }
                return false
            } catch (error) {
                throw error
            }
        },
        []
    )

    useEffect(() => {
        if (!userId) return
        fetchUserProfileData()
        fetchUserBadges()
        fetchCollectionHistory()
        fetchAvailableRewards()
        fetchClaimedRewards()
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
        handleCollectionCreate,
    }
}
