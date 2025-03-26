"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Gift, Tag, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { listRewardFormSchema as formSchema } from "@/utils/validation/list-rewards"
import { useQueryClient } from "@tanstack/react-query"
import { ApiResponse } from "./list-rewards-details"

const formatRewardType = (type: string) => type.replace(/_/g, " ")

export function ListRewardForm({ rewardId }: { rewardId?: any }) {
    const queryClient = useQueryClient()

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            pointsRequired: 100,
            rewardType: "Gift_Coupon",
        },
    })

    useEffect(() => {
        ;(async () => {
            const res = await fetch(`/api/admin/list-rewards/${rewardId}`)
            if (!res.ok) {
                throw new Error("Failed to fetch reward")
            }
            const { reward } = (await res.json()) as ApiResponse

            if (reward) {
                form.reset({
                    title: reward.title,
                    pointsRequired: Number(reward.pointsRequired),
                    rewardType: reward.rewardType,
                })
            }
        })()
    }, [rewardId, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const method = rewardId ? "PATCH" : "POST"
            const url = rewardId
                ? `/api/admin/list-rewards/${rewardId}`
                : "/api/admin/list-rewards"
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error(
                    `Failed to ${rewardId ? "update" : "create"} reward`
                )
            }

            await queryClient.invalidateQueries({
                queryKey: ["list-rewards"],
            })

            toast({
                title: rewardId ? "Reward updated" : "Reward created",
                description: rewardId
                    ? "The reward has been updated successfully."
                    : "The reward has been created successfully.",
            })
            router.push("/admin/dashboard/list-rewards")
        } catch (e) {
            toast({
                title: "Something went wrong.",
                description: "Your reward was not saved. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reward Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="10% Discount Coupon"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pointsRequired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points Required</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            step="1"
                                            {...field}
                                        />
                                    </FormControl>
                                    symbol <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rewardType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reward Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a reward type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[
                                                "Gift_Coupon",
                                                "Cash",
                                                "Offer",
                                            ].map(type => {
                                                const { variant, icon } =
                                                    getTypeDetails(type)
                                                return (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={
                                                                    variant as any
                                                                }
                                                                className="flex items-center mr-2"
                                                            >
                                                                {icon}
                                                                {formatRewardType(
                                                                    type
                                                                )}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium mb-2">Reward Preview</h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    {form.watch("rewardType") && (
                                        <Badge
                                            variant={
                                                getTypeDetails(
                                                    form.watch("rewardType")
                                                ).variant as any
                                            }
                                            className="flex items-center mr-2"
                                        >
                                            {
                                                getTypeDetails(
                                                    form.watch("rewardType")
                                                ).icon
                                            }
                                            {formatRewardType(
                                                form.watch("rewardType")
                                            )}
                                        </Badge>
                                    )}
                                    <span className="font-semibold">
                                        {form.watch("title") || "Reward Title"}
                                    </span>
                                </div>
                                <div className="text-sm font-medium">
                                    Points required:{" "}
                                    {form.watch("pointsRequired") || 0}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push("/dashboard/list-rewards")
                            }
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Saving...
                                </span>
                            ) : rewardId ? (
                                "Update Reward"
                            ) : (
                                "Create Reward"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
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
