"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, ReactNode } from "react"

interface IRequests {
    id: string
    amount: string
    createdAt: string
}

interface IRequestsCollection {
    claimedRequests: IRequests[]
    collectedRequests: IRequests[]
}

/**
 *  context type of the agent context hook
 */
interface AgentContextType {
    requests: IRequestsCollection
    updateRequestStatus: any
    totalWasteCollected: number
    matches: IRequests[]
    acceptCollectionRequest: any
    isError: boolean
    isLoading: boolean
}

const AgentContext = createContext<AgentContextType | null>(null)

/**
 * Context Provider that will wrap the layout
 */
export const AgentProvider = ({
    children,
    agentId,
}: {
    children: ReactNode
    agentId: string | undefined
}) => {
    const queryClient = useQueryClient()

    const {
        data: requests = { claimedRequests: [], collectedRequests: [] },
        isLoading: isLoadingRequests,
        isError: isErrorRequests,
    } = useQuery<IRequestsCollection>({
        queryKey: ["agentRequests", agentId],
        queryFn: async () => {
            const response = await fetch(`/api/agent/${agentId}/history`)
            if (!response.ok) throw new Error("Error fetching agent requests")
            return response.json()
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

    const totalWasteCollected = requests.collectedRequests.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0
    )

    const updateRequestStatusMutation = useMutation({
        mutationFn: async (collectionId: string) => {
            const response = await fetch(
                `/api/agent/${agentId}/claim?collection_id=${collectionId}`,
                { method: "POST" }
            )
            if (!response.ok) throw new Error("Failed to update request status")
            return response
        },
        onMutate: async collectionId => {
            await Promise.all([
                queryClient.cancelQueries({
                    queryKey: ["agentMatches", agentId],
                }),

                queryClient.cancelQueries({
                    queryKey: ["agentRequests", agentId],
                }),
            ])

            const previousMatches = queryClient.getQueryData<IRequests[]>([
                "agentMatches",
                agentId,
            ]) as IRequests[]

            const previousRequests =
                queryClient.getQueryData<IRequestsCollection>([
                    "agentRequests",
                    agentId,
                ]) as IRequestsCollection

            const requestToMove = previousMatches.find(
                req => req.id === collectionId
            )

            queryClient.setQueryData<IRequests[]>(
                ["agentMatches", agentId],
                previousMatches.filter(req => req.id !== collectionId)
            )

            queryClient.setQueryData<IRequestsCollection>(
                ["agentRequests", agentId],
                {
                    ...previousRequests,
                    claimedRequests: [
                        ...(previousRequests?.claimedRequests || []),
                        requestToMove as IRequests,
                    ],
                }
            )

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

    const acceptCollectionRequestMutation = useMutation({
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
                ]) as IRequestsCollection

            const requestToComplete = previousRequests.claimedRequests.find(
                req => req.id === collectionId
            )

            queryClient.setQueryData<IRequestsCollection>(
                ["agentRequests", agentId],
                {
                    claimedRequests: previousRequests.claimedRequests.filter(
                        req => req.id !== collectionId
                    ),
                    collectedRequests: [
                        ...previousRequests?.collectedRequests,
                        requestToComplete as IRequests,
                    ],
                }
            )

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

    const contextValue: AgentContextType = {
        requests,
        updateRequestStatus: updateRequestStatusMutation.mutate,
        totalWasteCollected,
        matches,
        acceptCollectionRequest: acceptCollectionRequestMutation.mutate,
        isError: isErrorRequests || isErrorMatches,
        isLoading: isLoadingRequests || isLoadingMatches,
    }

    return (
        <AgentContext.Provider value={contextValue}>
            {children}
        </AgentContext.Provider>
    )
}

/**
 * useAgent hook
 */
export const useAgent = () => {
    const context = useContext(AgentContext)
    if (!context) {
        throw new Error("useAgent must be used within an AgentProvider")
    }
    return context
}
