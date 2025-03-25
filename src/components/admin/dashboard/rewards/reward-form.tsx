"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import {
    Award,
    CheckCircle2,
    Coins,
    Loader2,
    ShieldAlert,
    User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { rwardFormValidationSchema as formSchema } from "@/utils/validation/rewards"
import type { IUserData } from "@/hooks/useClientstats"

async function claimReward(data: z.infer<typeof formSchema>) {
    const response = await fetch("/api/admin/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.message || "Failed to claim reward")
    }
    return result
}

export default function RewardForm() {
    const [users, setUsers] = useState<{ id: string; name: string }[]>([])
    const [availableRewards, setAvailableRewards] = useState<
        {
            id: string
            title: string
            pointsRequired: string
        }[]
    >([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    const router = useRouter()
    const { toast } = useToast()

    const claimRewardMutation = useMutation({
        mutationFn: claimReward,
        onSuccess: () => {
            toast({
                title: "Reward claimed successfully",
                description: "The reward has been added to the user's account.",
                variant: "default",
            })
            router.push("/admin/dashboard/rewards")
        },
        onError: error => {
            toast({
                title: "Claim failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Your reward claim was not processed. Please try again.",
                variant: "destructive",
            })
        },
    })

    const { isPending } = claimRewardMutation

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
            rewardId: "",
        },
    })

    const selectedUserId = form.watch("userId")
    const selectedRewardId = form.watch("rewardId")

    const { data: userProfile, isLoading: isLoadingProfile } =
        useQuery<IUserData>({
            queryKey: ["userProfile", selectedUserId],
            queryFn: async () => {
                const res = await fetch(`/api/profile/${selectedUserId}`)
                return res.json()
            },
            enabled: !!selectedUserId,
        })

    const userPoints = userProfile
        ? Number.parseInt(userProfile.earnedPoints)
        : 0

    const selectedReward = availableRewards.find(r => r.id === selectedRewardId)
    const requiredPoints = selectedReward
        ? Number.parseInt(selectedReward.pointsRequired)
        : 0
    const canClaimReward = userPoints >= requiredPoints
    const pointsNeeded = requiredPoints - userPoints

    function onSubmit(values: z.infer<typeof formSchema>) {
        claimRewardMutation.mutate(values)
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true)
            try {
                const [usersResponse, rewardsResponse] = await Promise.all([
                    fetch("/api/user"),
                    fetch("/api/admin/rewards/available"),
                ])

                const usersData = await usersResponse.json()
                const rewardsData = await rewardsResponse.json()

                setUsers(usersData.users)
                setAvailableRewards(rewardsData.availableRewards)
            } catch (error) {
                console.error("Error fetching data:", error)
                toast({
                    title: "Error loading data",
                    description:
                        "Failed to load users or rewards. Please refresh the page.",
                    variant: "destructive",
                })
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchData()
    }, [toast])

    return (
        <Card className="w-full  mx-auto shadow-lg space-y-8">
            <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <CardTitle>Claim Reward</CardTitle>
                </div>
                <CardDescription>
                    Assign rewards to users based on their earned points
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-8  w-full">
                        {isLoadingData ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <FormField
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select User</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a user" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {users.map(user => (
                                                        <SelectItem
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4" />
                                                                <span>
                                                                    {user.name}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {selectedUserId && (
                                    <div className="rounded-2xl bg-muted p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Coins className="h-5 w-5 text-amber-500" />
                                            <span className="font-medium">
                                                Available Points
                                            </span>
                                        </div>
                                        {isLoadingProfile ? (
                                            <Skeleton className="h-6 w-16" />
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="text-sm font-bold"
                                            >
                                                {userPoints} points
                                            </Badge>
                                        )}
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="rewardId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Select Reward</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a reward" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {availableRewards.map(
                                                        reward => (
                                                            <SelectItem
                                                                key={reward.id}
                                                                value={
                                                                    reward.id
                                                                }
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>
                                                                        {
                                                                            reward.title
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="ml-2"
                                                                    >
                                                                        {
                                                                            reward.pointsRequired
                                                                        }{" "}
                                                                        points
                                                                    </Badge>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {selectedUserId &&
                                    selectedRewardId &&
                                    !isLoadingProfile && (
                                        <div
                                            className={`rounded-2xl p-3 flex items-center gap-2 ${canClaimReward ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}
                                        >
                                            {canClaimReward ? (
                                                <>
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    <span>
                                                        User has enough points
                                                        to claim this reward
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShieldAlert className="h-5 w-5" />
                                                    <span>
                                                        User needs{" "}
                                                        {pointsNeeded} more
                                                        points to claim this
                                                        reward
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                            </>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                isLoadingData ||
                                isLoadingProfile ||
                                !selectedUserId ||
                                !selectedRewardId ||
                                !canClaimReward
                            }
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Claim Reward
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
