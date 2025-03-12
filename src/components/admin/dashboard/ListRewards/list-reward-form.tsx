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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

const formSchema = z.object({
    title: z
        .string()
        .min(3, {
            message: "Title must be at least 3 characters.",
        })
        .max(100, {
            message: "Title must not exceed 100 characters.",
        }),
    description: z
        .string()
        .min(10, {
            message: "Description must be at least 10 characters.",
        })
        .optional(),
    pointsRequired: z.coerce.number().min(1, {
        message: "Points required must be at least 1.",
    }),
    rewardType: z.enum(["Gift_Coupon", "Cash", "Offer"], {
        required_error: "Please select a reward type.",
    }),
    expiryDays: z.coerce
        .number()
        .min(0, {
            message: "Expiry days must be 0 or greater.",
        })
        .optional(),
})

export function ListRewardForm({ reward }: { reward?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: reward?.title || "",
            description: reward?.description || "",
            pointsRequired: reward?.pointsRequired || 100,
            rewardType: reward?.rewardType || "Gift_Coupon",
            expiryDays: reward?.expiryDays || 30,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            // Here you would normally send the data to your API
            console.log(values)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: reward ? "Reward updated" : "Reward created",
                description: reward
                    ? "The reward has been updated successfully."
                    : "The reward has been created successfully.",
            })

            router.push("/dashboard/list-rewards")
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
                                    <FormDescription>
                                        A short, descriptive title for the
                                        reward.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Get 10% off on your next purchase at our partner stores."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Detailed description of the reward and
                                        how to use it.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                        <FormDescription>
                                            Number of points needed to claim
                                            this reward.
                                        </FormDescription>
                                        <FormMessage />
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
                                                    const typeDetails =
                                                        getTypeDetails(type)
                                                    return (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
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
                                                                        type
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The type of reward being offered.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="expiryDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Days</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Number of days until the reward expires
                                        after being claimed. Set to 0 for no
                                        expiry.
                                    </FormDescription>
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
                                <p className="text-sm text-muted-foreground">
                                    {form.watch("description") ||
                                        "Reward description will appear here."}
                                </p>
                                <div className="text-sm font-medium">
                                    Points required:{" "}
                                    {form.watch("pointsRequired") || 0}
                                </div>
                                {(form.watch("expiryDays") as number) > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                        Expires {form.watch("expiryDays")} days
                                        after claiming
                                    </div>
                                )}
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
                            {" "}
                            Cance
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Saving...
                                </span>
                            ) : reward ? (
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
