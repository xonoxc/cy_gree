"use client"

import { useEffect, useState } from "react"
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
import { badgeAdminFormSchema as formSchema } from "@/utils/validation/badge"
import { useQueryClient } from "@tanstack/react-query"

export function BadgeForm() {
    const queryClient = useQueryClient()

    const router = useRouter()
    const [users, setUsers] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
            name: "Recycler",
        },
    })

    const formatBadgeName = (name: string) => {
        return name.replace(/_/g, " ")
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const badgeCreateRes = await fetch("/api/admin/badges", {
                method: "POST",
                body: JSON.stringify(values),
            })

            if (!badgeCreateRes.ok) throw new Error("Failed to award badge.")

            toast({
                title: "Badge awarded",
                description: "The badge has been awarded successfully.",
            })

            await queryClient.invalidateQueries({
                queryKey: ["badges"],
            })

            router.push("/admin/dashboard/badges")
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

    useEffect(() => {
        fetch("/api/user")
            .then(res => res.json())
            .then(data => setUsers(data.users || []))
    }, [])

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
                                        {form.watch("name") === "Recycler"}
                                        {form.watch("name") === "Eco_Warrior"}
                                        {form.watch("name") ===
                                            "Green_Ambassador"}
                                        {form.watch("name") ===
                                            "Sustainability_Hero"}
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
