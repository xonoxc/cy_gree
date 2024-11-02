import { fetchWithConfig } from "@/config/fetch.config"
import { useEffect, useState } from "react"

interface IRequests {
    id: string
    amount_collected: string
    collection_date: string
}

interface IRequestsCollection {
    pending_requests: IRequests[]
    completed_requests: IRequests[]
}

export const useAgrent = (agendId: string) => {
    const [requests, setPendingRequests] = useState<IRequestsCollection>({
        pending_requests: [],
        completed_requests: [],
    })
    const totalWasteCollected = requests.completed_requests.reduce(
        (acc, curr) => acc + Number(curr.amount_collected),
        0
    )

    const fetchAgentRequests = async () => {
        try {
            const response = await fetchWithConfig(`/agent/${agendId}/history`)

            if (response.status === 200) {
                const jsonResponse = await response.json()
                setPendingRequests(jsonResponse)
            }
        } catch (error) {
            throw error || "Error fetching agent requests"
        }
    }

    const updateRequestStatus = async (collectionId: string) => {
        try {
            const response = await fetchWithConfig(
                `/agent/${agendId}/claim?collection_id=${collectionId}`,
                {
                    method: "POST",
                }
            )

            if (response.status === 200) {
                const updatedStatus =
                    await acceptCollectionRequest(collectionId)
                if (!updatedStatus) {
                    throw new Error("Cannot update request status")
                }
                await fetchAgentRequests()
            }
        } catch (error) {
            console.error("error updating request status", error)
            return false
        }
    }

    const acceptCollectionRequest = async (collectionId: string) => {
        try {
            const response = await fetchWithConfig(
                `/agent/${agendId}/collect?collection_id=${collectionId}`,
                {
                    method: "PATCH",
                }
            )

            if (response.status === 200) {
                return true
            }
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        fetchAgentRequests()
    }, [])

    return { requests, updateRequestStatus, totalWasteCollected }
}
