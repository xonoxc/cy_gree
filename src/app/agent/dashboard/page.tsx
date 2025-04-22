"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
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
import { Award, History, LogOut, Recycle } from "lucide-react"
import { ModeToggle } from "@/components/mode_toggle"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"
import { useAgent } from "@/hooks/useAgent"

const Time = dynamic(() => import("@/components/time"), {
    ssr: false,
    loading: () => <Skeleton className="h-4 w-1/2" />,
})

export default function RecyclingAgentDashboard() {
    const router = useRouter()
    const { toast } = useToast()

    const {
        matches,
        requests,
        updateRequestStatus,
        totalWasteCollected,
        isError,
        acceptCollectionRequest,
        isLoading,
    } = useAgent()

    const handleAcceptRequestClick = useCallback(
        (collectionId: string) => {
            acceptCollectionRequest(collectionId, {
                onSuccess: () => {
                    toast({ title: "Request Accepted" })
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: error.message || "Failed to accept request",
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
                    toast({ title: "Request Claimed" })
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: error.message || "Failed to claim request",
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

    if (isError)
        return <div className="p-4 text-center">Error loading data</div>
    if (isLoading)
        return (
            <div className="h-screen w-screen flex items-center justify-center p-4 text-center">
                Loading...
            </div>
        )

    return (
        <div className="flex flex-col min-h-screen bg-[#0f0f12] to-black">
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <h1 className="text-xl font-semibold">Agent Dashboard</h1>
                <div className="ml-auto flex items-center gap-4">
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
                <SummaryCards
                    matches={matches.length}
                    pendingRequests={requests.claimedRequests.length}
                    totalWasteCollected={totalWasteCollected}
                />
                <ActivityStatsTabs
                    matches={matches}
                    pendingRequests={requests.claimedRequests}
                    completedRequests={requests.collectedRequests}
                    onAcceptRequest={handleAcceptRequestClick}
                    onClaimRequest={handleClaimBtnClick}
                />
            </main>
        </div>
    )
}

const SummaryCards = ({
    matches,
    pendingRequests,
    totalWasteCollected,
}: {
    matches: number
    pendingRequests: number
    totalWasteCollected: number
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        User Matches
                    </CardTitle>
                    <Recycle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{matches}</div>
                    <Progress
                        value={(matches / 10) * 100}
                        className="h-2 mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {matches} matches found
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Pending Requests
                    </CardTitle>
                    <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingRequests}</div>
                    <Progress
                        value={(pendingRequests / 10) * 100}
                        className="h-2 mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        {pendingRequests} requests pending
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Collected
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {totalWasteCollected.toFixed(2)} kg
                    </div>
                    <Progress
                        value={(totalWasteCollected / 100) * 100}
                        className="h-2 mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Great job! Keep recycling
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

const ActivityStatsTabs = ({
    matches,
    pendingRequests,
    completedRequests,
    onAcceptRequest,
    onClaimRequest,
}: {
    matches: any[]
    pendingRequests: any[]
    completedRequests: any[]
    onAcceptRequest: (id: string) => void
    onClaimRequest: (id: string) => void
}) => {
    return (
        <Tabs defaultValue="matches" className="space-y-4">
            <TabsList className="w-full">
                <TabsTrigger value="matches" className="flex-1">
                    <Recycle className="h-4 w-4 mr-2" />
                    User Matches
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                    <History className="h-4 w-4 mr-2" />
                    Pending Requests
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1">
                    <Award className="h-4 w-4 mr-2" />
                    Completed Requests
                </TabsTrigger>
            </TabsList>

            <TabsContent value="matches">
                <Card>
                    <CardHeader>
                        <CardTitle>User Matches</CardTitle>
                        <CardDescription>
                            Pending collection requests from users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CollectionHistoryTable
                            data={matches}
                            onClaimRequest={onClaimRequest}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="pending">
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Requests</CardTitle>
                        <CardDescription>
                            Claimed requests awaiting collection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CollectionHistoryTable
                            data={pendingRequests}
                            onAcceptRequest={onAcceptRequest}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="completed">
                <Card>
                    <CardHeader>
                        <CardTitle>Completed Requests</CardTitle>
                        <CardDescription>
                            Successfully collected requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CollectionHistoryTable data={completedRequests} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

const CollectionHistoryTable = ({
    data,
    onClaimRequest,
    onAcceptRequest,
}: {
    data: any[]
    onClaimRequest?: (id: string) => void
    onAcceptRequest?: (id: string) => void
}) => {
    return (
        <div className="rounded-lg border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 font-medium">S.No</TableHead>
                        <TableHead className="font-medium">
                            Amount (kg)
                        </TableHead>
                        <TableHead className="font-medium">Date</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <div>no request so far</div>
                    ) : (
                        data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    {index + 1}
                                </TableCell>
                                <TableCell>{item.amount}</TableCell>
                                <TableCell>
                                    <Time timeStamp={item.createdAt} />
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            item.status === "claimed"
                                                ? "secondary"
                                                : item.status === "completed"
                                                  ? "default"
                                                  : "outline"
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {onClaimRequest && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                onClaimRequest(item.id)
                                            }
                                        >
                                            Claim
                                        </Button>
                                    )}
                                    {onAcceptRequest && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                onAcceptRequest(item.id)
                                            }
                                        >
                                            Collect
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
