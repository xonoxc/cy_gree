"use client"

import { useAgrent } from "@/hooks/useAgent"
import { ModeToggle } from "@/components/mode_toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { User, UserCheck, Recycle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/services/auth"
import { useRouter } from "next/navigation"
import NotificationPopup from "@/components/notifications/notification-popup"
import useTokenStore from "@/store/token"
import getRelativeTime from "@/utils/date"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function RecyclingAgentDashboard() {
    const router = useRouter()
    const { id: agentId } = useTokenStore()
    const { toast } = useToast()
    const [menuOpen, setMenuOpen] = useState(false)

    const { requests, updateRequestStatus, totalWasteCollected } =
        useAgrent(agentId)

    const handleAcceptRequestClick = async (collectionId: string) => {
        try {
            await updateRequestStatus(collectionId)
            toast({
                title: "Request Accepted",
                description: "request has been updated",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.message || "Request not accepted",
                description: "Please try again later",
            })
        }
    }

    const handleLogout = () => {
        auth.logout()
        router.push("/sign-in")
    }

    return (
        <div className="relative min-h-screen">
            {/* Main Content */}
            <main className="p-4 sm:p-8 bg-gray-100 dark:bg-black min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
                        Recycling Agent Dashboard
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-5">
                        <NotificationPopup />
                        <ModeToggle />
                        <Button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="sm:hidden"
                            size="icon"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                        <Button
                            onClick={handleLogout}
                            className="hidden sm:inline-flex text-sm rounded-lg font-bold"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="sm:hidden mb-4">
                        <Button
                            onClick={handleLogout}
                            className="w-full text-sm rounded-lg font-bold"
                        >
                            Logout
                        </Button>
                    </div>
                )}

                {/* Key Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Pending Requests
                            </CardTitle>
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {requests.pending_requests?.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Completed Requests
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {requests.completed_requests?.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Total Waste (kg)
                            </CardTitle>
                            <Recycle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {totalWasteCollected}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="handovers" className="space-y-4">
                    <TabsList className="w-full border-black border-2 dark:border-0 dark:border-none">
                        <TabsTrigger
                            value="matches"
                            className="flex-1 dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Matches
                        </TabsTrigger>
                        <TabsTrigger
                            value="handovers"
                            className="flex-1 dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Pending
                        </TabsTrigger>
                        <TabsTrigger
                            value="collections"
                            className="flex-1 dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Completed
                        </TabsTrigger>
                    </TabsList>

                    {["matches", "handovers", "collections"].map(tabValue => (
                        <TabsContent
                            key={tabValue}
                            value={tabValue}
                            className="space-y-4"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
                                {tabValue === "matches"
                                    ? "User Matches"
                                    : tabValue === "handovers"
                                      ? "Pending Requests"
                                      : "Completed Requests"}
                            </h2>
                            <Card className="dark:bg-black dark:border-gray-700 overflow-x-auto">
                                <CardContent>
                                    {(tabValue === "matches" ||
                                    tabValue === "handovers"
                                        ? requests.pending_requests
                                        : requests.completed_requests
                                    )?.length === 0 ? (
                                        <span className="fallback w-full flex items-center justify-center mt-10">
                                            No{" "}
                                            {tabValue === "collections"
                                                ? "completed"
                                                : tabValue}{" "}
                                            requests
                                        </span>
                                    ) : (
                                        <Table>
                                            <TableHeader className="dark:bg-muted rounded-md">
                                                <TableRow>
                                                    <TableHead className="dark:text-gray-300">
                                                        S.no
                                                    </TableHead>
                                                    <TableHead className="dark:text-gray-300">
                                                        Amount (kg)
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
                                                {(tabValue === "matches" ||
                                                tabValue === "handovers"
                                                    ? requests.pending_requests
                                                    : requests.completed_requests
                                                )?.map((request, index) => (
                                                    <TableRow key={request.id}>
                                                        <TableCell className="font-medium dark:text-gray-300">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {
                                                                request.amount_collected
                                                            }
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {getRelativeTime(
                                                                request.collection_date
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {tabValue ===
                                                            "collections"
                                                                ? "completed"
                                                                : "pending"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                onClick={() =>
                                                                    tabValue !==
                                                                        "collections" &&
                                                                    handleAcceptRequestClick(
                                                                        request.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    tabValue ===
                                                                    "collections"
                                                                }
                                                            >
                                                                {tabValue ===
                                                                "collections"
                                                                    ? "Approved"
                                                                    : "Approve"}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </main>
        </div>
    )
}
