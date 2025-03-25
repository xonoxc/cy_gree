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
import { Label } from "@/components/ui/label"
import { IKImage, IKUpload } from "imagekitio-next"
import { Progress } from "@/components/ui/progress"
import { adminCollcetionCreateSchema as collectionSchema } from "@/utils/validation/collection/collection"

/**
 * Collection value types::
 */

type CollectionFormValues = z.infer<typeof collectionSchema>

export function PlasticCollectionForm({
    collectionId,
}: {
    collectionId?: string
}) {
    const router = useRouter()
    const [users, setUsers] = useState<{ id: string; name: string }[]>([])
    const [agents, setAgents] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(true)
    const [imageUploadProgress, setImageUploadProgress] = useState(0)
    const [imageUploadError, setImageUploadError] = useState("")

    const form = useForm<CollectionFormValues>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            userId: "",
            imagePath: "",
            amount: 0,
            status: "Pending",
            claimedBy: "",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const promises = [
                    fetch("/api/user")
                        .then(res => res.json())
                        .then(data => setUsers(data.users || [])),
                    fetch("/api/admin/agents")
                        .then(res => res.json())
                        .then(data => setAgents(data.agents || [])),
                ]

                if (collectionId) {
                    promises.push(
                        fetch(`/api/admin/plastic-collections/${collectionId}`)
                            .then(res => {
                                if (!res.ok)
                                    throw new Error("Collection not found")
                                return res.json()
                            })
                            .then(data => {
                                form.reset({
                                    userId: data.userId,
                                    imagePath: data.imagePath,
                                    amount: Number(data.amount),
                                    status: data.status,
                                    claimedBy: data.claimedBy || "",
                                })
                            })
                    )
                }

                await Promise.all(promises)
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Failed to load data.",
                    variant: "destructive",
                })
            } finally {
                setIsDataLoading(false)
            }
        }

        fetchData()
    }, [collectionId, form])

    useEffect(() => {
        if (form.watch("status") === "Pending") {
            form.setValue("claimedBy", "")
        }
    }, [form.watch("status")])

    const onSubmit = async (values: CollectionFormValues) => {
        setIsLoading(true)
        try {
            const method = collectionId ? "PATCH" : "POST"
            const url = collectionId
                ? `/api/admin/plastic-collections/${collectionId}`
                : "/api/admin/plastic-collections"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error(
                    `Failed to ${collectionId ? "update" : "create"} collection`
                )
            }

            toast({
                title: collectionId
                    ? "Collection Updated"
                    : "Collection Created",
                description: `The plastic collection has been ${
                    collectionId ? "updated" : "created"
                } successfully.`,
            })
            router.push("/admin/dashboard/plastic-collections")
        } catch (err) {
            toast({
                title: "Error",
                description: "Your collection was not saved. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isDataLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        {/* User Selection */}
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="pic">Picture Upload *</Label>
                            <div className="flex flex-col gap-2">
                                <IKUpload
                                    folder="collections"
                                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    onError={(e: any) =>
                                        setImageUploadError(JSON.stringify(e))
                                    }
                                    onSuccess={(resp: { filePath: string }) => {
                                        form.setValue(
                                            "imagePath",
                                            resp.filePath
                                        )
                                        setImageUploadProgress(0)
                                    }}
                                    onUploadProgress={(e: ProgressEvent) =>
                                        setImageUploadProgress(
                                            (e.loaded / e.total) * 100
                                        )
                                    }
                                />
                                {imageUploadError && (
                                    <p className="text-sm text-destructive">
                                        {imageUploadError}
                                    </p>
                                )}
                                <div className="flex justify-center">
                                    {form.watch("imagePath") ? (
                                        <Card className="p-2 mt-2 w-full max-w-md overflow-hidden">
                                            <div className="relative aspect-video w-full rounded-md bg-muted">
                                                <IKImage
                                                    path={form.watch(
                                                        "imagePath"
                                                    )}
                                                    alt="Uploaded image"
                                                />
                                            </div>
                                        </Card>
                                    ) : imageUploadProgress > 0 ? (
                                        <div className="flex items-center justify-center flex-col w-full">
                                            <Progress
                                                value={imageUploadProgress}
                                                className="w-full max-w-md h-2 mt-2 text-black"
                                            />

                                            <span className="dark:text-white text-white">
                                                {imageUploadProgress} % uploaded
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No image uploaded yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Amount */}
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
                                            onChange={e =>
                                                field.onChange(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
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
                                                const { variant, icon } =
                                                    getStatusDetails(status)
                                                return (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                    >
                                                        <div className="flex items-center">
                                                            <Badge
                                                                variant={
                                                                    variant as any
                                                                }
                                                                className="flex items-center mr-2"
                                                            >
                                                                {icon}
                                                                {status}
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

                        {/* Claimed By (Conditional) */}
                        {["Claimed", "Collected"].includes(
                            form.watch("status")
                        ) && (
                            <FormField
                                control={form.control}
                                name="claimedBy"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Claimed By</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Collection Summary */}
                        <div className="rounded-lg border p-4 bg-muted/20">
                            <h3 className="font-medium mb-2">
                                Collection Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        User:{" "}
                                        {users.find(
                                            u => u.id === form.watch("userId")
                                        )?.name || "Not selected"}
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
                                <div>
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
                                        <div>
                                            <span className="font-medium">
                                                Claimed by:{" "}
                                            </span>
                                            {agents.find(
                                                a =>
                                                    a.id ===
                                                    form.watch("claimedBy")
                                            )?.name || "Not selected"}
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
                                router.push(
                                    "/admin/dashboard/plastic-collections"
                                )
                            }
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </span>
                            ) : collectionId ? (
                                "Update Collection"
                            ) : (
                                "Create Collection"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

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
