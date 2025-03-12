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
import { Clock, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

const users = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" },
    { id: "user3", name: "Mike Johnson" },
    { id: "user4", name: "Sarah Williams" },
    { id: "user5", name: "David Brown" },
]

const agents = [
    { id: "agent1", name: "Agent 1" },
    { id: "agent2", name: "Agent 2" },
    { id: "agent3", name: "Agent 3" },
]

const formSchema = z.object({
    userId: z.string({
        required_error: "Please select a user.",
    }),
    imagePath: z.string().min(1, {
        message: "Please provide an image URL.",
    }),
    amount: z.coerce.number().min(0.1, {
        message: "Amount must be at least 0.1 kg.",
    }),
    status: z.enum(["Pending", "Claimed", "Collected"], {
        required_error: "Please select a status.",
    }),
    claimedBy: z.string().optional(),
})

export function PlasticCollectionForm({ collection }: { collection?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: collection?.userId || "",
            imagePath:
                collection?.imagePath ||
                "/placeholder.svg?height=200&width=200",
            amount: collection?.amount || 0,
            status: collection?.status || "Pending",
            claimedBy: collection?.claimedBy || "",
        },
    })

    // Watch for status changes to update form behavior
    const status = form.watch("status")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            // Here you would normally send the data to your API
            console.log(values)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: collection ? "Collection updated" : "Collection added",
                description: collection
                    ? "The plastic collection has been updated successfully."
                    : "The plastic collection has been added successfully.",
            })

            router.push("/dashboard/plastic-collections")
        } catch (e) {
            toast({
                title: "Something went wrong.",
                description: "Your collection was not saved. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Status badge variant and icon
    const getStatusDetails = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return {
                    variant: "warning",
                    icon: <Clock className="h-4 w-4 mr-1" />,
                }
            case "claimed":
                return {
                    variant: "outline",
                    icon: <AlertCircle className="h-4 w-4 mr-1" />,
                }
            case "collected":
                return {
                    variant: "success",
                    icon: <CheckCircle className="h-4 w-4 mr-1" />,
                }
            default:
                return { variant: "secondary", icon: null }
        }
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
                                        The user who submitted this plastic
                                        collection.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imagePath"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com/image.jpg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        URL of the image showing the plastic
                                        collection.
                                    </FormDescription>
                                    <FormMessage />

                                    {field.value && (
                                        <div className="mt-2 relative h-40 w-full max-w-md rounded-md overflow-hidden border">
                                            <Image
                                                src={
                                                    field.value ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Plastic collection preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount (kg)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The weight of the plastic collection in
                                        kilograms.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[
                                                "Pending",
                                                "Claimed",
                                                "Collected",
                                            ].map(status => {
                                                const statusDetails =
                                                    getStatusDetails(status)
                                                return (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                    >
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={
                                                                    statusDetails.variant as any
                                                                }
                                                                className="flex items-center mr-2"
                                                            >
                                                                {
                                                                    statusDetails.icon
                                                                }
                                                                {status}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The current status of this plastic
                                        collection.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {(status === "Claimed" || status === "Collected") && (
                            <FormField
                                control={form.control}
                                name="claimedBy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Claimed By</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an agent" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {agents.map(agent => (
                                                    <SelectItem
                                                        key={agent.id}
                                                        value={agent.id}
                                                    >
                                                        {agent.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The agent who claimed this plastic
                                            collection.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium mb-2">
                                Collection Summary
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        User:{" "}
                                        {users.find(
                                            u => u.id === form.watch("userId")
                                        )?.name || "User"}
                                    </span>
                                    {form.watch("status") && (
                                        <Badge
                                            variant={
                                                getStatusDetails(
                                                    form.watch("status")
                                                ).variant as any
                                            }
                                            className="flex items-center"
                                        >
                                            {
                                                getStatusDetails(
                                                    form.watch("status")
                                                ).icon
                                            }
                                            {form.watch("status")}
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">
                                        Amount:{" "}
                                    </span>
                                    {form.watch("amount")
                                        ? `${form.watch("amount")} kg`
                                        : "0 kg"}
                                </div>
                                {(form.watch("status") === "Claimed" ||
                                    form.watch("status") === "Collected") &&
                                    form.watch("claimedBy") && (
                                        <div className="text-sm">
                                            <span className="font-medium">
                                                Claimed by:{" "}
                                            </span>
                                            {agents.find(
                                                a =>
                                                    a.id ===
                                                    form.watch("claimedBy")
                                            )?.name || "Agent"}
                                        </div>
                                    )}
                                <div className="text-xs text-muted-foreground">
                                    Created: {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push("/dashboard/plastic-collections")
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
                            ) : collection ? (
                                "Update Collection"
                            ) : (
                                "Add Collection"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
