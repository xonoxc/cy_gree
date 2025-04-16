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
import { IKImage } from "imagekitio-next"
import dynamic from "next/dynamic"
import { RoleFilter } from "@/app/api/admin/profiles/route"
import { ITEMS_PER_PAGE } from "@/constants/pagination"
import { useDebounceValue } from "usehooks-ts"

const Time = dynamic(() => import("@/components/time"), { ssr: false })

/**
 * Plastic collection datatype
 */

interface Collection {
    id: string
    userId: string
    userName: string
    imagePath: string
    amount: number
    status: string
    claimedBy: string
    createdAt: string
    updatedAt: string
}

/**
 * API response datatype Interface
 */

interface ApiResponse {
    collections: Collection[]
    total: number
    currentPage: number
    totalPages: number
}

/**
 * Main component for rendering the plastic collections table
 */
export function PlasticCollectionsTable() {
    const [inputSearchQuery, setInputSearchQuery] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [statusFilter, setStatusFilter] = useState<RoleFilter>("all")

    const [searchQuery] = useDebounceValue<string>(inputSearchQuery, 1000)

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["collections", currentPage, searchQuery, statusFilter],
        queryFn: () =>
            fetchCollections({
                page: currentPage,
                search: searchQuery,
                status: statusFilter,
                limit: ITEMS_PER_PAGE,
            }),
    })

    const collections = data?.collections || []
    const totalPages = data?.totalPages || 1

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search collections..."
                        className="w-full pl-8 bg-background"
                        value={inputSearchQuery}
                        onChange={e => setInputSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(value: RoleFilter) =>
                        setStatusFilter(value)
                    }
                >
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    Error:{" "}
                                    {(error as Error)?.message ||
                                        "Something went wrong"}
                                </TableCell>
                            </TableRow>
                        ) : collections.length > 0 ? (
                            collections.map(collection => {
                                const statusDetails = getStatusDetails(
                                    collection.status
                                )

                                return (
                                    <TableRow key={collection.id}>
                                        <TableCell>
                                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                                <IKImage
                                                    path={
                                                        collection.imagePath ||
                                                        ""
                                                    }
                                                    alt="-"
                                                    fill
                                                    className="object-cover ml-4"
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
                                            <Time
                                                timeStamp={collection.createdAt}
                                            />
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
                                                            href={`/admin/dashboard/plastic-collections/${collection.id}`}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/admin/dashboard/plastic-collections/${collection.id}/edit`}
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

            {collections.length > 0 && (
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
                        )}
                        of {data?.total || 0} collections
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

async function fetchCollections({
    page,
    search,
    status,
    limit,
}: {
    page: number
    search: string
    status: string
    limit: number
}): Promise<ApiResponse> {
    const searchParams = new URLSearchParams({
        page: page.toString(),
        search: search,
        status: status,
        limit: limit.toString(),
    })
    const response = await fetch(
        `/api/admin/plastic-collections?${searchParams}`
    )
    if (!response.ok) throw new Error("Failed to fetch collections")
    return response.json()
}

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
