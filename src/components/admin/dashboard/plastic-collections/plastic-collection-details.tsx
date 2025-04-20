"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Loader2,
    Clock,
    AlertCircle,
    CheckCircle,
    User,
    Calendar,
    MapPin,
} from "lucide-react"
import Image from "next/image"
import { ICollection } from "@/types/plasticCollection/type.collection"
import { useQuery } from "@tanstack/react-query"

const fetchCollectionById = async (
    collectionId: string
): Promise<ICollection> => {
    const result = await fetch("/api/admin/plastic-collections")
    if (!result.ok) {
        throw new Error(`cannot fetch collection by id :${collectionId}`)
    }
    return result.json()
}

export function PlasticCollectionDetails({
    collectionId,
}: {
    collectionId: string
}) {
    const { data: collection, isLoading } = useQuery<ICollection>({
        queryKey: ["collection", collectionId],
        queryFn: () => fetchCollectionById(collectionId),
        enabled: !!collectionId,
    })

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading collection data...
                    </p>
                </div>
            </Card>
        )
    }

    if (!collection) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">
                        Collection Not Found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        The plastic collection you are looking for does not
                        exist or has been deleted.
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
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const statusDetails = getStatusDetails(collection.status)

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative h-64 w-full rounded-md overflow-hidden border">
                            <Image
                                src={collection.imagePath || "/placeholder.svg"}
                                alt="Plastic collection"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Collection #{collection.id}
                                </h2>
                                <div className="flex items-center mt-2">
                                    <Badge
                                        variant={statusDetails.variant as any}
                                        className="flex items-center"
                                    >
                                        {statusDetails.icon}
                                        {collection.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center text-muted-foreground">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>
                                        Submitted by: {collection.userName}
                                    </span>
                                </div>

                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>
                                        Date: {formatDate(collection.createdAt)}
                                    </span>
                                </div>

                                {collection.location && (
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span>
                                            Location: {collection.location}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <div className="text-lg font-semibold">
                                    Amount
                                </div>
                                <div className="text-3xl font-bold">
                                    {collection.amount.toFixed(2)} kg
                                </div>
                            </div>

                            {(collection.status === "Claimed" ||
                                collection.status === "Collected") && (
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Claimed By
                                    </div>
                                    <div className="font-medium">
                                        {collection.claimedByName}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="details" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Collection Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium mb-1">
                                            Created At
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(collection.createdAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-1">
                                            Last Updated
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(collection.updatedAt)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">
                                        Points Earned
                                    </h3>
                                    <p className="text-sm">
                                        {/* Assuming 50 points per kg */}
                                        {Math.round(
                                            collection.amount * 50
                                        )}{" "}
                                        points
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <p className="font-medium">
                                            Status changed to{" "}
                                            {collection.status}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(collection.updatedAt)}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={statusDetails.variant as any}
                                        className="flex items-center"
                                    >
                                        {statusDetails.icon}
                                        {collection.status}
                                    </Badge>
                                </div>

                                {(collection.status === "Claimed" ||
                                    collection.status === "Collected") && (
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <p className="font-medium">
                                                Claimed by{" "}
                                                {collection.claimedByName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(
                                                    new Date(
                                                        new Date(
                                                            collection.updatedAt
                                                        ).getTime() - 3600000
                                                    ).toString()
                                                )}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="flex items-center"
                                        >
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            Claimed
                                        </Badge>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Collection submitted
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(collection.createdAt)}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center"
                                    >
                                        <Clock className="h-4 w-4 mr-1" />
                                        Pending
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
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
