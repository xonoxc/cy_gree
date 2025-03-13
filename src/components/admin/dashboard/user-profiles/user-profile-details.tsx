"use client"

import { useState, useEffect } from "react"
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

// Mock profile data
const mockProfile = {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    profilePic: "/placeholder.svg?height=100&width=100&text=JD",
    role: "Client",
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    phoneNumber: "9876543210",
    totalPlasticRecycled: 25.5,
    earnedPoints: 1250.0,
}

// Mock badges data
const mockBadges = [
    {
        id: "1",
        name: "Recycler",
        issuedDate: "2023-03-15T00:00:00.000Z",
    },
    {
        id: "2",
        name: "Eco_Warrior",
        issuedDate: "2023-04-20T00:00:00.000Z",
    },
]

// Mock collections data
const mockCollections = [
    {
        id: "1",
        amount: 5.2,
        status: "Collected",
        createdAt: "2023-06-15T10:30:00.000Z",
    },
    {
        id: "2",
        amount: 3.7,
        status: "Collected",
        createdAt: "2023-06-01T14:20:00.000Z",
    },
    {
        id: "3",
        amount: 8.1,
        status: "Collected",
        createdAt: "2023-05-13T09:15:00.000Z",
    },
]

// Mock rewards data
const mockRewards = [
    {
        id: "1",
        rewardTitle: "10% Discount Coupon",
        rewardType: "Gift_Coupon",
        claimedDate: "2023-06-10T10:30:00.000Z",
    },
    {
        id: "2",
        rewardTitle: "Free Eco-friendly Bag",
        rewardType: "Gift_Coupon",
        claimedDate: "2023-05-20T14:20:00.000Z",
    },
]

export function UserProfileDetails({ profileId }: { profileId: string }) {
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [badges, setBadges] = useState<any[]>([])
    const [collections, setCollections] = useState<any[]>([])
    const [rewards, setRewards] = useState<any[]>([])

    useEffect(() => {
        // Simulate API call to fetch profile data
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // In a real app, you would fetch data from your API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Set mock data
                setProfile(mockProfile)
                setBadges(mockBadges)
                setCollections(mockCollections)
                setRewards(mockRewards)
            } catch (error) {
                console.error("Error fetching profile data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [profileId])

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

    if (!profile) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <User className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">Profile Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        The profile you are looking for does not exist or has
                        been deleted.
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
        })
    }

    // Format state name for display
    const formatStateName = (state: string) => {
        return state ? state.replace(/_/g, " ") : ""
    }

    // Badge icon and color
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

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Avatar className="h-24 w-24 border">
                            <AvatarImage
                                src={profile.profilePic}
                                alt={profile.userName}
                            />
                            <AvatarFallback className="text-lg">
                                {profile.userName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">
                                    {profile.userName}
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

                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="mr-1 h-4 w-4" />
                                <span>
                                    {profile.address}, {profile.city},{" "}
                                    {formatStateName(profile.state)},{" "}
                                    {profile.country}
                                </span>
                            </div>

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
                            {collections.length > 0 ? (
                                <div className="space-y-4">
                                    {collections.map(collection => (
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
                                    ))}
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
                            {rewards.length > 0 ? (
                                <div className="space-y-4">
                                    {rewards.map(reward => (
                                        <div
                                            key={reward.id}
                                            className="flex justify-between border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {reward.rewardTitle}
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
                                                    reward.rewardType ===
                                                    "Gift_Coupon"
                                                        ? "default"
                                                        : reward.rewardType ===
                                                            "Cash"
                                                          ? "default"
                                                          : "secondary"
                                                }
                                            >
                                                <Gift className="h-3 w-3 mr-1" />
                                                {reward.rewardType.replace(
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
                            {badges.length > 0 ? (
                                <div className="space-y-4">
                                    {badges.map(badge => {
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
