"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import getRelativeTime from "@/utils/date"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Award, Edit, Gift, History, LogOut, Recycle, Save } from "lucide-react"
import { ModeToggle } from "@/components/mode_toggle"
import { useRouter } from "next/navigation"
import { useClientstats } from "@/hooks/useClientstats"
import NotificationPopup from "@/components/notifications/notification-popup"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"
import { signOut } from "next-auth/react"
import { Separator } from "@/components/ui/separator"

const CollectionForm = dynamic(
    () => import("@/components/collection/collection-form"),
    {
        loading: () => <p>Loading...</p>,
    }
)

export default function UserDashboard() {
    const [editing, setEditing] = useState(false)
    const [avatar, setAvatar] = useState<File | null>(null)
    const { data: session } = useSession()
    const {
        userData,
        userBadges,
        handleInputChange,
        availableRewards,
        pendingRequests,
        unclaimedRequests,
        collectedPlastic,
        claimedRewards,
        handelClaimReward,
        handleProfileUpdate,
    } = useClientstats(session?.user?.id)

    const router = useRouter()
    const { toast } = useToast()

    const handleEditToggle = useCallback(async () => {
        try {
            if (editing) {
                const result = await handleProfileUpdate(avatar as File)
                if (result.status === 200) {
                    toast({
                        title: "Changes saved successfully!",
                        description: "Your profile has been updated.",
                    })
                }
            }
        } catch (error: any) {
            toast({
                title: error.message || "Profile update failed",
                variant: "destructive",
            })
        } finally {
            setEditing(!editing)
        }
    }, [editing, avatar, handleProfileUpdate, toast])

    const handleAvtarChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                setAvatar(e.target.files[0])
            }
        },
        []
    )

    const handleRewardsClaim = useCallback(
        async (id: string, expense: number) => {
            try {
                await handelClaimReward(id, expense)
                toast({
                    title: "Reward Claimed",
                    description: "You have successfully claimed this reward!",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: error.message || "Cannot claim reward",
                    description: "Please try again later.",
                })
            }
        },
        [handelClaimReward, toast]
    )

    const handleLogout = useCallback(async () => {
        await signOut()
        router.push("/sign-in")
    }, [router])

    // Calculate percentages for progress bars
    const pointsPercentage = Math.min(
        (userData.earned_points / 2000) * 100,
        100
    )
    const plasticPercentage = Math.min(
        (+userData.total_plastic_recycled / 10) * 100,
        100
    )

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                <h1 className="text-xl font-semibold">User Dashboard</h1>
                <div className="ml-auto flex items-center gap-4">
                    <NotificationPopup />
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>
            <main className="flex-1 p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Points
                            </CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {userData.earned_points}
                            </div>
                            <Progress
                                value={pointsPercentage}
                                className="h-2 mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                {userData.earned_points} points earned so far
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Plastic Collected
                            </CardTitle>
                            <Recycle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {userData.total_plastic_recycled} kg
                            </div>
                            <Progress
                                value={plasticPercentage}
                                className="h-2 mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Great job! Keep recycling
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Badges Earned
                            </CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {userBadges?.length || 0}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {userBadges?.length > 0 ? (
                                    userBadges
                                        .slice(0, 3)
                                        .map((badge, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                            >
                                                {badge.name}
                                            </Badge>
                                        ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No badges earned yet
                                    </p>
                                )}
                                {userBadges?.length > 3 && (
                                    <Badge variant="outline">
                                        +{userBadges.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end mb-6">
                    <CollectionForm />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Manage your personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4 mb-6">
                                {editing ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="avatar">
                                            Profile Picture
                                        </Label>
                                        <Input
                                            id="avatar"
                                            type="file"
                                            onChange={handleAvtarChange}
                                        />
                                    </div>
                                ) : (
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            src={`${process.env.NEXT_PUBLIC_SERVER_URL! + userData.profile_pic}`}
                                            alt={userData.name}
                                        />
                                        <AvatarFallback>
                                            {userData.name
                                                .split(" ")
                                                .map(n => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {userData.name}
                                    </h2>
                                    <Badge variant="outline" className="mt-1">
                                        User
                                    </Badge>
                                </div>

                                <Button
                                    onClick={handleEditToggle}
                                    variant="outline"
                                    size="sm"
                                    className="w-1/8 ml-2 bg-white text-black font-bold"
                                >
                                    {editing ? (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="text"
                                        maxLength={10}
                                        value={userData.phone_number}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={userData.address}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={userData.city}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={userData.state}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={userData.country}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Collection Summary</CardTitle>
                            <CardDescription>
                                Your recycling activity
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Pending</span>
                                    <span className="text-sm font-medium">
                                        {pendingRequests.length}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (pendingRequests.length /
                                            (pendingRequests.length +
                                                collectedPlastic.length +
                                                unclaimedRequests.length ||
                                                1)) *
                                        100
                                    }
                                    className="h-1.5"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Unclaimed</span>
                                    <span className="text-sm font-medium">
                                        {unclaimedRequests.length}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (unclaimedRequests.length /
                                            (pendingRequests.length +
                                                collectedPlastic.length +
                                                unclaimedRequests.length ||
                                                1)) *
                                        100
                                    }
                                    className="h-1.5"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">Completed</span>
                                    <span className="text-sm font-medium">
                                        {collectedPlastic.length}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (collectedPlastic.length /
                                            (pendingRequests.length +
                                                collectedPlastic.length +
                                                unclaimedRequests.length ||
                                                1)) *
                                        100
                                    }
                                    className="h-1.5"
                                />
                            </div>
                            <Separator />
                            <div>
                                <h3 className="text-sm font-medium mb-2">
                                    Recent Activity
                                </h3>
                                {[
                                    ...collectedPlastic,
                                    ...pendingRequests,
                                    ...unclaimedRequests,
                                ]
                                    .sort(
                                        (a, b) =>
                                            new Date(
                                                b.collection_date
                                            ).getTime() -
                                            new Date(
                                                a.collection_date
                                            ).getTime()
                                    )
                                    .slice(0, 3)
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center py-2 text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <History className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {item.amount_collected} kg
                                                    collected
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {getRelativeTime(
                                                    item.collection_date
                                                )}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="rewards" className="space-y-4">
                    <TabsList className="w-full">
                        <TabsTrigger value="rewards" className="flex-1">
                            <Gift className="h-4 w-4 mr-2" />
                            Rewards
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex-1">
                            <History className="h-4 w-4 mr-2" />
                            Collection History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rewards">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Rewards</CardTitle>
                                    <CardDescription>
                                        Rewards you can claim with your points
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {availableRewards.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Available Rewards
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Check back later for new rewards
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {availableRewards.map(
                                                (reward, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-4 rounded-lg border"
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">
                                                                {reward.name}
                                                            </h3>
                                                            <div className="flex items-center mt-1">
                                                                <Award className="h-4 w-4 text-amber-500 mr-1" />
                                                                <p className="text-sm text-muted-foreground">
                                                                    {
                                                                        reward.points_required
                                                                    }{" "}
                                                                    points
                                                                    required
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() =>
                                                                handleRewardsClaim(
                                                                    String(
                                                                        reward.id
                                                                    ),
                                                                    Number(
                                                                        reward.points_required
                                                                    )
                                                                )
                                                            }
                                                            disabled={
                                                                userData.earned_points <
                                                                reward.points_required
                                                            }
                                                        >
                                                            Claim
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Claimed Rewards</CardTitle>
                                    <CardDescription>
                                        Rewards you have already claimed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {claimedRewards.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Award className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Claimed Rewards
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Claim rewards to see them here
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {claimedRewards.map(
                                                (reward, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-4 rounded-lg border"
                                                    >
                                                        <div>
                                                            <h3 className="font-medium">
                                                                {
                                                                    reward
                                                                        .reward
                                                                        .title
                                                                }
                                                            </h3>
                                                            <div className="flex items-center mt-1">
                                                                <History className="h-4 w-4 text-muted-foreground mr-1" />
                                                                <p className="text-sm text-muted-foreground">
                                                                    Claimed{" "}
                                                                    {getRelativeTime(
                                                                        reward.claimedDate
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline">
                                                            Claimed
                                                        </Badge>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Plastic Collection History
                                </CardTitle>
                                <CardDescription>
                                    Track your recycling journey
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    <CollectionHistoryTable
                                        title="Unclaimed Requests"
                                        data={unclaimedRequests}
                                    />
                                    <CollectionHistoryTable
                                        title="Completed Requests"
                                        data={collectedPlastic}
                                        className="pt-4 border-t"
                                    />
                                    <CollectionHistoryTable
                                        title="Pending Requests"
                                        data={pendingRequests}
                                        className="pt-4 border-t"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

const CollectionHistoryTable = ({
    title,
    data,
    className,
}: {
    title: string
    data: any[]
    className?: string
}) => (
    <div className={`space-y-4 ${className}`}>
        <div className="flex items-center">
            <h3 className="text-lg font-medium">{title}</h3>
            <Badge variant="outline" className="ml-2">
                {data.length}
            </Badge>
        </div>
        {data && data.length > 0 ? (
            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16 font-medium">
                                S.No
                            </TableHead>
                            <TableHead className="font-medium">Time</TableHead>
                            <TableHead className="font-medium">
                                Amount (kg)
                            </TableHead>
                            <TableHead className="font-medium">
                                Status
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((collection, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {getRelativeTime(
                                        collection.collection_date
                                    )}
                                </TableCell>
                                <TableCell>
                                    {collection.amount_collected}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            title === "Completed Requests"
                                                ? "default"
                                                : title === "Pending Requests"
                                                  ? "secondary"
                                                  : "outline"
                                        }
                                        className={
                                            title === "Completed Requests"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                : ""
                                        }
                                    >
                                        {title === "Completed Requests"
                                            ? "Completed"
                                            : title === "Pending Requests"
                                              ? "Pending"
                                              : "Unclaimed"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center rounded-lg border bg-muted/20">
                <p className="text-muted-foreground">
                    No {title.toLowerCase()} found
                </p>
            </div>
        )}
    </div>
)
