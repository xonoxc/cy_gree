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
import { Award, Medal, Leaf, Shield, Recycle } from "lucide-react"

const users = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Mike Johnson" },
    { id: "user4", name: "Sarah Williams" },
    { id: "user5", name: "David Brown" },
]

const formSchema = z.object({
    userId: z.string({
        required_error: "Please select a user.",
    }),
    name: z.enum(
        ["Recycler", "Eco_Warrior", "Green_Ambassador", "Sustainability_Hero"],
        {
            required_error: "Please select a badge type.",
        }
    ),
})

export function BadgeForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
            name: "Recycler",
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
                title: "Badge awarded",
                description: "The badge has been awarded successfully.",
            })

            router.push("/dashboard/badges")
        } catch (e) {
            toast({
                title: "Something went wrong.",
                description: "The badge was not awarded. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Badge icon and color
    const getBadgeDetails = (badgeType: string) => {
        switch (badgeType) {
            case "Recycler":
                return {
                    icon: <Recycle className="h-5 w-5 mr-2" />,
                    color: "text-green-500",
                }
            case "Eco_Warrior":
                return {
                    icon: <Shield className="h-5 w-5 mr-2" />,
                    color: "text-blue-500",
                }
            case "Green_Ambassador":
                return {
                    icon: <Leaf className="h-5 w-5 mr-2" />,
                    color: "text-emerald-500",
                }
            case "Sustainability_Hero":
                return {
                    icon: <Medal className="h-5 w-5 mr-2" />,
                    color: "text-amber-500",
                }
            default:
                return {
                    icon: <Award className="h-5 w-5 mr-2" />,
                    color: "text-gray-500",
                }
        }
    }

    // Format badge name for display
    const formatBadgeName = (name: string) => {
        return name.replace(/_/g, " ")
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
                                        The user who will receive this badge.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Badge Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a badge type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[
                                                "Recycler",
                                                "Eco_Warrior",
                                                "Green_Ambassador",
                                                "Sustainability_Hero",
                                            ].map(badge => {
                                                const badgeDetails =
                                                    getBadgeDetails(badge)
                                                return (
                                                    <SelectItem
                                                        key={badge}
                                                        value={badge}
                                                    >
                                                        <div className="flex items-center">
                                                            <span
                                                                className={
                                                                    badgeDetails.color
                                                                }
                                                            >
                                                                {
                                                                    badgeDetails.icon
                                                                }
                                                            </span>
                                                            {formatBadgeName(
                                                                badge
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The type of badge to award to the user.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium mb-2">
                                Badge Description
                            </h3>
                            {form.watch("name") && (
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <span
                                            className={
                                                getBadgeDetails(
                                                    form.watch("name")
                                                ).color
                                            }
                                        >
                                            {
                                                getBadgeDetails(
                                                    form.watch("name")
                                                ).icon
                                            }
                                        </span>
                                        <span className="font-semibold">
                                            {formatBadgeName(
                                                form.watch("name")
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {form.watch("name") === "Recycler" &&
                                            "Awarded to users who have started their recycling journey."}
                                        {form.watch("name") === "Eco_Warrior" &&
                                            "Awarded to users who have recycled more than 10kg of plastic."}
                                        {form.watch("name") ===
                                            "Green_Ambassador" &&
                                            "Awarded to users who have recycled more than 25kg of plastic and have been active for at least 3 months."}
                                        {form.watch("name") ===
                                            "Sustainability_Hero" &&
                                            "Awarded to users who have recycled more than 50kg of plastic and have been active for at least 6 months."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard/badges")}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Awarding...
                                </span>
                            ) : (
                                "Award Badge"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
