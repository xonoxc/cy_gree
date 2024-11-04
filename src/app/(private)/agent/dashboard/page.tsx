"use client"

import { useAgent } from "@/hooks/useAgent"
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
import { User, UserCheck, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/services/auth"
import { useRouter } from "next/navigation"
import NotificationPopup from "@/components/notifications/notification-popup"
import useTokenStore from "@/store/token"
import getRelativeTime from "@/utils/date"
import { useToast } from "@/hooks/use-toast"

export default function RecyclingAgentDashboard() {
    const router = useRouter()
    const { id: agentId } = useTokenStore()
    const { toast } = useToast()

    const {
        matches,
        requests,
        updateRequestStatus,
        totalWasteCollected,
        acceptCollectionRequest,
    } = useAgent(agentId)

    const handleAcceptRequestClick = async (collectionId: string) => {
        try {
            await acceptCollectionRequest(collectionId)

            toast({
                title: "Reward Granted",
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

    const handleClaimBtnClick = async (id: string) => {
        try {
            await updateRequestStatus(id)

            toast({
                title: "Reward Claimed",
                description: "request has been updated",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.message || "Request not claimed",
                description: "Please try again later",
            })
        }
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
                        <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0 pb-2">
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
                                Total Waste Collected (kg)
                            </CardTitle>
                            <Recycle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {totalWasteCollected.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="handovers" className="space-y-4">
                    <TabsList className="border-black border-2 dark:border-0 md:w-full flex items-center justify-around dark:border-none">
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
                            Pending Requests
                        </TabsTrigger>
                        <TabsTrigger
                            value="collections"
                            className="dark:text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Completed Requests
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="matches" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            User Matches
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                {matches?.length === 0 ? (
                                    <span className="fallback w-full flex items-center justify-center mt-10">
                                        No user matches
                                    </span>
                                ) : (
                                    <Table>
                                        <TableHeader className="dark:bg-muted rounded-md">
                                            <TableRow>
                                                <TableHead className="dark:text-gray-300">
                                                    S.no
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
                                            {matches?.map((handover, index) => (
                                                <TableRow key={handover.id}>
                                                    <TableCell className="font-medium dark:text-gray-300">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="dark:text-gray-300">
                                                        {
                                                            handover.amount_collected
                                                        }
                                                    </TableCell>
                                                    <TableCell className="dark:text-gray-300">
                                                        {getRelativeTime(
                                                            handover.collection_date
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="dark:text-gray-300">
                                                        Requested
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            onClick={() =>
                                                                handleClaimBtnClick(
                                                                    handover.id
                                                                )
                                                            }
                                                        >
                                                            claim
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

                    <TabsContent value="handovers" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            Pending Requests
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                {requests.pending_requests?.length === 0 ? (
                                    <span className="fallback w-full flex items-center justify-center mt-10">
                                        No pending requests
                                    </span>
                                ) : (
                                    <Table>
                                        <TableHeader className="dark:bg-muted rounded-md">
                                            <TableRow>
                                                <TableHead className="dark:text-gray-300">
                                                    S.no
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
                                            {requests.pending_requests?.map(
                                                (handover, index) => (
                                                    <TableRow key={handover.id}>
                                                        <TableCell className="font-medium dark:text-gray-300">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {
                                                                handover.amount_collected
                                                            }
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {getRelativeTime(
                                                                handover.collection_date
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {"pending"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                onClick={() =>
                                                                    handleAcceptRequestClick(
                                                                        handover.id
                                                                    )
                                                                }
                                                            >
                                                                Approve
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="collections" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            User Collections
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                {requests.completed_requests.length === 0 ? (
                                    <span className="fallback w-full flex items-center justify-center mt-10">
                                        No completed requests yet
                                    </span>
                                ) : (
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
                                            {requests.completed_requests.map(
                                                (collection, index) => (
                                                    <TableRow
                                                        key={collection.id}
                                                    >
                                                        <TableCell className="font-medium dark:text-gray-300">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {
                                                                collection.amount_collected
                                                            }
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            {getRelativeTime(
                                                                collection.collection_date
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="dark:text-gray-300">
                                                            completed
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button disabled>
                                                                Approved
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
