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
import { Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { PlasticCollection, User } from "@prisma/client"
import { Label } from "@/components/ui/label"
import { IKImage, IKUpload } from "imagekitio-next"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import { Progress } from "@/components/ui/progress"
import { adminCollcetionCreateSchema } from "@/utils/validation/collection/collection"

export function PlasticCollectionForm({
    collectionId,
}: {
    collectionId?: string
}) {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [agents, setAgents] = useState<User[]>([])
    const [collection, setCollection] = useState<PlasticCollection | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [imageUploadError, setImageUploadError] = useState<string>("")
    const [imageUploadProgress, setImageUploadProgress] = useState<number>(0)

    const form = useForm<z.infer<typeof adminCollcetionCreateSchema>>({
        resolver: zodResolver(adminCollcetionCreateSchema),
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

    const status = form.watch("status")

    async function onSubmit(
        values: z.infer<typeof adminCollcetionCreateSchema>
    ) {
        setIsLoading(true)
        try {
            const collectionCreateResult = await fetch(
                "/api/admin/plastic-collections",
                {
                    method: "POST",
                    body: JSON.stringify({
                        ...values,
                    }),
                }
            )

            if (!collectionCreateResult.ok) {
                throw new Error("Failed to create collection")
            }
            toast({
                title: collection ? "Collection updated" : "Collection added",
                description: collection
                    ? "The plastic collection has been updated successfully."
                    : "The plastic collection has been added successfully.",
            })

            router.push("/admin/dashboard/plastic-collections")
        } catch (e) {
            if (e instanceof Error) {
                toast({
                    title: e.message || "Something went wrong.",
                    description:
                        "Your collection was not saved. Please try again.",
                    variant: "destructive",
                })
            } else {
                console.error("error while creating collection:", e)
            }
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchUsers() {
        try {
            const response = await fetch("/api/user")
            if (!response.ok) throw new Error("Failed to fetch users")
            const data = await response.json()

            setUsers(data.users)
        } catch (e) {
            console.error("Error fetching users:", e)
            toast({
                title: "Error",
                description: "Failed to load users. Please try again.",
                variant: "destructive",
            })
        }
    }

    async function fetchAgents() {
        try {
            const agentfetchResults = await fetch("/api/admin/agents")
            if (!agentfetchResults.ok) {
                throw new Error("Failed to fetch agents")
            }
            const jsonAgents = await agentfetchResults.json()
            setAgents(jsonAgents.agents)
        } catch (e) {
            console.error("Error fetching users:", e)
            toast({
                title: "Error",
                description: "Failed to load users. Please try again.",
                variant: "destructive",
            })
        }
    }

    async function fetchCollection() {
        try {
            const currentCollection = await fetch(
                `/api/admin/plastic-collections/${collectionId}`
            )
            if (!currentCollection.ok) {
                throw new Error("Failed to fetch agents")
            }
            const jsonAgents = await currentCollection.json()
            setCollection(jsonAgents.collection)
        } catch (e) {
            console.error("Error fetching users:", e)
            toast({
                title: "Error",
                description: "Failed to load users. Please try again.",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        ;(async () => {
            const promises = [fetchUsers(), fetchAgents()]

            if (collectionId) promises.push(fetchCollection())

            await Promise.all(promises)
        })()
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
                                        The user who submitted this plastic
                                        collection.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <Label
                                htmlFor="pic"
                                className="text-sm font-medium"
                            >
                                Picture Upload *
                            </Label>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    {imageUploadError && (
                                        <div>{imageUploadError}</div>
                                    )}
                                    <IKUpload
                                        folder={"collections"}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        onError={(e: any) =>
                                            setImageUploadError(
                                                JSON.stringify(e)
                                            )
                                        }
                                        onSuccess={(resp: IKUploadResponse) =>
                                            form.setValue(
                                                "imagePath",
                                                resp.filePath
                                            )
                                        }
                                        onUploadProgress={(
                                            e: ProgressEvent<XMLHttpRequestEventTarget>
                                        ) =>
                                            setImageUploadProgress(
                                                (e.loaded / e.total) * 100
                                            )
                                        }
                                    />
                                </div>
                                <div className="w-full items-center justify-center flex">
                                    {form.getValues("imagePath") ? (
                                        <Card className="p-2 mt-2 overflow-hidden">
                                            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                                                <IKImage
                                                    path={form.getValues(
                                                        "imagePath"
                                                    )}
                                                    alt="uploaded image"
                                                />
                                            </div>
                                        </Card>
                                    ) : imageUploadProgress > 0 ? (
                                        <Progress
                                            value={imageUploadProgress}
                                            className="w-[90%]"
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>

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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

function getStatusDetails(status: string) {
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
