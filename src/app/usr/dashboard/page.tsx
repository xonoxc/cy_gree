"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import getRelativeTime from "@/utils/date"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Save } from "lucide-react"
import { ModeToggle } from "@/components/mode_toggle"
import { useRouter } from "next/navigation"
import { auth } from "@/services/auth"
import { useClientstats } from "@/hooks/useClientstats"
import NotificationPopup from "@/components/notifications/notification-popup"
import { useToast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"

const CollectionForm = dynamic(
    () => import("@/components/collection/collection-form"),
    {
        loading: () => <p>Loading...</p>,
    }
)

export default function UserDashboard() {
    const [editing, setEditing] = useState(false)
    const [avatar, setAvatar] = useState<File | null>(null)
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
    } = useClientstats()

    const router = useRouter()
    const { toast } = useToast()

    const handleEditToggle = async () => {
        try {
            if (editing) {
                const result = await handleProfileUpdate(avatar as File)
                if (result.status === 200) {
                    toast({
                        title: "changed saved successfully!",
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
    }

    const handleAvtarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAvatar(e.target.files[0])
        }
    }

    const handleRewardsClaim = async (id: string, expense: number) => {
        try {
            await handelClaimReward(id, expense)
            toast({
                title: "Reward Claimed",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.message || "cannot claim reward",
            })
        }
    }

    const handleLogout = useCallback(async () => {
        auth.logout()
        router.push("/sign-in")
    }, [router])

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold dark:text-white">
                        <span className="dark:text-white text-black">Cy</span>
                        <span className="text-green-300">Gree</span>
                    </h1>

                    <div className="flex gap-2 items-center justify-center">
                        <NotificationPopup />
                        <ModeToggle />
                        <Button
                            onClick={handleLogout}
                            className="font-bold rounded-lg"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="md:col-span-2 dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold dark:text-white">
                                Profile Information
                            </CardTitle>
                            <Button
                                onClick={handleEditToggle}
                                variant="ghost"
                                size="sm"
                            >
                                {editing ? (
                                    <Save className="mr-2 h-4 w-4" />
                                ) : (
                                    <Edit className="mr-2 h-4 w-4" />
                                )}
                                {editing ? "Save" : "Edit"}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4 mb-4">
                                {editing ? (
                                    <Input
                                        type="file"
                                        className="w-1/3"
                                        onChange={handleAvtarChange}
                                    />
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
                                    <h2 className="text-2xl font-bold dark:text-white">
                                        {userData.name}
                                    </h2>
                                    <p className="text-white bg-black dark:text-black dark:bg-white p-1 flex items-center justify-center  mt-3 text-xs rounded font-bold">
                                        user
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="dark:text-gray-300"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="dark:bg-black dark:text-white"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="phone"
                                        className="dark:text-gray-300"
                                    >
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="text"
                                        maxLength={10}
                                        value={userData.phone_number}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="dark:bg-black dark:text-white"
                                    />
                                </div>
                                <div>
                                    <Label
                                        htmlFor="address"
                                        className="dark:text-gray-300"
                                    >
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={userData.address}
                                        onChange={e => handleInputChange(e)}
                                        disabled={!editing}
                                        className="dark:bg-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="city"
                                        className="dark:text-gray-300"
                                    >
                                        City
                                    </Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={userData.city}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="dark:bg-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="state"
                                        className="dark:text-gray-300"
                                    >
                                        State
                                    </Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={userData.state}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="dark:bg-black dark:text-white"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="country"
                                        className="dark:text-gray-300"
                                    >
                                        Country
                                    </Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={userData.country}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="dark:bg-black dark:text-white"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold dark:text-white">
                                Eco Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium dark:text-gray-300">
                                            Total Points
                                        </span>
                                        <span className="text-sm font-medium dark:text-gray-300">
                                            {userData.earned_points}
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            Number(userData.earned_points) / 20
                                        }
                                        className="h-2"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium dark:text-gray-300">
                                            Plastic Collected
                                        </span>
                                        <span className="text-sm font-medium dark:text-gray-300">
                                            {userData.total_plastic_recycled} kg
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            Number(
                                                userData.total_plastic_recycled
                                            ) * 10
                                        }
                                        className="h-2"
                                    />
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                                        Badges Earned
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {userBadges?.length > 0 ? (
                                            userBadges.map((badge, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                >
                                                    {badge.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No badges earned yet
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full flex items-center justify-end">
                    <CollectionForm />
                </div>

                <Tabs defaultValue="rewards" className="space-y-4">
                    <TabsList className="border-black border-2 dark:border-0 dark:border-none">
                        <TabsTrigger
                            value="rewards"
                            className="dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Rewards
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Collection History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="rewards">
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold dark:text-white">
                                    Available Rewards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {availableRewards.map((reward, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-lg shadow"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold dark:text-white">
                                                    {reward.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {reward.points_required}{" "}
                                                    points required
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    handleRewardsClaim(
                                                        String(reward.id),
                                                        Number(
                                                            reward.points_required
                                                        )
                                                    )
                                                }
                                            >
                                                Claim
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="dark:bg-black dark:border-gray-700 mt-12">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold dark:text-white">
                                    Claimed Rewards
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {claimedRewards.map((reward, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-lg shadow"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold dark:text-white">
                                                    {reward.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 flex gap-2">
                                                    <span>claimed</span>
                                                    {getRelativeTime(
                                                        reward.claimed_date
                                                    )}
                                                </p>
                                            </div>
                                            <Button disabled>Claimed</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">
                                    Plastic Collection History
                                </CardTitle>
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
                                        className="pt-4 border-t dark:border-gray-800"
                                    />
                                    <CollectionHistoryTable
                                        title="Pending Requests"
                                        data={pendingRequests}
                                        className="pt-4 border-t dark:border-gray-800"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
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
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
            {title}
        </h3>
        {data && data.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-muted">
                        <TableRow>
                            <TableHead className="w-16 font-semibold">
                                S.no.
                            </TableHead>
                            <TableHead className="font-semibold">
                                Time
                            </TableHead>
                            <TableHead className="font-semibold">
                                Amount (kg)
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-muted rounded-lg">
                No {title.toLowerCase()} found
            </div>
        )}
    </div>
)
