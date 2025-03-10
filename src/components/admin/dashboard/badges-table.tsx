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

const badges = [
    {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        userImage: "/placeholder.svg?height=40&width=40&text=JD",
        name: "Recycler",
        issuedDate: "2023-06-15T00:00:00.000Z",
    },
    {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        userImage: "/placeholder.svg?height=40&width=40&text=JS",
        name: "Eco_Warrior",
        issuedDate: "2023-06-10T00:00:00.000Z",
    },
    {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        userImage: "/placeholder.svg?height=40&width=40&text=MJ",
        name: "Green_Ambassador",
        issuedDate: "2023-06-05T00:00:00.000Z",
    },
    {
        id: "4",
        userId: "user4",
        userName: "Sarah Williams",
        userImage: "/placeholder.svg?height=40&width=40&text=SW",
        name: "Sustainability_Hero",
        issuedDate: "2023-06-01T00:00:00.000Z",
    },
    {
        id: "5",
        userId: "user1",
        userName: "John Doe",
        userImage: "/placeholder.svg?height=40&width=40&text=JD",
        name: "Green_Ambassador",
        issuedDate: "2023-05-25T00:00:00.000Z",
    },
]

export function BadgesTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [badgeFilter, setBadgeFilter] = useState("all")

    const itemsPerPage = 10

    // Filter badges based on search query and badge type
    const filteredBadges = badges.filter(badge => {
        const matchesSearch =
            badge.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            badge.id.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = badgeFilter === "all" || badgeFilter === badge.name

        return matchesSearch && matchesType
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredBadges.length / itemsPerPage)
    const paginatedBadges = filteredBadges.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Badge icon and color
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

    // Format badge name for display
    const formatBadgeName = (name: string) => {
        return name.replace(/_/g, " ")
    }

    return (
        <div className="space-y-4">
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
                        {paginatedBadges.length > 0 ? (
                            paginatedBadges.map(badge => {
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
                                                    <DropdownMenuItem className="text-destructive">
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
            {filteredBadges.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            filteredBadges.length,
                            (currentPage - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            filteredBadges.length,
                            currentPage * itemsPerPage
                        )}{" "}
                        of {filteredBadges.length} badges
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
