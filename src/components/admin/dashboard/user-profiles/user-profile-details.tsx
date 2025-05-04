"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Loader2,
    MapPin,
    Phone,
    User,
    UserCircle,
    Award,
    Gift,
    Recycle,
} from "lucide-react"

interface UserProfile {
    id: string
    userId: string
    user: {
        username: string
        name: string
    }
    profilePic: string
    role: "Client" | "Admin" | "Agent"
    address?: string
    city?: string
    state?: string
    country: string
    phoneNumber?: string
    totalPlasticRecycled: number
    earnedPoints: number
    plasticCollections: PlasticCollection[]
    rewards: Reward[]
    badges: Badge[]
}

interface PlasticCollection {
    id: string
    amount: number
    status: "Pending" | "Claimed" | "Collected"
    createdAt: string
}

interface Reward {
    id: string
    reward: {
        title: string
        rewardType: "Gift_Coupon" | "Cash" | "Offer"
    }
    claimedDate: string
}

interface Badge {
    id: string
    name:
        | "Recycler"
        | "Eco_Warrior"
        | "Green_Ambassador"
        | "Sustainability_Hero"
    issuedDate: string
}

const fetchUserProfile = async (profileId: string): Promise<UserProfile> => {
    const response = await fetch(`/api/users/${profileId}`, {
        credentials: "include",
    })
    if (!response.ok) {
        throw new Error("Failed to fetch user profile")
    }
    return response.json()
}

export function UserProfileDetails({ profileId }: { profileId: string }) {
    const {
        data: profile,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["user-profile", profileId],
        queryFn: () => fetchUserProfile(profileId),
    })

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatStateName = (state?: string) => {
        return state ? state.replace(/_/g, " ") : ""
    }

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading profile data...
                    </p>
                </div>
            </Card>
        )
    }

    if (isError || !profile) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <User className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">Profile Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        {error instanceof Error
                            ? error.message
                            : "The profile you are looking for does not exist or has been deleted."}
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24 border">
                            <AvatarImage
                                src={profile.profilePic}
                                alt={profile.user.name}
                            />
                            <AvatarFallback className="text-lg">
                                {profile.user.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">
                                    {profile.user.name}
                                </h2>
                                <Badge
                                    variant={
                                        profile.role === "Agent"
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {profile.role === "Agent" ? (
                                        <UserCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                        <User className="h-3 w-3 mr-1" />
                                    )}
                                    {profile.role}
                                </Badge>
                            </div>

                            {profile.address && (
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>
                                        {profile.address}, {profile.city},{" "}
                                        {formatStateName(profile.state)},{" "}
                                        {profile.country}
                                    </span>
                                </div>
                            )}

                            {profile.phoneNumber && (
                                <div className="flex items-center text-muted-foreground">
                                    <Phone className="mr-1 h-4 w-4" />
                                    <span>{profile.phoneNumber}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mt-2">
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Total Plastic Recycled
                                    </span>
                                    <p className="font-bold">
                                        {profile.totalPlasticRecycled.toFixed(
                                            2
                                        )}{" "}
                                        kg
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">
                                        Earned Points
                                    </span>
                                    <p className="font-bold">
                                        {profile.earnedPoints.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="collections" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>

                <TabsContent value="collections" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plastic Collections</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile.plasticCollections.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.plasticCollections.map(
                                        collection => (
                                            <div
                                                key={collection.id}
                                                className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {collection.amount.toFixed(
                                                            2
                                                        )}{" "}
                                                        kg
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            collection.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        collection.status ===
                                                        "Collected"
                                                            ? "default"
                                                            : collection.status ===
                                                                "Claimed"
                                                              ? "outline"
                                                              : "secondary"
                                                    }
                                                >
                                                    {collection.status}
                                                </Badge>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No collections found for this user.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rewards" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Claimed Rewards</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile.rewards.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.rewards.map(reward => (
                                        <div
                                            key={reward.id}
                                            className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {reward.reward.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Claimed on{" "}
                                                    {formatDate(
                                                        reward.claimedDate
                                                    )}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    reward.reward.rewardType ===
                                                    "Gift_Coupon"
                                                        ? "default"
                                                        : reward.reward
                                                                .rewardType ===
                                                            "Cash"
                                                          ? "default"
                                                          : "secondary"
                                                }
                                            >
                                                <Gift className="h-3 w-3 mr-1" />
                                                {reward.reward.rewardType.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No rewards claimed by this user.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="badges" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Earned Badges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile.badges.length > 0 ? (
                                <div className="space-y-4">
                                    {profile.badges.map(badge => {
                                        const badgeDetails = getBadgeDetails(
                                            badge.name
                                        )
                                        return (
                                            <div
                                                key={badge.id}
                                                className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                                            >
                                                <div>
                                                    <p className="font-medium flex items-center">
                                                        <span
                                                            className={
                                                                badgeDetails.color
                                                            }
                                                        >
                                                            {badgeDetails.icon}
                                                        </span>
                                                        {badge.name.replace(
                                                            /_/g,
                                                            " "
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Earned on{" "}
                                                        {formatDate(
                                                            badge.issuedDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No badges earned by this user.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const getBadgeDetails = (badgeType: string) => {
    switch (badgeType) {
        case "Recycler":
            return {
                icon: <Recycle className="h-4 w-4 mr-1" />,
                color: "text-green-500",
            }
        case "Eco_Warrior":
            return {
                icon: <Award className="h-4 w-4 mr-1" />,
                color: "text-blue-500",
            }
        case "Green_Ambassador":
            return {
                icon: <Award className="h-4 w-4 mr-1" />,
                color: "text-emerald-500",
            }
        case "Sustainability_Hero":
            return {
                icon: <Award className="h-4 w-4 mr-1" />,
                color: "text-amber-500",
            }
        default:
            return {
                icon: <Award className="h-4 w-4 mr-1" />,
                color: "text-gray-500",
            }
    }
}
