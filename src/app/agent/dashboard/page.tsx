"use client"

import { useAgent } from "@/hooks/useAgent"
import { ModeToggle } from "@/components/mode_toggle"
import * as UICard from "@/components/ui/card"
import * as UItable from "@/components/ui/table"
import * as Icon from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signOut, useSession } from "next-auth/react"
import { useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import * as UIdd from "@/components/ui/dropdown-menu"
import dynamic from "next/dynamic"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * dynamic import for Time component
 *
 *  this allows the Time component to be loaded only on the client side
 */

const Time = dynamic(() => import("@/components/time"), { ssr: false })

export default function RecyclingAgentDashboard() {
    const router = useRouter()
    const { data: session } = useSession()
    const { toast } = useToast()

    const {
        matches,
        requests,
        updateRequestStatus,
        totalWasteCollected,
        isError,
        acceptCollectionRequest,
        isLoading,
    } = useAgent(session?.user.id as string)

    const handleAcceptRequestClick = useCallback(
        (collectionId: string) => {
            acceptCollectionRequest(collectionId, {
                onSuccess: () => {
                    toast({
                        title: "Request Approved",
                        description:
                            "Collection request has been approved successfully",
                    })
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: error.message || "Request not accepted",
                        description: "Please try again later",
                    })
                },
            })
        },
        [acceptCollectionRequest, toast]
    )

    const handleClaimBtnClick = useCallback(
        (collectionId: string) => {
            updateRequestStatus(collectionId, {
                onSuccess: () => {
                    toast({
                        title: "Reward Claimed",
                        description: "Request has been updated successfully",
                    })
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: error.message || "Request not claimed",
                        description: "Please try again later",
                    })
                },
            })
        },
        [updateRequestStatus, toast]
    )

    const handleLogout = useCallback(async () => {
        await signOut()
        router.push("/sign-in")
    }, [router])

    const totalRequests =
        (requests.pending_requests?.length || 0) +
        (requests.claimed_requests?.length || 0)
    const completionPercentage =
        totalRequests > 0
            ? ((requests.claimed_requests?.length || 0) / totalRequests) * 100
            : 0

    if (isError) return <div>Error loading data</div>

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center justify-between w-full px-3">
                    <div className="flex items-center gap-2">
                        <Icon.Recycle className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-xl hidden md:inline-block">
                            EcoCollect
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <UIdd.DropdownMenu>
                            <UIdd.DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Icon.Bell className="h-4 w-4" />
                                </Button>
                            </UIdd.DropdownMenuTrigger>
                            <UIdd.DropdownMenuContent
                                align="end"
                                className="w-80"
                            >
                                <UIdd.DropdownMenuLabel>
                                    Notifications
                                </UIdd.DropdownMenuLabel>
                                <UIdd.DropdownMenuSeparator />
                                <div className="max-h-80 overflow-auto">
                                    <div className="flex flex-col gap-2 p-2">
                                        <div className="flex items-start gap-2 rounded-md p-2 hover:bg-muted">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <Icon.ClipboardCheck className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    New collection request
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    A new collection request has
                                                    been submitted
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    2 minutes ago
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2 rounded-md p-2 hover:bg-muted">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <Icon.UserCheck className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    Request approved
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    You approved a collection
                                                    request
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    1 hour ago
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </UIdd.DropdownMenuContent>
                        </UIdd.DropdownMenu>

                        <ModeToggle />

                        <UIdd.DropdownMenu>
                            <UIdd.DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={session?.user?.image || ""}
                                            alt={session?.user?.name || "Agent"}
                                        />
                                        <AvatarFallback>
                                            {session?.user?.name?.charAt(0) ||
                                                "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </UIdd.DropdownMenuTrigger>
                            <UIdd.DropdownMenuContent align="end">
                                <UIdd.DropdownMenuLabel>
                                    My Account
                                </UIdd.DropdownMenuLabel>
                                <UIdd.DropdownMenuSeparator />
                                <UIdd.DropdownMenuItem>
                                    <Icon.User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </UIdd.DropdownMenuItem>
                                <UIdd.DropdownMenuItem>
                                    <Icon.Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </UIdd.DropdownMenuItem>
                                <UIdd.DropdownMenuSeparator />
                                <UIdd.DropdownMenuItem onClick={handleLogout}>
                                    <Icon.LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </UIdd.DropdownMenuItem>
                            </UIdd.DropdownMenuContent>
                        </UIdd.DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-3">
                <div className="py-6">
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome back,{" "}
                            {session?.user?.name?.split(" ")[0] || "Agent"}.
                            Here's an overview of your recycling activities.
                        </p>
                    </div>

                    {/* Key Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <UICard.Card className="overflow-hidden border-none shadow-md">
                            <UICard.CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40">
                                <UICard.CardTitle className="text-sm font-medium">
                                    Pending Requests
                                </UICard.CardTitle>
                                <div className="rounded-full bg-background/90 p-2 shadow-sm">
                                    <Icon.User className="h-4 w-4 text-primary" />
                                </div>
                            </UICard.CardHeader>
                            <UICard.CardContent className="pt-6">
                                <div className="text-3xl font-bold">
                                    {requests.pending_requests?.length || 0}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <span>Awaiting your approval</span>
                                    {requests.pending_requests?.length > 0 && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-none"
                                        >
                                            Action needed
                                        </Badge>
                                    )}
                                </div>
                            </UICard.CardContent>
                        </UICard.Card>

                        <UICard.Card className="overflow-hidden border-none shadow-md">
                            <UICard.CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
                                <UICard.CardTitle className="text-sm font-medium">
                                    Completed Requests
                                </UICard.CardTitle>
                                <div className="rounded-full bg-background/90 p-2 shadow-sm">
                                    <Icon.UserCheck className="h-4 w-4 text-primary" />
                                </div>
                            </UICard.CardHeader>
                            <UICard.CardContent className="pt-6">
                                <div className="text-3xl font-bold">
                                    {requests.claimed_requests?.length || 0}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <span>Successfully processed</span>
                                    {requests.claimed_requests?.length > 0 && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-none"
                                        >
                                            Completed
                                        </Badge>
                                    )}
                                </div>
                            </UICard.CardContent>
                        </UICard.Card>

                        <UICard.Card className="overflow-hidden border-none shadow-md">
                            <UICard.CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40">
                                <UICard.CardTitle className="text-sm font-medium">
                                    Total Waste Collected
                                </UICard.CardTitle>
                                <div className="rounded-full bg-background/90 p-2 shadow-sm">
                                    <Icon.Recycle className="h-4 w-4 text-primary" />
                                </div>
                            </UICard.CardHeader>
                            <UICard.CardContent className="pt-6">
                                <div className="text-3xl font-bold">
                                    {totalWasteCollected.toFixed(2)} kg
                                </div>
                                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <span>Environmental impact</span>
                                    <Icon.ArrowUpRight className="ml-1 h-3 w-3 text-green-500" />
                                </div>
                            </UICard.CardContent>
                        </UICard.Card>
                    </div>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <UICard.Card className="lg:col-span-2 border-none shadow-md">
                            <UICard.CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <UICard.CardTitle>
                                        Collection Progress
                                    </UICard.CardTitle>
                                    <UICard.CardDescription>
                                        Your waste collection performance
                                    </UICard.CardDescription>
                                </div>
                                <UIdd.DropdownMenu>
                                    <UIdd.DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Icon.BarChart3 className="h-4 w-4" />
                                        </Button>
                                    </UIdd.DropdownMenuTrigger>
                                    <UIdd.DropdownMenuContent align="end">
                                        <UIdd.DropdownMenuItem>
                                            <Icon.Calendar className="mr-2 h-4 w-4" />
                                            <span>View by month</span>
                                        </UIdd.DropdownMenuItem>
                                        <UIdd.DropdownMenuItem>
                                            <Icon.LayoutDashboard className="mr-2 h-4 w-4" />
                                            <span>View detailed report</span>
                                        </UIdd.DropdownMenuItem>
                                    </UIdd.DropdownMenuContent>
                                </UIdd.DropdownMenu>
                            </UICard.CardHeader>
                            <UICard.CardContent>
                                <div className="space-y-4">
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
                                        className="h-3 rounded-full"
                                    />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {requests.claimed_requests
                                                ?.length || 0}{" "}
                                            of {totalRequests} requests
                                            completed
                                        </span>
                                        <span>
                                            {Math.round(completionPercentage)}%
                                            of goal
                                        </span>
                                    </div>
                                </div>
                            </UICard.CardContent>
                        </UICard.Card>

                        <UICard.Card className="border-none shadow-md">
                            <UICard.CardHeader>
                                <UICard.CardTitle>
                                    Quick Actions
                                </UICard.CardTitle>
                                <UICard.CardDescription>
                                    Common tasks
                                </UICard.CardDescription>
                            </UICard.CardHeader>
                            <UICard.CardContent>
                                <div className="space-y-2">
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Icon.ClipboardCheck className="mr-2 h-4 w-4" />
                                        <span>Review Pending Requests</span>
                                        <Icon.ChevronRight className="ml-auto h-4 w-4" />
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Icon.Users className="mr-2 h-4 w-4" />
                                        <span>View User Matches</span>
                                        <Icon.ChevronRight className="ml-auto h-4 w-4" />
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Icon.BarChart3 className="mr-2 h-4 w-4" />
                                        <span>Generate Reports</span>
                                        <Icon.ChevronRight className="ml-auto h-4 w-4" />
                                    </Button>
                                </div>
                            </UICard.CardContent>
                        </UICard.Card>
                    </div>

                    {/* Tabs for different sections */}
                    <Tabs defaultValue="handovers" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 rounded-lg p-1">
                            <TabsTrigger value="matches" className="rounded-md">
                                User Matches
                            </TabsTrigger>
                            <TabsTrigger
                                value="handovers"
                                className="rounded-md"
                            >
                                Pending Requests
                            </TabsTrigger>
                            <TabsTrigger
                                value="collections"
                                className="rounded-md"
                            >
                                Completed Requests
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="matches" className="space-y-4">
                            <UICard.Card className="border-none shadow-md">
                                <UICard.CardHeader>
                                    <UICard.CardTitle>
                                        User Matches
                                    </UICard.CardTitle>
                                    <UICard.CardDescription>
                                        Users matched with your collection area
                                    </UICard.CardDescription>
                                </UICard.CardHeader>
                                <UICard.CardContent>
                                    {matches?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="rounded-full bg-muted p-6 mb-4">
                                                <Icon.Users className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium">
                                                No User Matches
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                                You don't have any user matches
                                                at the moment. Check back later
                                                or expand your collection area.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border overflow-hidden">
                                            <UItable.Table>
                                                <UItable.TableHeader>
                                                    <UItable.TableRow>
                                                        <UItable.TableHead>
                                                            S.No
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Waste Amount (kg)
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Date
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Status
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Action
                                                        </UItable.TableHead>
                                                    </UItable.TableRow>
                                                </UItable.TableHeader>
                                                <UItable.TableBody>
                                                    {matches?.map(
                                                        (handover, index) => (
                                                            <UItable.TableRow
                                                                key={
                                                                    handover.id
                                                                }
                                                            >
                                                                <UItable.TableCell className="font-medium">
                                                                    {index + 1}
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    {
                                                                        handover.amount
                                                                    }
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Time
                                                                        timeStamp={
                                                                            handover.createdAt
                                                                        }
                                                                    />
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Badge variant="outline">
                                                                        Requested
                                                                    </Badge>
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleClaimBtnClick(
                                                                                handover.id
                                                                            )
                                                                        }
                                                                        className="rounded-full"
                                                                    >
                                                                        Claim
                                                                    </Button>
                                                                </UItable.TableCell>
                                                            </UItable.TableRow>
                                                        )
                                                    )}
                                                </UItable.TableBody>
                                            </UItable.Table>
                                        </div>
                                    )}
                                </UICard.CardContent>
                            </UICard.Card>
                        </TabsContent>

                        <TabsContent value="handovers" className="space-y-4">
                            <UICard.Card className="border-none shadow-md">
                                <UICard.CardHeader>
                                    <UICard.CardTitle>
                                        Pending Requests
                                    </UICard.CardTitle>
                                    <UICard.CardDescription>
                                        Requests awaiting your approval
                                    </UICard.CardDescription>
                                </UICard.CardHeader>
                                <UICard.CardContent>
                                    {requests.pending_requests?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="rounded-full bg-muted p-6 mb-4">
                                                <Icon.ClipboardCheck className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium">
                                                No Pending Requests
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                                You don't have any pending
                                                requests at the moment. All
                                                caught up!
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border overflow-hidden">
                                            <Icon.Table>
                                                <UItable.TableHeader>
                                                    <UItable.TableRow>
                                                        <UItable.TableHead>
                                                            S.No
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Waste Amount (kg)
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Date
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Status
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Action
                                                        </UItable.TableHead>
                                                    </UItable.TableRow>
                                                </UItable.TableHeader>
                                                <UItable.TableBody>
                                                    {requests.pending_requests?.map(
                                                        (handover, index) => (
                                                            <UItable.TableRow
                                                                key={
                                                                    handover.id
                                                                }
                                                            >
                                                                <UItable.TableCell className="font-medium">
                                                                    {index + 1}
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    {
                                                                        handover.amount
                                                                    }
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Time
                                                                        timeStamp={
                                                                            handover.createdAt
                                                                        }
                                                                    />
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Badge variant="secondary">
                                                                        Pending
                                                                    </Badge>
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleAcceptRequestClick(
                                                                                handover.id
                                                                            )
                                                                        }
                                                                        className="rounded-full"
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                </UItable.TableCell>
                                                            </UItable.TableRow>
                                                        )
                                                    )}
                                                </UItable.TableBody>
                                            </Icon.Table>
                                        </div>
                                    )}
                                </UICard.CardContent>
                            </UICard.Card>
                        </TabsContent>

                        <TabsContent value="collections" className="space-y-4">
                            <UICard.Card className="border-none shadow-md">
                                <UICard.CardHeader>
                                    <UICard.CardTitle>
                                        Completed Requests
                                    </UICard.CardTitle>
                                    <UICard.CardDescription>
                                        Successfully processed collection
                                        requests
                                    </UICard.CardDescription>
                                </UICard.CardHeader>
                                <UICard.CardContent>
                                    {requests.claimed_requests.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className="rounded-full bg-muted p-6 mb-4">
                                                <Icon.Trash2 className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-medium">
                                                No Completed Requests
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                                You haven't completed any
                                                requests yet. Start by approving
                                                pending requests.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border overflow-hidden">
                                            <UItable.Table>
                                                <UItable.TableHeader>
                                                    <UItable.TableRow>
                                                        <UItable.TableHead>
                                                            S.No
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Total Collected (kg)
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Last Collection
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Status
                                                        </UItable.TableHead>
                                                        <UItable.TableHead>
                                                            Action
                                                        </UItable.TableHead>
                                                    </UItable.TableRow>
                                                </UItable.TableHeader>
                                                <UItable.TableBody>
                                                    {requests.claimed_requests.map(
                                                        (collection, index) => (
                                                            <UItable.TableRow
                                                                key={
                                                                    collection.id
                                                                }
                                                            >
                                                                <UItable.TableCell className="font-medium">
                                                                    {index + 1}
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    {
                                                                        collection.amount
                                                                    }
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Time
                                                                        timeStamp={
                                                                            collection.createdAt
                                                                        }
                                                                    />
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Badge
                                                                        variant="default"
                                                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                                    >
                                                                        Completed
                                                                    </Badge>
                                                                </UItable.TableCell>
                                                                <UItable.TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        disabled
                                                                        className="rounded-full"
                                                                    >
                                                                        Approved
                                                                    </Button>
                                                                </UItable.TableCell>
                                                            </UItable.TableRow>
                                                        )
                                                    )}
                                                </UItable.TableBody>
                                            </UItable.Table>
                                        </div>
                                    )}
                                </UICard.CardContent>
                            </UICard.Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
