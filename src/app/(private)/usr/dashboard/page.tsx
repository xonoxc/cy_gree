"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { auth } from "@/services/auth"
import { useRouter } from "next/navigation"

type Reward = {
    id: number
    name: string
    points: number
    claimed: boolean
}

type PlasticCollection = {
    id: number
    date: string
    amount: number
    location: string
}

export default function UserDashboard() {
    const [editing, setEditing] = useState(false)
    const [userData, setUserData] = useState({
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 234 567 8901",
        address: "123 Green Street, Eco City, EC 12345",
    })
    const [rewards, setRewards] = useState<Reward[]>([
        {
            id: 1,
            name: "Eco-friendly Water Bottle",
            points: 500,
            claimed: false,
        },
        { id: 2, name: "Reusable Shopping Bag", points: 300, claimed: true },
        { id: 3, name: "Plant a Tree", points: 1000, claimed: false },
    ])
    const [plasticCollections] = useState<PlasticCollection[]>([
        {
            id: 1,
            date: "2023-05-15",
            amount: 2.5,
            location: "Local Recycling Center",
        },
        {
            id: 2,
            date: "2023-05-10",
            amount: 1.8,
            location: "Community Clean-up Event",
        },
        { id: 3, date: "2023-05-05", amount: 3.2, location: "Home Collection" },
    ])

    const totalPoints = 750
    const totalCollected = plasticCollections.reduce(
        (sum, collection) => sum + collection.amount,
        0
    )

    const router = useRouter()

    const handleEditToggle = () => {
        setEditing(!editing)
        if (editing) {
            console.log("Saving user data:", userData)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData(prevData => ({ ...prevData, [name]: value }))
    }

    const handleClaimReward = (id: number) => {
        setRewards(
            rewards.map(reward =>
                reward.id === id ? { ...reward, claimed: true } : reward
            )
        )
    }

    const handleLogout = () => {
        auth.logout()
        router.replace("/sign-in")
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold dark:text-white">
                        User Dashboard
                    </h1>

                    <div className="flex gap-2 items-center justify-center">
                        <Button onClick={handleLogout} className="font-bold">
                            Logout
                        </Button>
                        <ModeToggle />
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
                                <Avatar className="h-20 w-20">
                                    <AvatarImage
                                        src="/placeholder-avatar.jpg"
                                        alt={userData.name}
                                    />
                                    <AvatarFallback>
                                        {userData.name
                                            .split(" ")
                                            .map(n => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold dark:text-white">
                                        {userData.name}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Eco Warrior
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
                                        id="phone"
                                        name="phone"
                                        value={userData.phone}
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
                                            {totalPoints}
                                        </span>
                                    </div>
                                    <Progress
                                        value={totalPoints / 20}
                                        className="h-2"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium dark:text-gray-300">
                                            Plastic Collected
                                        </span>
                                        <span className="text-sm font-medium dark:text-gray-300">
                                            {totalCollected.toFixed(1)} kg
                                        </span>
                                    </div>
                                    <Progress
                                        value={totalCollected * 10}
                                        className="h-2"
                                    />
                                </div>
                                <div className="pt-4">
                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                                        Badges Earned
                                    </h3>
                                    <div className="flex space-x-2">
                                        <Badge variant="secondary">
                                            Recycling Rookie
                                        </Badge>
                                        <Badge variant="secondary">
                                            Plastic Warrior
                                        </Badge>
                                        <Badge variant="secondary">
                                            Eco Champion
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="rewards" className="space-y-4">
                    <TabsList>
                        <TabsTrigger
                            value="rewards"
                            className="dark:text-gray-300 dark:data-[state=active]:bg-black dark:data-[state=active]:text-white"
                        >
                            Rewards
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="dark:text-gray-300 dark:data-[state=active]:bg-black dark:data-[state=active]:text-white"
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
                                    {rewards.map(reward => (
                                        <div
                                            key={reward.id}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-lg shadow"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold dark:text-white">
                                                    {reward.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {reward.points} points
                                                    required
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    handleClaimReward(reward.id)
                                                }
                                                disabled={
                                                    reward.claimed ||
                                                    totalPoints < reward.points
                                                }
                                                className="dark:bg-green-600 dark:text-white dark:hover:bg-green-700"
                                            >
                                                {reward.claimed
                                                    ? "Claimed"
                                                    : "Claim"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold dark:text-white">
                                    Plastic Collection History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="dark:text-gray-300">
                                                Date
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Amount (kg)
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Location
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {plasticCollections.map(collection => (
                                            <TableRow key={collection.id}>
                                                <TableCell className="font-medium dark:text-gray-300">
                                                    {collection.date}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {collection.amount}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {collection.location}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
