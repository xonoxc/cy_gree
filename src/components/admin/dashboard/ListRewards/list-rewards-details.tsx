"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Gift, Tag, Percent, Users } from "lucide-react"

// Mock reward data
const mockReward = {
    id: "1",
    title: "10% Discount Coupon",
    description:
        "Get 10% off on your next purchase at our partner stores. Valid for all products.",
    pointsRequired: 500,
    issuedDate: "2023-05-15T00:00:00.000Z",
    rewardType: "Gift_Coupon",
    expiryDays: 30,
    isActive: true,
    totalClaimed: 24,
}

// Mock claims data
const mockClaims = [
    {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        claimedDate: "2023-06-15T10:30:00.000Z",
    },
    {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        claimedDate: "2023-06-10T14:20:00.000Z",
    },
    {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        claimedDate: "2023-06-05T09:15:00.000Z",
    },
    {
        id: "4",
        userId: "user4",
        userName: "Sarah Williams",
        claimedDate: "2023-06-01T16:45:00.000Z",
    },
    {
        id: "5",
        userId: "user5",
        userName: "David Brown",
        claimedDate: "2023-05-28T11:30:00.000Z",
    },
]

export function ListRewardDetails({ rewardId }: { rewardId: string }) {
    const [isLoading, setIsLoading] = useState(true)
    const [reward, setReward] = useState<any>(null)
    const [claims, setClaims] = useState<any[]>([])

    useEffect(() => {
        // Simulate API call to fetch reward data
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // In a real app, you would fetch data from your API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Set mock data
                setReward(mockReward)
                setClaims(mockClaims)
            } catch (error) {
                console.error("Error fetching reward data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [rewardId])

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

    if (!reward) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Gift className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">Reward Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        The reward you are looking for does not exist or has
                        been deleted.
                    </p>
                </div>
            </Card>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    // Type badge variant and icon
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

    const typeDetails = getTypeDetails(reward.rewardType)

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                {reward.title}
                            </h2>
                            <Badge
                                variant={typeDetails.variant as any}
                                className="flex items-center"
                            >
                                {typeDetails.icon}
                                {reward.rewardType.replace(/_/g, " ")}
                            </Badge>
                        </div>

                        <div className="text-muted-foreground">
                            {reward.description}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Points Required
                                </div>
                                <div className="text-xl font-bold">
                                    {reward.pointsRequired.toLocaleString()}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Issued Date
                                </div>
                                <div className="font-medium">
                                    {formatDate(reward.issuedDate)}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">
                                    Expiry
                                </div>
                                <div className="font-medium">
                                    {reward.expiryDays > 0
                                        ? `${reward.expiryDays} days after claiming`
                                        : "No expiry"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">
                                    {reward.totalClaimed} users claimed this
                                    reward
                                </span>
                            </div>

                            <Badge
                                variant={
                                    reward.isActive ? "default" : "destructive"
                                }
                            >
                                {reward.isActive ? "Active" : "Inactive"}
                            </Badge>
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
                            {claims.length > 0 ? (
                                <div className="space-y-4">
                                    {claims.map(claim => (
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
                                                    {formatDate(
                                                        claim.claimedDate
                                                    )}
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
                                        {reward.totalClaimed}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">
                                        Points Exchanged
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {(
                                            reward.totalClaimed *
                                            reward.pointsRequired
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">
                                        Average Claims per Day
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {(
                                            reward.totalClaimed /
                                            Math.max(
                                                1,
                                                Math.floor(
                                                    (new Date().getTime() -
                                                        new Date(
                                                            reward.issuedDate
                                                        ).getTime()) /
                                                        (1000 * 60 * 60 * 24)
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
                                        {Math.floor(
                                            (new Date().getTime() -
                                                new Date(
                                                    reward.issuedDate
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
