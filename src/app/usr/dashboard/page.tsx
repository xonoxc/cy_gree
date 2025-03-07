"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import getRelativeTime from "@/utils/date"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Award, Gift, History, LogOut, Recycle } from "lucide-react"
import { ModeToggle } from "@/components/mode_toggle"
import { useRouter } from "next/navigation"
import {
    IAvailableRewards,
    IClaimedRewards,
    ICollection,
    IUserbadge,
    useClientstats,
} from "@/hooks/useClientstats"
import NotificationPopup from "@/components/notifications/notification-popup"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"
import { signOut } from "next-auth/react"
import { Separator } from "@/components/ui/separator"
import {
    CollectionHistoryTableSkeleton,
    SummaryCardSkeleton,
    ActivityStatsTabsSkeleton,
    CollectionSummaryCardSkeleton,
} from "./skeletons"
import { RequestStatus } from "@/types/requests.status"
import { ProfileCardSkeleton } from "@/components/profile/profile_sekeleton"

const CollectionForm = dynamic(
    () => import("@/components/collection/collection-form"),
    {
        ssr: false,
    }
)

const ProfileCard = dynamic(() => import("@/components/profile/profile_card"), {
    loading: () => <ProfileCardSkeleton />,
    ssr: false,
})

export default function UserDashboard() {
    const { data: session } = useSession()
    const {
        loading,
        userData,
        userBadges,
        availableRewards,
        pendingRequests,
        unclaimedRequests,
        collectedPlastic,
        claimedRewards,
        handelClaimReward,
    } = useClientstats(session?.user?.id)

    const router = useRouter()

    const { toast } = useToast()

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

    return (
        <div className="flex flex-col min-h-screen">
            <DashboardHeader onLogout={handleLogout} />
            <main className="flex-1 p-6">
                {/* Summary Cards */}
                <SummaryCards
                    loading={loading}
                    totalPlasticRecycled={userData.totalPlasticRecycled}
                    earnedPoints={userData.earnedPoints}
                    userBadges={userBadges}
                />

                <div className="flex justify-end mb-6">
                    <CollectionForm />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <ProfileCard userId={session?.user.id} />

                    <CollectionSummaryCard
                        loading={loading}
                        pendingRequests={pendingRequests}
                        collectedPlastic={collectedPlastic}
                        unclaimedRequests={unclaimedRequests}
                    />
                </div>

                <ActivityStatsTabs
                    loading={loading}
                    unclaimedRequests={unclaimedRequests}
                    earnedPoints={userData.earnedPoints}
                    onClaimedRewards={handleRewardsClaim}
                    claimedRewards={claimedRewards}
                    pendingRequests={pendingRequests}
                    collectedPlastic={collectedPlastic}
                    availableRewards={availableRewards}
                />
            </main>
        </div>
    )
}

const CollectionHistoryTable = ({
    loading,
    title,
    data,
    className,
}: {
    loading: RequestStatus
    title: string
    data: any[]
    className?: string
}) => {
    if (loading === "pending") {
        return <CollectionHistoryTableSkeleton />
    }

    return (
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
                                <TableHead className="font-medium">
                                    Time
                                </TableHead>
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
                                                    : title ===
                                                        "Pending Requests"
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
}

const DashboardHeader = ({ onLogout }: { onLogout: () => void }) => {
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <h1 className="text-xl font-semibold">User Dashboard</h1>
            <div className="ml-auto flex items-center gap-4">
                <NotificationPopup />
                <ModeToggle />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onLogout}
                    title="Logout"
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    )
}

const SummaryCards = ({
    loading,
    earnedPoints,
    totalPlasticRecycled,
    userBadges,
}: {
    loading: RequestStatus
    earnedPoints: string
    totalPlasticRecycled: string
    userBadges: IUserbadge[]
}) => {
    const pointsPercentage = Math.min((+earnedPoints / 2000) * 100, 100)
    const plasticPercentage = Math.min((+totalPlasticRecycled / 10) * 100, 100)

    if (loading === "pending") {
        return <SummaryCardSkeleton />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Points
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{+earnedPoints}</div>
                    <Progress value={pointsPercentage} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                        {+earnedPoints} points earned so far
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
                        {+totalPlasticRecycled} kg
                    </div>
                    <Progress value={plasticPercentage} className="h-2 mt-2" />
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
                            userBadges.slice(0, 3).map((badge, index) => (
                                <Badge key={index} variant="secondary">
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
    )
}

const CollectionSummaryCard = ({
    loading,
    collectedPlastic,
    unclaimedRequests,
    pendingRequests,
}: {
    loading: RequestStatus
    collectedPlastic: ICollection[]
    unclaimedRequests: ICollection[]
    pendingRequests: ICollection[]
}) => {
    if (loading === "pending") {
        return <CollectionSummaryCardSkeleton />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Collection Summary</CardTitle>
                <CardDescription>Your recycling activity</CardDescription>
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
                                    unclaimedRequests.length || 1)) *
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
                                    unclaimedRequests.length || 1)) *
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
                                    unclaimedRequests.length || 1)) *
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
                                new Date(b.collection_date).getTime() -
                                new Date(a.collection_date).getTime()
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
                                        {item.amount_collected} kg collected
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {getRelativeTime(item.collection_date)}
                                </span>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    )
}

const ActivityStatsTabs = ({
    loading,
    availableRewards,
    collectedPlastic,
    pendingRequests,
    unclaimedRequests,
    claimedRewards,
    earnedPoints,
    onClaimedRewards,
}: {
    loading: RequestStatus
    availableRewards: IAvailableRewards[]
    collectedPlastic: ICollection[]
    unclaimedRequests: ICollection[]
    pendingRequests: ICollection[]
    earnedPoints: string
    claimedRewards: IClaimedRewards[]
    onClaimedRewards: (id: string, expense: number) => Promise<void>
}) => {
    if (loading === "pending") {
        return <ActivityStatsTabsSkeleton />
    }

    return (
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
                            {availableRewards?.length === 0 ? (
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
                                    {availableRewards?.map((reward, index) => (
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
                                                        {reward.pointsRequired}{" "}
                                                        points required
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    onClaimedRewards(
                                                        String(reward.id),
                                                        Number(
                                                            reward.pointsRequired
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    +earnedPoints <
                                                    reward.pointsRequired
                                                }
                                            >
                                                Claim
                                            </Button>
                                        </div>
                                    ))}
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
                                    {claimedRewards.map((reward, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 rounded-lg border"
                                        >
                                            <div>
                                                <h3 className="font-medium">
                                                    {reward.reward.title}
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
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="history">
                <Card>
                    <CardHeader>
                        <CardTitle>Plastic Collection History</CardTitle>
                        <CardDescription>
                            Track your recycling journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <CollectionHistoryTable
                                loading={loading}
                                title="Unclaimed Requests"
                                data={unclaimedRequests}
                            />
                            <CollectionHistoryTable
                                loading={loading}
                                title="Completed Requests"
                                data={collectedPlastic}
                                className="pt-4 border-t"
                            />
                            <CollectionHistoryTable
                                loading={loading}
                                title="Pending Requests"
                                data={pendingRequests}
                                className="pt-4 border-t"
                            />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
