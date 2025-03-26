"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Gift, Tag, Percent, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

type RewardType = "Gift_Coupon" | "Cash" | "Offer"

interface Reward {
    id: string
    title: string
    pointsRequired: number
    issuedDate: string
    rewardType: RewardType
    totalClaimed: number
}

interface Claim {
    id: string
    userId: string
    userName: string
    claimedDate: string
}

export type ApiResponse = { reward: Reward; claims: Claim[] }

/**
 * dynamic component time
 */

const Time = dynamic(() => import("@/components/time"), {
    ssr: false,
    loading: () => <Skeleton className="h-4 w-1/2" />,
})

export function ListRewardDetails({ rewardId }: { rewardId: string }) {
    const {
        data: rewardData,
        isLoading,
        isError,
        error,
    } = useQuery<ApiResponse>({
        queryKey: ["reward", rewardId],
        queryFn: async () => {
            const response = await fetch(`/api/admin/list-rewards/${rewardId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch reward")
            }
            return response.json()
        },
        enabled: !!rewardId,
    })

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading reward data...
                    </p>
                </div>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Gift className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">Reward Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        <p>{error.message}</p>
                    </p>
                </div>
            </Card>
        )
    }

    const typeDetails = getTypeDetails(rewardData?.reward.rewardType as string)

    return (
        <div className="space-y-6 w-full">
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                {rewardData?.reward.title}
                            </h2>
                            <Badge
                                variant={typeDetails.variant as any}
                                className="flex items-center"
                            >
                                {typeDetails.icon}
                                {rewardData?.reward.rewardType.replace(
                                    /_/g,
                                    " "
                                )}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Points Required
                                </div>
                                <div className="text-xl font-bold">
                                    {rewardData?.reward.pointsRequired.toLocaleString()}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Issued Date
                                </div>
                                <div className="font-medium">
                                    <Time
                                        timeStamp={
                                            rewardData?.reward
                                                .issuedDate as string
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">
                                    {rewardData?.reward.totalClaimed} users
                                    claimed this reward
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="claims" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="claims">Claims</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="claims" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Claims</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {rewardData && rewardData?.claims.length > 0 ? (
                                <div className="space-y-4">
                                    {rewardData?.claims.map(claim => (
                                        <div
                                            key={claim.id}
                                            className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {claim.userName}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Claimed on{" "}
                                                    <Time
                                                        timeStamp={
                                                            claim.claimedDate
                                                        }
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No claims found for this reward.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reward Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-1">
                                        Total Claims
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {rewardData?.reward.totalClaimed}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">
                                        Points Exchanged
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {rewardData &&
                                            (
                                                rewardData?.reward
                                                    .totalClaimed *
                                                rewardData?.reward
                                                    .pointsRequired
                                            ).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">
                                        Average Claims per Day
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {rewardData &&
                                            (
                                                rewardData?.reward
                                                    .totalClaimed /
                                                Math.max(
                                                    1,
                                                    Math.floor(
                                                        (new Date().getTime() -
                                                            new Date(
                                                                rewardData.reward.issuedDate
                                                            ).getTime()) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24)
                                                    )
                                                )
                                            ).toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">
                                        Days Active
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {rewardData &&
                                            Math.floor(
                                                (new Date().getTime() -
                                                    new Date(
                                                        rewardData?.reward
                                                            .issuedDate as string
                                                    ).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                            )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const getTypeDetails = (type: string) => {
    switch (type) {
        case "Gift_Coupon":
            return {
                variant: "default",
                icon: <Gift className="h-4 w-4 mr-1" />,
            }
        case "Cash":
            return {
                variant: "success",
                icon: <Tag className="h-4 w-4 mr-1" />,
            }
        case "Offer":
            return {
                variant: "warning",
                icon: <Percent className="h-4 w-4 mr-1" />,
            }
        default:
            return { variant: "secondary", icon: null }
    }
}
