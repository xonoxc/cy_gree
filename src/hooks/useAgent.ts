import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface IRequests {
    id: string
    amount: string
    createdAt: string
}

interface IRequestsCollection {
    pending_requests: IRequests[]
    claimed_requests: IRequests[]
}

export const useAgent = (agentId: string | undefined) => {
    const queryClient = useQueryClient()

    const {
        data: requests = { pending_requests: [], claimed_requests: [] },
        isLoading: isLoadingRequests,
        isError: isErrorRequests,
    } = useQuery<IRequestsCollection>({
        queryKey: ["agentRequests", agentId],
        queryFn: async () => {
            const response = await fetch(`/api/agent/${agentId}/history`)
            if (!response.ok) throw new Error("Error fetching agent requests")
            const jsonResponse = await response.json()
            return jsonResponse
        },
        enabled: !!agentId,
    })

    const {
        data: matches = [],
        isLoading: isLoadingMatches,
        isError: isErrorMatches,
    } = useQuery<IRequests[]>({
        queryKey: ["agentMatches", agentId],
        queryFn: async () => {
            const response = await fetch(`/api/agent/${agentId}/requests`)
            if (!response.ok) throw new Error("Error fetching matches")
            return response.json()
        },
        enabled: !!agentId,
    })

    console.log("requests", requests)

    const totalWasteCollected = requests.claimed_requests.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0
    )

    const updateRequestStatus = useMutation({
        mutationFn: async (collectionId: string) => {
            const response = await fetch(
                `/api/agent/${agentId}/claim?collection_id=${collectionId}`,
                { method: "POST" }
            )
            if (!response.ok) throw new Error("Failed to update request status")
            return response
        },
        onMutate: async collectionId => {
            await queryClient.cancelQueries({
                queryKey: ["agentMatches", agentId],
            })
            await queryClient.cancelQueries({
                queryKey: ["agentRequests", agentId],
            })
            const previousMatches = queryClient.getQueryData<IRequests[]>([
                "agentMatches",
                agentId,
            ])
            const previousRequests =
                queryClient.getQueryData<IRequestsCollection>([
                    "agentRequests",
                    agentId,
                ])
            const requestToMove = matches.find(req => req.id === collectionId)

            if (requestToMove) {
                queryClient.setQueryData(
                    ["agentMatches", agentId],
                    matches.filter(req => req.id !== collectionId)
                )
                queryClient.setQueryData(["agentRequests", agentId], {
                    ...previousRequests,
                    pending_requests: [
                        ...(previousRequests?.pending_requests || []),
                        requestToMove,
                    ],
                })
            }
            return { previousMatches, previousRequests, requestToMove }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(
                ["agentMatches", agentId],
                context?.previousMatches
            )
            queryClient.setQueryData(
                ["agentRequests", agentId],
                context?.previousRequests
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["agentMatches", agentId],
            })
            queryClient.invalidateQueries({
                queryKey: ["agentRequests", agentId],
            })
        },
    })

    const acceptCollectionRequest = useMutation({
        mutationFn: async (collectionId: string) => {
            const response = await fetch(
                `/api/agent/${agentId}/collect?collection_id=${collectionId}`,
                { method: "PATCH" }
            )
            if (!response.ok) throw new Error("Failed to accept collection")
            return true
        },
        onMutate: async collectionId => {
            await queryClient.cancelQueries({
                queryKey: ["agentRequests", agentId],
            })
            const previousRequests =
                queryClient.getQueryData<IRequestsCollection>([
                    "agentRequests",
                    agentId,
                ])
            const requestToComplete = requests.pending_requests.find(
                req => req.id === collectionId
            )

            if (requestToComplete) {
                queryClient.setQueryData(["agentRequests", agentId], {
                    pending_requests: requests.pending_requests.filter(
                        req => req.id !== collectionId
                    ),
                    completed_requests: [
                        ...requests.claimed_requests,
                        requestToComplete,
                    ],
                })
            }
            return { previousRequests, requestToComplete }
        },
        onError: (_, __, context) => {
            queryClient.setQueryData(
                ["agentRequests", agentId],
                context?.previousRequests
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["agentRequests", agentId],
            })
        },
    })

    return {
        requests,
        updateRequestStatus: updateRequestStatus.mutate,
        totalWasteCollected,
        matches,
        acceptCollectionRequest: acceptCollectionRequest.mutate,
        isError: isErrorRequests || isErrorMatches,
        isLoading: isLoadingRequests || isLoadingMatches,
    }
}
