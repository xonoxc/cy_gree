import { fetchWithConfig } from "@/config/fetch.config"
import { useEffect, useState } from "react"
import authStore from "@/store/token"

interface IUserData {
    profile_pic: string
    user: number
    name: string
    phone_number: string
    email: string
    address: string
    total_plastic_recycled: string
    earned_points: number
}

interface ICollection {
    amount_collected: number
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

export const useClientstats = () => {
    const [userData, setUserData] = useState<IUserData>({
        profile_pic: "",
        user: -1,
        phone_number: "",
        email: "",
        name: "",
        address: "",
        total_plastic_recycled: "",
        earned_points: 0,
    })
    const [userBadges, setUserBadges] = useState([])
    const [collectedPlastic, setCollectedPlastic] = useState<ICollection[]>([])
    const [unclaimedRequests, setUnclaimedRequests] = useState<ICollection[]>(
        []
    )
    const [pendingRequests, setPendingRequests] = useState<any[]>([])

    const [availableRewards, setAvailableRewards] = useState<
        IAvailableRewards[] | []
    >([])
    const [claimedRewards, setClaimedRewards] = useState<IClaimedRewards[]>([])

    const fetchUserProfileData = async () => {
        const response = await fetchWithConfig(
            `/profile/${authStore.getState().id}`,
            {
                method: "GET",
            }
        )

        if (response.status === 200) {
            const json = await response.json()

            setUserData(prev => ({
                ...prev,
                name: json.user.username,
                user: json.user.id,
                phone_number: json.phone_number,
                email: json.user.email,
                address: json.address,
                profile_pic: json.profile_pic,
                total_plastic_recycled: json.total_plastic_recycled,
                earned_points: json.earned_points,
            }))
        }
    }

    const fetchCollectionHistory = async () => {
        const response = await fetchWithConfig(
            `/client/${authStore.getState().id}/history`
        )

        if (response.status === 200) {
            const jsonResponse = await response.json()

            setCollectedPlastic(jsonResponse.completed_requests || [])
            setUnclaimedRequests(jsonResponse.unclaimed_requests || [])
            setPendingRequests(jsonResponse.pending_requests || [])
        }
    }

    const fetchUserBadges = async () => {
        const result = await fetchWithConfig(
            `/client/${authStore.getState().id}/badges`
        )
        if (result.status === 200) {
            const json = await result.json()
            setUserBadges(prev => ({ ...prev, json }))
        }
    }

    const fetchAvailableRewards = async () => {
        const result = await fetchWithConfig(
            `/client/${authStore.getState().id}/rewards`
        )
        const jsonResponse = await result.json()
        setAvailableRewards(jsonResponse)
    }

    const fetchClaimedRewards = async () => {
        const result = await fetchWithConfig(
            `/client/${authStore.getState().id}/rewards/history`
        )

        if (result.status === 200) {
            const jsonResponse = await result.json()
            setClaimedRewards(jsonResponse)
        }
    }

    const handelClaimReward = async (rewardId: string, expense: number) => {
        const result = await fetchWithConfig(
            `/client/${authStore.getState().id}/rewards/${rewardId}/claim`,
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
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleProfileUpdate = async (file?: File | Blob | undefined) => {
        try {
            const formData = new FormData()

            const data = {
                ...userData,
            }

            formData.append("pic", file as File)
            formData.append("data", JSON.stringify(data))

            const result = await fetchWithConfig(
                `/profile/${authStore.getState().id}`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (result.status === 200) {
                const json = await result.json()
                setUserData(prev => ({
                    ...prev,
                    ...json.user,
                }))
                return result
            } else {
                const error = await result.json()
                throw new Error(error.message || "Profile update failed")
            }
        } catch (error) {
            throw error
        }
    }

    const handleCollectionCreate = async (
        amount_collected: number,
        pic?: File | null
    ) => {
        const formDataToSend = new FormData()

        formDataToSend.append("pic", pic as File)

        try {
            const response = await fetchWithConfig(
                `/client/${authStore.getState().id}/collection?amount_collected=${encodeURIComponent(amount_collected)}`,
                {
                    method: "POST",
                    body: formDataToSend,
                }
            )
            if (response.status === 200) {
                console.log("Form submitted successfully")

                return true
            }
            return false
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        fetchUserProfileData()
        fetchUserBadges()
        fetchCollectionHistory()
        fetchAvailableRewards()
        fetchClaimedRewards()
    }, [])

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
