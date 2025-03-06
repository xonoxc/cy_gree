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
import {
    BarChart3,
    ClipboardCheck,
    Home,
    LogOut,
    Recycle,
    Settings,
    Trash2,
    User,
    UserCheck,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import NotificationPopup from "@/components/notifications/notification-popup"
import getRelativeTime from "@/utils/date"
import { useToast } from "@/hooks/use-toast"
import { signOut, useSession } from "next-auth/react"
import { useCallback } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function RecyclingAgentDashboard() {
    const router = useRouter()
    const { data: session } = useSession()
    const { toast } = useToast()

    const {
        matches,
        requests,
        updateRequestStatus,
        totalWasteCollected,
        acceptCollectionRequest,
    } = useAgent(session?.user.id as string)

    const handleAcceptRequestClick = async (collectionId: string) => {
        try {
            await acceptCollectionRequest(collectionId)

            toast({
                title: "Request Approved",
                description:
                    "Collection request has been approved successfully",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: error.message || "Request not accepted",
                description: "Please try again later",
            })
        }
    }

    const handleClaimBtnClick = useCallback(
        async (id: string) => {
            try {
                await updateRequestStatus(id)

                toast({
                    title: "Reward Claimed",
                    description: "Request has been updated successfully",
                })
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: error.message || "Request not claimed",
                    description: "Please try again later",
                })
            }
        },
        [updateRequestStatus, toast]
    )

    const handleLogout = useCallback(async () => {
        await signOut()
        router.push("/sign-in")
    }, [router])

    // Calculate completion percentage for progress bar
    const totalRequests =
        (requests.pending_requests?.length || 0) +
        (requests.completed_requests?.length || 0)
    const completionPercentage =
        totalRequests > 0
            ? ((requests.completed_requests?.length || 0) / totalRequests) * 100
            : 0

    return (
        <SidebarProvider>
            <Sidebar className="border-r">
                <SidebarHeader className="border-b px-6 py-3">
                    <div className="flex items-center gap-2">
                        <Recycle className="h-6 w-6 text-primary" />
                        <div className="font-semibold text-xl">EcoCollect</div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive>
                                <a href="#">
                                    <Home />
                                    <span>Dashboard</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="#">
                                    <Users />
                                    <span>User Matches</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="#">
                                    <ClipboardCheck />
                                    <span>Pending Requests</span>
                                    {requests.pending_requests?.length > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="ml-auto"
                                        >
                                            {requests.pending_requests?.length}
                                        </Badge>
                                    )}
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="#">
                                    <Trash2 />
                                    <span>Waste Collections</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="#">
                                    <BarChart3 />
                                    <span>Analytics</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="#">
                                    <Settings />
                                    <span>Settings</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="border-t p-4">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback>
                                {session?.user?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {session?.user?.name || "Agent"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {session?.user?.email || "agent@example.com"}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="ml-auto"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                    <SidebarTrigger />
                    <h1 className="text-xl font-semibold">
                        Recycling Agent Dashboard
                    </h1>
                    <div className="ml-auto flex items-center gap-4">
                        <NotificationPopup />
                        <ModeToggle />
                    </div>
                </header>
                <main className="flex-1 p-6">
                    {/* Key Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Requests
                                </CardTitle>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {requests.pending_requests?.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Awaiting your approval
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Completed Requests
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {requests.completed_requests?.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Successfully processed
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Waste Collected
                                </CardTitle>
                                <Recycle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {totalWasteCollected.toFixed(2)} kg
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Environmental impact
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Progress Overview */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Collection Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Completion Rate
                                    </span>
                                    <span className="text-sm font-medium">
                                        {Math.round(completionPercentage)}%
                                    </span>
                                </div>
                                <Progress
                                    value={completionPercentage}
                                    className="h-2"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {requests.completed_requests?.length || 0}{" "}
                                    of {totalRequests} requests completed
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabs for different sections */}
                    <Tabs defaultValue="handovers" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="matches">
                                User Matches
                            </TabsTrigger>
                            <TabsTrigger value="handovers">
                                Pending Requests
                            </TabsTrigger>
                            <TabsTrigger value="collections">
                                Completed Requests
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="matches" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Matches</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {matches?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No User Matches
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                You don't have any user matches
                                                at the moment.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            S.No
                                                        </TableHead>
                                                        <TableHead>
                                                            Waste Amount (kg)
                                                        </TableHead>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Action
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {matches?.map(
                                                        (handover, index) => (
                                                            <TableRow
                                                                key={
                                                                    handover.id
                                                                }
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        handover.amount_collected
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getRelativeTime(
                                                                        handover.collection_date
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline">
                                                                        Requested
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleClaimBtnClick(
                                                                                handover.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Claim
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="handovers" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {requests.pending_requests?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Pending Requests
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                You don't have any pending
                                                requests at the moment.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            S.No
                                                        </TableHead>
                                                        <TableHead>
                                                            Waste Amount (kg)
                                                        </TableHead>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Action
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {requests.pending_requests?.map(
                                                        (handover, index) => (
                                                            <TableRow
                                                                key={
                                                                    handover.id
                                                                }
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        handover.amount_collected
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getRelativeTime(
                                                                        handover.collection_date
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary">
                                                                        Pending
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="sm"
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
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="collections" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Completed Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {requests.completed_requests.length ===
                                    0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-medium">
                                                No Completed Requests
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                You haven't completed any
                                                requests yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            S.No
                                                        </TableHead>
                                                        <TableHead>
                                                            Total Collected (kg)
                                                        </TableHead>
                                                        <TableHead>
                                                            Last Collection
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Action
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {requests.completed_requests.map(
                                                        (collection, index) => (
                                                            <TableRow
                                                                key={
                                                                    collection.id
                                                                }
                                                            >
                                                                <TableCell className="font-medium">
                                                                    {index + 1}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        collection.amount_collected
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getRelativeTime(
                                                                        collection.collection_date
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="default"
                                                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                    >
                                                                        Completed
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled
                                                                    >
                                                                        Approved
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
