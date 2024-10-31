"use client"

import { useState } from "react"
import { ModeToggle } from "@/components/mode_toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { User, UserCheck, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/services/auth"
import { useRouter } from "next/navigation"
import NotificationPopup from "@/components/notifications/notification-popup"

type UserMatch = {
    id: number
    userName: string
    location: string
    wasteAmount: number
    status: "Pending" | "Matched" | "Completed"
}

type PlasticHandover = {
    id: number
    userName: string
    wasteAmount: number
    date: string
    status: "Pending" | "Verified" | "Rejected"
}

type UserCollection = {
    id: number
    userName: string
    totalCollected: number
    lastCollection: string
    status: "Active" | "Inactive"
}

export default function RecyclingAgentDashboard() {
    const [userMatches, setUserMatches] = useState<UserMatch[]>([
        {
            id: 1,
            userName: "Alice Smith",
            location: "Downtown",
            wasteAmount: 5,
            status: "Pending",
        },
        {
            id: 2,
            userName: "Bob Johnson",
            location: "Suburb",
            wasteAmount: 3,
            status: "Matched",
        },
        {
            id: 3,
            userName: "Carol Williams",
            location: "City Center",
            wasteAmount: 7,
            status: "Completed",
        },
    ])
    const [plasticHandovers, setPlasticHandovers] = useState<PlasticHandover[]>(
        [
            {
                id: 1,
                userName: "Alice Smith",
                wasteAmount: 5,
                date: "2023-05-15",
                status: "Pending",
            },
            {
                id: 2,
                userName: "Bob Johnson",
                wasteAmount: 3,
                date: "2023-05-14",
                status: "Verified",
            },
            {
                id: 3,
                userName: "Carol Williams",
                wasteAmount: 7,
                date: "2023-05-13",
                status: "Rejected",
            },
        ]
    )
    const [userCollections, setUserCollections] = useState<UserCollection[]>([
        {
            id: 1,
            userName: "Alice Smith",
            totalCollected: 50,
            lastCollection: "2023-05-15",
            status: "Active",
        },
        {
            id: 2,
            userName: "Bob Johnson",
            totalCollected: 30,
            lastCollection: "2023-05-10",
            status: "Active",
        },
        {
            id: 3,
            userName: "Carol Williams",
            totalCollected: 70,
            lastCollection: "2023-05-01",
            status: "Inactive",
        },
    ])

    const router = useRouter()

    const updateUserMatchStatus = (
        id: number,
        status: "Pending" | "Matched" | "Completed"
    ) => {
        setUserMatches(
            userMatches.map(match =>
                match.id === id ? { ...match, status } : match
            )
        )
    }

    const updateHandoverStatus = (
        id: number,
        status: "Pending" | "Verified" | "Rejected"
    ) => {
        setPlasticHandovers(handovers =>
            handovers.map(handover =>
                handover.id === id ? { ...handover, status } : handover
            )
        )
    }

    const updateUserCollectionStatus = (
        id: number,
        status: "Active" | "Inactive"
    ) => {
        setUserCollections(collections =>
            collections.map(collection =>
                collection.id === id ? { ...collection, status } : collection
            )
        )
    }

    const handleLogout = () => {
        auth.logout()
        router.push("/sign-in")
    }

    return (
        <div className={`relative min-h-screen`}>
            {/* Main Content */}
            <main className="p-8 bg-gray-100 dark:bg-black min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold dark:text-white">
                        Recycling Agent Dashboard
                    </h1>
                    <div className="flex gap-5">
                        <NotificationPopup />
                        <ModeToggle />
                        <Button
                            onClick={handleLogout}
                            className="text-sm rounded-lg font-bold"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Pending Matches
                            </CardTitle>
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {
                                    userMatches.filter(
                                        match => match.status === "Pending"
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Pending Verifications
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {
                                    plasticHandovers.filter(
                                        handover =>
                                            handover.status === "Pending"
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Total Waste Collected (kg)
                            </CardTitle>
                            <Recycle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {userCollections.reduce(
                                    (total, collection) =>
                                        total + collection.totalCollected,
                                    0
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="matches" className="space-y-4">
                    <TabsList className="border-black border-2 dark:border-0 dark:border-none">
                        <TabsTrigger
                            value="matches"
                            className="dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            User Matches
                        </TabsTrigger>
                        <TabsTrigger
                            value="handovers"
                            className="dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Plastic Handovers
                        </TabsTrigger>
                        <TabsTrigger
                            value="collections"
                            className="dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            User Collections
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="matches" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            User Matches
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                <Table>
                                    <TableHeader className="dark:bg-muted">
                                        <TableRow>
                                            <TableHead className="dark:text-gray-300">
                                                User
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Location
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Waste Amount (kg)
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Status
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userMatches.map(match => (
                                            <TableRow key={match.id}>
                                                <TableCell className="font-medium dark:text-gray-300">
                                                    {match.userName}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {match.location}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {match.wasteAmount}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {match.status}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        onValueChange={value =>
                                                            updateUserMatchStatus(
                                                                match.id,
                                                                value as
                                                                    | "Pending"
                                                                    | "Matched"
                                                                    | "Completed"
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Update status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pending">
                                                                Pending
                                                            </SelectItem>
                                                            <SelectItem value="Matched">
                                                                Matched
                                                            </SelectItem>
                                                            <SelectItem value="Completed">
                                                                Completed
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="handovers" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            Plastic Handovers
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                <Table>
                                    <TableHeader className="dark:bg-muted rounded-md">
                                        <TableRow>
                                            <TableHead className="dark:text-gray-300">
                                                User
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Waste Amount (kg)
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Date
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Status
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {plasticHandovers.map(handover => (
                                            <TableRow key={handover.id}>
                                                <TableCell className="font-medium dark:text-gray-300">
                                                    {handover.userName}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {handover.wasteAmount}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {handover.date}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {handover.status}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        onValueChange={value =>
                                                            updateHandoverStatus(
                                                                handover.id,
                                                                value as
                                                                    | "Pending"
                                                                    | "Verified"
                                                                    | "Rejected"
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Update status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Pending">
                                                                Pending
                                                            </SelectItem>
                                                            <SelectItem value="Verified">
                                                                Verified
                                                            </SelectItem>
                                                            <SelectItem value="Rejected">
                                                                Rejected
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="collections" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            User Collections
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="dark:bg-muted">
                                            <TableHead className="dark:text-gray-300">
                                                User
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Total Collected (kg)
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Last Collection
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Status
                                            </TableHead>
                                            <TableHead className="dark:text-gray-300">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {userCollections.map(collection => (
                                            <TableRow key={collection.id}>
                                                <TableCell className="font-medium dark:text-gray-300">
                                                    {collection.userName}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {collection.totalCollected}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {collection.lastCollection}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-300">
                                                    {collection.status}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        onValueChange={value =>
                                                            updateUserCollectionStatus(
                                                                collection.id,
                                                                value as
                                                                    | "Active"
                                                                    | "Inactive"
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Update status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Active">
                                                                Active
                                                            </SelectItem>
                                                            <SelectItem value="Inactive">
                                                                Inactive
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
