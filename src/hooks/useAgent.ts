import { useCallback, useEffect, useState } from "react"

interface IRequests {
    id: string
    amount_collected: string
    collection_date: string
}

interface IRequestsCollection {
    pending_requests: IRequests[]
    completed_requests: IRequests[]
}

export const useAgent = (agentId: string | undefined) => {
    const [requests, setPendingRequests] = useState<IRequestsCollection>({
        pending_requests: [],
        completed_requests: [],
    })
    const [matches, setMatches] = useState<IRequests[]>([])

    const totalWasteCollected = requests.completed_requests.reduce(
        (acc, curr) => acc + Number(curr.amount_collected),
        0
    )

    const fetchAgentRequests = useCallback(async () => {
        try {
            const response = await fetch(`/api/agent/${agentId}/history`)
            if (response.status === 200) {
                const jsonResponse = await response.json()
                setPendingRequests(jsonResponse)
            }
        } catch (error) {
            throw error || "Error fetching agent requests"
        }
    }, [agentId])

    const updateRequestStatus = useCallback(
        async (collectionId: string) => {
            const requestToMove = matches.find(req => req.id === collectionId)
            if (!requestToMove) return

            setMatches(prev => prev.filter(req => req.id !== collectionId))
            setPendingRequests(prev => ({
                ...prev,
                pending_requests: [...prev.pending_requests, requestToMove],
            }))

            try {
                const response = await fetch(
                    `/api/agent/${agentId}/claim?collection_id=${collectionId}`,
                    {
                        method: "POST",
                    }
                )
                if (response.status !== 200) {
                    setPendingRequests(prev => ({
                        ...prev,
                        pending_requests: prev.pending_requests.filter(
                            req => req.id !== collectionId
                        ),
                    }))
                    setMatches(prev => [...prev, requestToMove])
                }
            } catch (error) {
                setPendingRequests(prev => ({
                    ...prev,
                    pending_requests: prev.pending_requests.filter(
                        req => req.id !== collectionId
                    ),
                }))
                setMatches(prev => [...prev, requestToMove])
                console.error("error updating request status", error)
                return false
            }
        },
        [agentId]
    )

    const listCollections = useCallback(async () => {
        try {
            const result = await fetch(`/api/agent/${agentId}/requests`, {
                method: "GET",
            })
            if (result.status === 200) {
                const jsonResponse = await result.json()
                setMatches(jsonResponse)
            }
        } catch (error) {
            console.error("Error while listing requests", error)
        }
    }, [agentId])

    const acceptCollectionRequest = useCallback(
        async (collectionId: string) => {
            const requestToComplete = requests.pending_requests.find(
                req => req.id === collectionId
            )
            if (!requestToComplete) return

            setPendingRequests(prev => ({
                pending_requests: prev.pending_requests.filter(
                    req => req.id !== collectionId
                ),
                completed_requests: [
                    ...prev.completed_requests,
                    requestToComplete,
                ],
            }))

            try {
                const response = await fetch(
                    `/api/agent/${agentId}/collect?collection_id=${collectionId}`,
                    {
                        method: "PATCH",
                    }
                )
                if (response.status !== 200) {
                    setPendingRequests(prev => ({
                        pending_requests: [
                            ...prev.pending_requests,
                            requestToComplete,
                        ],
                        completed_requests: prev.completed_requests.filter(
                            req => req.id !== collectionId
                        ),
                    }))
                }
                return true
            } catch (error) {
                setPendingRequests(prev => ({
                    pending_requests: [
                        ...prev.pending_requests,
                        requestToComplete,
                    ],
                    completed_requests: prev.completed_requests.filter(
                        req => req.id !== collectionId
                    ),
                }))
                throw error
            }
        },
        [agentId]
    )

    useEffect(() => {
        if (!agentId) return
        fetchAgentRequests()
        listCollections()
    }, [])

    return {
        requests,
        updateRequestStatus,
        totalWasteCollected,
        matches,
        acceptCollectionRequest,
    }
}
