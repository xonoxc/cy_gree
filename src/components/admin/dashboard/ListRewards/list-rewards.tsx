"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
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
    Edit,
    Trash,
    Eye,
    Gift,
    Tag,
    Percent,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const itemsPerPage = 10

interface ListReward {
    id: string
    title: string | null
    pointsRequired: number
    issuedDate: string
    rewardType: string
}

interface ApiResponse {
    rewards: ListReward[]
    total: number
    currentPage: number
    totalPages: number
}

async function fetchListRewards({
    page,
    search,
    type,
    limit,
}: {
    page: number
    search: string
    type: string
    limit: number
}): Promise<ApiResponse> {
    const searchParams = new URLSearchParams({
        search,
        type,
        page: page.toString(),
        limit: limit.toString(),
    })
    const response = await fetch(`/api/admin/list-rewards?${searchParams}`)
    if (!response.ok) {
        throw new Error("Failed to fetch list rewards")
    }
    return response.json()
}

export function ListRewardsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [typeFilter, setTypeFilter] = useState("all")

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["list-rewards", currentPage, searchQuery, typeFilter],
        queryFn: () =>
            fetchListRewards({
                page: currentPage,
                search: searchQuery,
                type: typeFilter,
                limit: itemsPerPage,
            }),
    })

    const rewards = data?.rewards || []
    const totalPages = data?.totalPages || 1

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
                        placeholder="Search rewards..."
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
                            <TableHead>Title</TableHead>
                            <TableHead>Points Required</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Issued Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
                                    Error:{" "}
                                    {(error as Error).message ||
                                        "Something went wrong"}
                                </TableCell>
                            </TableRow>
                        ) : rewards.length > 0 ? (
                            rewards.map(reward => {
                                const typeDetails = getTypeDetails(
                                    reward.rewardType
                                )

                                return (
                                    <TableRow key={reward.id}>
                                        <TableCell className="font-medium">
                                            {reward.title || "No title"}
                                        </TableCell>
                                        <TableCell>
                                            {reward.pointsRequired.toLocaleString()}
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
                                                reward.issuedDate
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
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/dashboard/list-rewards/${reward.id}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/dashboard/list-rewards/${reward.id}/edit`}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
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
                                    No rewards found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {rewards.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            data?.total || 0,
                            (currentPage - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(data?.total || 0, currentPage * itemsPerPage)}{" "}
                        of {data?.total || 0} rewards
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
