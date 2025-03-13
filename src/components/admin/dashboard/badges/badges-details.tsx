"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Loader2,
    Award,
    Medal,
    Leaf,
    Shield,
    Recycle,
    Calendar,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// Mock badge data
const mockBadge = {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userImage: "/placeholder.svg?height=100&width=100&text=JD",
    name: "Recycler",
    issuedDate: "2023-06-15T00:00:00.000Z",
    description: "Awarded to users who have started their recycling journey.",
    criteria: "Start recycling and submit at least one plastic collection.",
    issuedBy: "System",
}

export function BadgeDetails({ badgeId }: { badgeId: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isRevoking, setIsRevoking] = useState(false)
    const [badge, setBadge] = useState<any>(null)

    useEffect(() => {
        // Simulate API call to fetch badge data
        const fetchData = async () => {
            setIsLoading(true)
            try {
                // In a real app, you would fetch data from your API
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Set mock data
                setBadge(mockBadge)
            } catch (error) {
                console.error("Error fetching badge data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [badgeId])

    const handleRevokeBadge = async () => {
        if (
            !confirm(
                "Are you sure you want to revoke this badge? This action cannot be undone."
            )
        ) {
            return
        }

        setIsRevoking(true)
        try {
            // In a real app, you would call your API to revoke the badge
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: "Badge revoked",
                description:
                    "The badge has been successfully revoked from the user.",
            })

            router.push("/dashboard/badges")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to revoke the badge. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsRevoking(false)
        }
    }

    if (isLoading) {
        return (
            <Card className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading badge data...
                    </p>
                </div>
            </Card>
        )
    }

    if (!badge) {
        return (
            <Card className="p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Award className="h-8 w-8 text-destructive" />
                    <h2 className="text-xl font-semibold">Badge Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        The badge you are looking for does not exist or has been
                        deleted.
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

    // Badge icon and color
    const getBadgeDetails = (badgeType: string) => {
        switch (badgeType) {
            case "Recycler":
                return {
                    icon: <Recycle className="h-12 w-12" />,
                    color: "text-green-500",
                }
            case "Eco_Warrior":
                return {
                    icon: <Shield className="h-12 w-12" />,
                    color: "text-blue-500",
                }
            case "Green_Ambassador":
                return {
                    icon: <Leaf className="h-12 w-12" />,
                    color: "text-emerald-500",
                }
            case "Sustainability_Hero":
                return {
                    icon: <Medal className="h-12 w-12" />,
                    color: "text-amber-500",
                }
            default:
                return {
                    icon: <Award className="h-12 w-12" />,
                    color: "text-gray-500",
                }
        }
    }

    const badgeDetails = getBadgeDetails(badge.name)

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div
                            className={`${badgeDetails.color} bg-muted p-6 rounded-full`}
                        >
                            {badgeDetails.icon}
                        </div>

                        <div className="space-y-4 flex-1 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {badge.name.replace(/_/g, " ")}
                                </h2>
                                <p className="text-muted-foreground">
                                    {badge.description}
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Awarded To
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start mt-1">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage
                                                src={badge.userImage}
                                                alt={badge.userName}
                                            />
                                            <AvatarFallback>
                                                {badge.userName
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">
                                            {badge.userName}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Issued Date
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start mt-1">
                                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>
                                            {formatDate(badge.issuedDate)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Issued By
                                    </div>
                                    <div className="font-medium">
                                        {badge.issuedBy}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Badge Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{badge.criteria}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">
                            Revoking a badge will remove it from the user's
                            profile. This action cannot be undone.
                        </p>
                        <Button
                            variant="destructive"
                            onClick={handleRevokeBadge}
                            disabled={isRevoking}
                        >
                            {isRevoking ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Revoking...
                                </>
                            ) : (
                                "Revoke Badge"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
