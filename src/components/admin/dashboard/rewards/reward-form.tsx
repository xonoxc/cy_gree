"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Gift, Tag, Percent } from "lucide-react"

// Mock data for users
const users = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Mike Johnson" },
    { id: "user4", name: "Sarah Williams" },
    { id: "user5", name: "David Brown" },
]

// Mock data for available rewards
const availableRewards = [
    {
        id: "reward1",
        title: "10% Discount Coupon",
        pointsRequired: 500,
        rewardType: "Gift_Coupon",
    },
    {
        id: "reward2",
        title: "₹100 Cashback",
        pointsRequired: 1000,
        rewardType: "Cash",
    },
    {
        id: "reward3",
        title: "Free Eco-friendly Bag",
        pointsRequired: 750,
        rewardType: "Gift_Coupon",
    },
    {
        id: "reward4",
        title: "Buy 1 Get 1 Free",
        pointsRequired: 1200,
        rewardType: "Offer",
    },
    {
        id: "reward5",
        title: "₹250 Cashback",
        pointsRequired: 2000,
        rewardType: "Cash",
    },
]

const formSchema = z.object({
    userId: z.string({
        required_error: "Please select a user.",
    }),
    rewardId: z.string({
        required_error: "Please select a reward.",
    }),
})

export function RewardForm({ reward }: { reward?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [userPoints, setUserPoints] = useState<number>(0)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: reward?.userId || "",
            rewardId: reward?.rewardId || "",
        },
    })

    // Watch for userId changes to update available points
    const watchedUserId = form.watch("userId")
    if (watchedUserId !== selectedUser) {
        setSelectedUser(watchedUserId)
        // In a real app, you would fetch the user's points from your API
        // For now, we'll simulate it with random points between 500 and 3000
        setUserPoints(Math.floor(Math.random() * 2500) + 500)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const selectedReward = availableRewards.find(
            r => r.id === values.rewardId
        )

        if (selectedReward && userPoints < selectedReward.pointsRequired) {
            toast({
                title: "Insufficient points",
                description: `User does not have enough points to claim this reward. Required: ${selectedReward.pointsRequired}, Available: ${userPoints}`,
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Here you would normally send the data to your API
            console.log(values)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: reward ? "Claimed reward updated" : "Reward claimed",
                description: reward
                    ? "The claimed reward has been updated successfully."
                    : "The reward has been claimed successfully.",
            })

            router.push("/dashboard/rewards")
        } catch (e) {
            toast({
                title: "Something went wrong.",
                description:
                    "Your reward claim was not processed. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
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

    // Format reward type for display
    const formatRewardType = (type: string) => {
        return type.replace(/_/g, " ")
    }

    // Check if user has enough points for a reward
    const canClaimReward = (pointsRequired: number) => {
        return userPoints >= pointsRequired
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a user" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The user who is claiming this reward.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {selectedUser && (
                            <div className="rounded-lg border p-4 bg-muted/20">
                                <h3 className="font-medium mb-2">
                                    User Points
                                </h3>
                                <div className="text-2xl font-bold">
                                    {userPoints.toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Available points for{" "}
                                    {
                                        users.find(u => u.id === selectedUser)
                                            ?.name
                                    }
                                </p>
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name="rewardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reward</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a reward" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableRewards.map(reward => {
                                                const typeDetails =
                                                    getTypeDetails(
                                                        reward.rewardType
                                                    )
                                                const isClaimable =
                                                    canClaimReward(
                                                        reward.pointsRequired
                                                    )

                                                return (
                                                    <SelectItem
                                                        key={reward.id}
                                                        value={reward.id}
                                                        disabled={
                                                            !isClaimable &&
                                                            !field.value
                                                        }
                                                    >
                                                        <div className="flex items-center justify-between w-full">
                                                            <div className="flex items-center">
                                                                <Badge
                                                                    variant={
                                                                        typeDetails.variant as any
                                                                    }
                                                                    className="flex items-center mr-2"
                                                                >
                                                                    {
                                                                        typeDetails.icon
                                                                    }
                                                                    {formatRewardType(
                                                                        reward.rewardType
                                                                    )}
                                                                </Badge>
                                                                <span>
                                                                    {
                                                                        reward.title
                                                                    }
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-xs ${isClaimable ? "text-green-500" : "text-red-500"}`}
                                                            >
                                                                {
                                                                    reward.pointsRequired
                                                                }{" "}
                                                                pts
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The reward that the user is claiming.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch("rewardId") && (
                            <div className="rounded-lg border p-4 bg-muted/20">
                                <h3 className="font-medium mb-2">
                                    Reward Details
                                </h3>
                                {(() => {
                                    const selectedReward =
                                        availableRewards.find(
                                            r => r.id === form.watch("rewardId")
                                        )
                                    if (!selectedReward) return null

                                    const typeDetails = getTypeDetails(
                                        selectedReward.rewardType
                                    )
                                    const isClaimable = canClaimReward(
                                        selectedReward.pointsRequired
                                    )

                                    return (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Badge
                                                        variant={
                                                            typeDetails.variant as any
                                                        }
                                                        className="flex items-center mr-2"
                                                    >
                                                        {typeDetails.icon}
                                                        {formatRewardType(
                                                            selectedReward.rewardType
                                                        )}
                                                    </Badge>
                                                    <span className="font-semibold">
                                                        {selectedReward.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Points Required:
                                                </span>
                                                <span
                                                    className={`font-medium ${isClaimable ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {selectedReward.pointsRequired.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    User Points:
                                                </span>
                                                <span className="font-medium">
                                                    {userPoints.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">
                                                    Points After Claim:
                                                </span>
                                                <span className="font-medium">
                                                    {Math.max(
                                                        0,
                                                        userPoints -
                                                            selectedReward.pointsRequired
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                            {!isClaimable && (
                                                <div className="text-xs text-red-500 font-medium mt-2">
                                                    User does not have enough
                                                    points to claim this reward.
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard/rewards")}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isLoading ||
                                !form.watch("userId") ||
                                !form.watch("rewardId") ||
                                (() => {
                                    const selectedReward =
                                        availableRewards.find(
                                            r => r.id === form.watch("rewardId")
                                        )
                                    return (
                                        selectedReward &&
                                        !canClaimReward(
                                            selectedReward.pointsRequired
                                        )
                                    )
                                })()
                            }
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Processing...
                                </span>
                            ) : reward ? (
                                "Update Claimed Reward"
                            ) : (
                                "Claim Reward"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
