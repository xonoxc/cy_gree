"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Loader2,
    Mail,
    User,
    Calendar,
    Key,
    CheckCircle,
    XCircle,
} from "lucide-react"
import React from "react"

async function fetchUserData(userId: string) {
    const response = await fetch(`/api/admin/user/${userId}`)
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("User not found")
        }
        throw new Error("Failed to fetch user data")
    }
    return response.json()
}

export function UserDetails({ userId }: { userId: string }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["userActivites", userId],
        queryFn: () => fetchUserData(userId),
        staleTime: 5 * 60 * 1000,
        enabled: !!userId,
    })

    const user = data?.user
    const activity = data?.activity || []
    const stats = data?.stats

    if (isLoading) return <LoadingComponent />

    if (error || !user) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error"
        return <ErrorComponent errorMessage={errorMessage} />
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not available"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24 border">
                            <AvatarImage
                                src={user.profilePic}
                                alt={user.name}
                            />
                            <AvatarFallback className="text-lg">
                                {user.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">
                                    {user.name}
                                </h2>
                                <Badge
                                    variant={
                                        user.isActive
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <User className="mr-1 h-4 w-4" />
                                <span>{user.username}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Mail className="mr-1 h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>Joined {formatDate(user.joinedAt)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="rounded-2xl">
                    <TabsTrigger value="overview" className="rounded-xl">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-xl">
                        Activity
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl">
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Total Plastic Collected
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalPlasticCollected} kg
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Rewards Claimed
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalRewardsClaimed}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Badges Earned
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalBadgesEarned}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        Total Points
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {stats.totalPoints}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Collections</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    No recent collections found.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Rewards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    No recent rewards found.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activity.length > 0 ? (
                                    activity.map(
                                        (item: {
                                            id: string
                                            action: string
                                            timestamp: string
                                        }) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {item.action}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            item.timestamp
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No activity found for this user.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            Last Login
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(user.lastLogin)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            Password Status
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Not available
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        <Key className="mr-1 h-3 w-3" />
                                        Unknown
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            Two-Factor Authentication
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Not available
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="flex items-center"
                                    >
                                        <XCircle className="mr-1 h-3 w-3 text-destructive" />
                                        Unknown
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">
                                            Account Status
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.isActive
                                                ? "Active and in good standing"
                                                : "Account is inactive"}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            user.isActive
                                                ? "default"
                                                : "destructive"
                                        }
                                        className="flex items-center"
                                    >
                                        {user.isActive ? (
                                            <>
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="mr-1 h-3 w-3" />
                                                Inactive
                                            </>
                                        )}
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

function LoadingComponent() {
    return (
        <Card className="p-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <Loader2 className="h-8 w-8 text-primary" />
                <h2 className="text-xl font-semibold">Loading User Data</h2>
                <p className="text-sm text-muted-foreground">
                    Please wait while we fetch the user details.
                </p>
            </div>
        </Card>
    )
}

function ErrorComponent({ errorMessage }: { errorMessage: string }) {
    return (
        <Card className="p-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <XCircle className="h-8 w-8 text-destructive" />
                <h2 className="text-xl font-semibold">
                    {errorMessage === "User not found"
                        ? "User Not Found"
                        : "Error"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {errorMessage === "User not found"
                        ? "The user you are looking for does not exist or has been deleted."
                        : "An error occurred while fetching user data."}
                </p>
            </div>
        </Card>
    )
}
