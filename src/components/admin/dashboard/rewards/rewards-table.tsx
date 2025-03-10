"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Search,
    Trash,
    Gift,
    Tag,
    Percent,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const rewards = [
    {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        userImage: "/placeholder.svg?height=40&width=40&text=JD",
        rewardId: "reward1",
        rewardTitle: "10% Discount Coupon",
        rewardType: "Gift_Coupon",
        claimedDate: "2023-06-15T10:30:00.000Z",
    },
    {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        userImage: "/placeholder.svg?height=40&width=40&text=JS",
        rewardId: "reward2",
        rewardTitle: "₹100 Cashback",
        rewardType: "Cash",
        claimedDate: "2023-06-14T15:45:00.000Z",
    },
    {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        userImage: "/placeholder.svg?height=40&width=40&text=MJ",
        rewardId: "reward3",
        rewardTitle: "Free Eco-friendly Bag",
        rewardType: "Gift_Coupon",
        claimedDate: "2023-06-13T09:20:00.000Z",
    },
    {
        id: "4",
        userId: "user4",
        userName: "Sarah Williams",
        userImage: "/placeholder.svg?height=40&width=40&text=SW",
        rewardId: "reward4",
        rewardTitle: "Buy 1 Get 1 Free",
        rewardType: "Offer",
        claimedDate: "2023-06-12T14:10:00.000Z",
    },
    {
        id: "5",
        userId: "user1",
        userName: "John Doe",
        userImage: "/placeholder.svg?height=40&width=40&text=JD",
        rewardId: "reward5",
        rewardTitle: "₹250 Cashback",
        rewardType: "Cash",
        claimedDate: "2023-06-11T11:30:00.000Z",
    },
]

export function RewardsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [typeFilter, setTypeFilter] = useState("all")

    const itemsPerPage = 10

    // Filter rewards based on search query and type
    const filteredRewards = rewards.filter(reward => {
        const matchesSearch =
            reward.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reward.rewardTitle.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType =
            typeFilter === "all" || typeFilter === reward.rewardType

        return matchesSearch && matchesType
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredRewards.length / itemsPerPage)
    const paginatedRewards = filteredRewards.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Type badge variant and icon
    const getTypeDetails = (type: string) => {
        switch (type) {
            case "Gift_Coupon":
                return {
                    variant: "default",
                    icon: <Gift className="h-4 w-4 mr-1" />,
                }
            case "Cash":
                return {
                    variant: "success",
                    icon: <Tag className="h-4 w-4 mr-1" />,
                }
            case "Offer":
                return {
                    variant: "warning",
                    icon: <Percent className="h-4 w-4 mr-1" />,
                }
            default:
                return { variant: "secondary", icon: null }
        }
    }

    // Format reward type for display
    const formatRewardType = (type: string) => {
        return type.replace(/_/g, " ")
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search claimed rewards..."
                        className="w-full pl-8 bg-background"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Gift_Coupon">Gift Coupon</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Reward</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Claimed Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedRewards.length > 0 ? (
                            paginatedRewards.map(reward => {
                                const typeDetails = getTypeDetails(
                                    reward.rewardType
                                )

                                return (
                                    <TableRow key={reward.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={reward.userImage}
                                                        alt={reward.userName}
                                                    />
                                                    <AvatarFallback>
                                                        {reward.userName
                                                            .split(" ")
                                                            .map(n => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    {reward.userName}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {reward.rewardTitle}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    typeDetails.variant as any
                                                }
                                                className="flex w-fit items-center"
                                            >
                                                {typeDetails.icon}
                                                {formatRewardType(
                                                    reward.rewardType
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                reward.claimedDate
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Open menu
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    No claimed rewards found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {filteredRewards.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            filteredRewards.length,
                            (currentPage - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            filteredRewards.length,
                            currentPage * itemsPerPage
                        )}{" "}
                        of {filteredRewards.length} claimed rewards
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={
                                currentPage === totalPages || totalPages === 0
                            }
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
