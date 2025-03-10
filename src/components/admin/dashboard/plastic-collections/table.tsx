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
    Edit,
    Trash,
    Eye,
    CheckCircle,
    Clock,
    AlertCircle,
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
import Image from "next/image"

// Mock data
const collections = [
    {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        imagePath: "/placeholder.svg?height=80&width=80",
        amount: 5.2,
        status: "Pending",
        claimedBy: "",
        createdAt: "2023-06-15T10:30:00.000Z",
        updatedAt: "2023-06-15T10:30:00.000Z",
    },
    {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        imagePath: "/placeholder.svg?height=80&width=80",
        amount: 3.7,
        status: "Claimed",
        claimedBy: "Agent1",
        createdAt: "2023-06-14T14:20:00.000Z",
        updatedAt: "2023-06-14T15:45:00.000Z",
    },
    {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        imagePath: "/placeholder.svg?height=80&width=80",
        amount: 8.1,
        status: "Collected",
        claimedBy: "Agent2",
        createdAt: "2023-06-13T09:15:00.000Z",
        updatedAt: "2023-06-13T16:30:00.000Z",
    },
    {
        id: "4",
        userId: "user4",
        userName: "Sarah Williams",
        imagePath: "/placeholder.svg?height=80&width=80",
        amount: 2.5,
        status: "Pending",
        claimedBy: "",
        createdAt: "2023-06-12T11:45:00.000Z",
        updatedAt: "2023-06-12T11:45:00.000Z",
    },
    {
        id: "5",
        userId: "user5",
        userName: "David Brown",
        imagePath: "/placeholder.svg?height=80&width=80",
        amount: 6.3,
        status: "Claimed",
        claimedBy: "Agent3",
        createdAt: "2023-06-11T13:20:00.000Z",
        updatedAt: "2023-06-11T14:10:00.000Z",
    },
]

export function PlasticCollectionsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")

    const itemsPerPage = 10

    // Filter collections based on search query and status
    const filteredCollections = collections.filter(collection => {
        const matchesSearch =
            collection.userName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            collection.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.claimedBy
                .toLowerCase()
                .includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === "all" ||
            statusFilter.toLowerCase() === collection.status.toLowerCase()

        return matchesSearch && matchesStatus
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
    const paginatedCollections = filteredCollections.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Status badge variant and icon
    const getStatusDetails = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return {
                    variant: "warning",
                    icon: <Clock className="h-4 w-4 mr-1" />,
                }
            case "claimed":
                return {
                    variant: "outline",
                    icon: <AlertCircle className="h-4 w-4 mr-1" />,
                }
            case "collected":
                return {
                    variant: "success",
                    icon: <CheckCircle className="h-4 w-4 mr-1" />,
                }
            default:
                return { variant: "secondary", icon: null }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search collections..."
                        className="w-full pl-8 bg-background"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="claimed">Claimed</SelectItem>
                        <SelectItem value="collected">Collected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Amount (kg)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Claimed By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCollections.length > 0 ? (
                            paginatedCollections.map(collection => {
                                const statusDetails = getStatusDetails(
                                    collection.status
                                )

                                return (
                                    <TableRow key={collection.id}>
                                        <TableCell>
                                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        collection.imagePath ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt="Plastic collection"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {collection.userName}
                                        </TableCell>
                                        <TableCell>
                                            {collection.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    statusDetails.variant as any
                                                }
                                                className="flex w-fit items-center"
                                            >
                                                {statusDetails.icon}
                                                {collection.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {collection.claimedBy || "—"}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                collection.createdAt
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
                                                            href={`/dashboard/plastic-collections/${collection.id}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/dashboard/plastic-collections/${collection.id}/edit`}
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
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    No collections found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {filteredCollections.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            filteredCollections.length,
                            (currentPage - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            filteredCollections.length,
                            currentPage * itemsPerPage
                        )}{" "}
                        of {filteredCollections.length} collections
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
