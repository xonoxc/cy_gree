"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
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
    Award,
    Medal,
    Leaf,
    Shield,
    Recycle,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { logErrors } from "@/utils/errors/errorLogs"
import { useToast } from "@/hooks/use-toast"
import { ITEMS_PER_PAGE } from "@/constants/pagination"

interface Badge {
    id: string
    userId: string
    userName: string
    userImage: string
    name: string
    issuedDate: string
}

interface ApiResponse {
    badges: Badge[]
    total: number
    currentPage: number
    totalPages: number
}

async function fetchBadges({
    page,
    search,
    badge,
    limit,
}: {
    page: number
    search: string
    badge: string
    limit: number
}): Promise<ApiResponse> {
    const searchParams = new URLSearchParams({
        page: page.toString(),
        search,
        badge,
        limit: limit.toString(),
    })
    const response = await fetch(`/api/admin/badges?${searchParams}`)
    if (!response.ok) {
        throw new Error("Failed to fetch badges")
    }
    return response.json()
}

export function BadgesTable() {
    const queryClient = useQueryClient()

    const [searchQuery, setSearchQuery] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [badgeFilter, setBadgeFilter] = useState<string>("all")

    const { toast } = useToast()

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["badges", currentPage, searchQuery, badgeFilter],
        queryFn: () =>
            fetchBadges({
                page: currentPage,
                search: searchQuery,
                badge: badgeFilter,
                limit: ITEMS_PER_PAGE,
            }),
    })

    const badges = data?.badges || []
    const totalPages = data?.totalPages || 1

    const deleteBadge = async (id: string) => {
        try {
            const deleteResponse = await fetch(
                `/api/admin/badges?badgeId=${id}`,
                {
                    method: "DELETE",
                }
            )

            if (!deleteResponse.ok) throw new Error("Failed to delete badge")

            await queryClient.invalidateQueries({
                queryKey: ["badges"],
            })

            toast({
                title: "Success",
                description: "Badge revoked successfully",
            })
        } catch (e) {
            logErrors(e)
            toast({
                title: "Error",
                description: "Failed to delete badge",
                variant: "destructive",
            })
        }
    }

    const formatBadgeName = (name: string) => {
        return name.replace(/_/g, " ")
    }

    return (
        <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search badges..."
                        className="w-full pl-8 bg-background"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by badge" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Badges</SelectItem>
                        <SelectItem value="Recycler">Recycler</SelectItem>
                        <SelectItem value="Eco_Warrior">Eco Warrior</SelectItem>
                        <SelectItem value="Green_Ambassador">
                            Green Ambassador
                        </SelectItem>
                        <SelectItem value="Sustainability_Hero">
                            Sustainability Hero
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Badge</TableHead>
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
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    Error:{" "}
                                    {(error as Error)?.message ||
                                        "Something went wrong"}
                                </TableCell>
                            </TableRow>
                        ) : badges.length > 0 ? (
                            badges.map(badge => {
                                const badgeDetails = getBadgeDetails(badge.name)

                                return (
                                    <TableRow key={badge.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={badge.userImage}
                                                        alt={badge.userName}
                                                    />
                                                    <AvatarFallback>
                                                        {badge.userName
                                                            .split(" ")
                                                            .map(n => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">
                                                    {badge.userName}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <span
                                                    className={`mr-2 ${badgeDetails.color}`}
                                                >
                                                    {badgeDetails.icon}
                                                </span>
                                                {formatBadgeName(badge.name)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                badge.issuedDate
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
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            deleteBadge(
                                                                badge.id
                                                            )
                                                        }
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Revoke Badge
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
                                    colSpan={4}
                                    className="h-24 text-center"
                                >
                                    No badges found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {badges.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            data?.total || 0,
                            (currentPage - 1) * ITEMS_PER_PAGE + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            data?.total || 0,
                            currentPage * ITEMS_PER_PAGE
                        )}{" "}
                        of {data?.total || 0} badges
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

const getBadgeDetails = (badgeType: string) => {
    switch (badgeType) {
        case "Recycler":
            return {
                icon: <Recycle className="h-4 w-4 mr-1" />,
                color: "text-green-500",
            }
        case "Eco_Warrior":
            return {
                icon: <Shield className="h-4 w-4 mr-1" />,
                color: "text-blue-500",
            }
        case "Green_Ambassador":
            return {
                icon: <Leaf className="h-4 w-4 mr-1" />,
                color: "text-emerald-500",
            }
        case "Sustainability_Hero":
            return {
                icon: <Medal className="h-4 w-4 mr-1" />,
                color: "text-amber-500",
            }
        default:
            return {
                icon: <Award className="h-4 w-4 mr-1" />,
                color: "text-gray-500",
            }
    }
}
