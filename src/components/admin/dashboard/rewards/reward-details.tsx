"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Gift, Tag, Percent, User, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock reward data
const mockReward = {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userImage: "/placeholder.svg?height=100&width=100&text=JD",
    rewardId: "reward1",
    rewardTitle: "10% Discount Coupon",
    rewardType: "Gift_Coupon",
    claimedDate: "2023-06-15T10:30:00.000Z",
    expiryDate: "2023-07-15T10:30:00.000Z",
    status: "Active",
    code: "DISC10-JD-123456",
    pointsSpent: 500,
}

export function RewardDetails({ rewardId }: { rewardId: string }) {
    const [isLoading, setIsLoading] = useState(true)
    const [reward, setReward] = useState<any>(null)

    useEffect(() => {
        // Simulate API call to fetch reward data
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // In a real app, you would fetch data from your API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Set mock data
                setReward(mockReward)
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
                    <h2 className="text-xl font-semibold">
                        Claimed Reward Not Found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        The claimed reward you are looking for does not exist or
                        has been deleted.
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
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    {reward.rewardTitle}
                                </h2>
                                <Badge
                                    variant={typeDetails.variant as any}
                                    className="flex items-center"
                                >
                                    {typeDetails.icon}
                                    {reward.rewardType.replace(/_/g, " ")}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={reward.userImage}
                                        alt={reward.userName}
                                    />
                                    <AvatarFallback>
                                        {reward.userName
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span className="font-medium">
                                            {reward.userName}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Claimed on{" "}
                                        {formatDate(reward.claimedDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Points Spent
                                    </div>
                                    <div className="text-xl font-bold">
                                        {reward.pointsSpent.toLocaleString()}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Status
                                    </div>
                                    <div className="flex items-center">
                                        <Badge
                                            variant={
                                                reward.status === "Active"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {reward.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {reward.expiryDate && (
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Expires On
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span className="font-medium">
                                            {formatDate(reward.expiryDate)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {reward.code && (
                                <div className="pt-2">
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Reward Code
                                    </div>
                                    <div className="bg-muted p-3 rounded-md font-mono text-center">
                                        {reward.code}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Reward Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {reward.rewardType === "Gift_Coupon" && (
                            <>
                                <p>To redeem this discount coupon:</p>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>
                                        Visit any of our partner stores or
                                        online shop.
                                    </li>
                                    <li>
                                        At checkout, provide the coupon code:{" "}
                                        <span className="font-mono font-bold">
                                            {reward.code}
                                        </span>
                                    </li>
                                    <li>
                                        The discount will be applied to your
                                        purchase.
                                    </li>
                                    <li>
                                        This coupon is valid until{" "}
                                        {formatDate(reward.expiryDate)}.
                                    </li>
                                </ol>
                            </>
                        )}

                        {reward.rewardType === "Cash" && (
                            <>
                                <p>To redeem this cashback reward:</p>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>
                                        The cashback amount will be credited to
                                        your account within 3-5 business days.
                                    </li>
                                    <li>
                                        You can use the cashback for future
                                        purchases or withdraw it to your bank
                                        account.
                                    </li>
                                    <li>
                                        For withdrawals, please visit the
                                        "Wallet" section in your profile.
                                    </li>
                                </ol>
                            </>
                        )}

                        {reward.rewardType === "Offer" && (
                            <>
                                <p>To redeem this special offer:</p>
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>
                                        Visit any of our partner stores or
                                        online shop.
                                    </li>
                                    <li>
                                        At checkout, provide the offer code:{" "}
                                        <span className="font-mono font-bold">
                                            {reward.code}
                                        </span>
                                    </li>
                                    <li>
                                        The special offer will be applied to
                                        your purchase.
                                    </li>
                                    <li>
                                        This offer is valid until{" "}
                                        {formatDate(reward.expiryDate)}.
                                    </li>
                                </ol>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
