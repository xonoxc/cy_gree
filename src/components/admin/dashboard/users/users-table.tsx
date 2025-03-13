"use client"

import { UsersResp } from "@/app/api/admin/user/route"
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
import dynamic from "next/dynamic"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PaginatedResponse } from "@/types/response"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { useToast } from "@/hooks/use-toast"

type PaginatedUsers = PaginatedResponse<UsersResp[]>

/**
 * dynamic import for Time component
 *
 *  this allows the Time component to be loaded only on the client side
 */

const Time = dynamic(() => import("@/components/time"), { ssr: false })

const itemsPerPage = 2

const fetchUsers = async (
    page = 1,
    searchQuery: string = "",
    statusFilter: string = "all"
): Promise<PaginatedUsers> => {
    const res = await fetch(
        `/api/admin/user?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&status=${statusFilter}`
    )
    if (!res.ok) {
        throw new Error("Unable to fetch users")
    }
    return res.json()
}

const deleteUser = async (userId: string): Promise<void> => {
    const res = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
    })
    if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.status}`)
    }
}

export function UsersTable() {
    const [inputSearchQuery, setInputSearchQuery] = useState<string>("")
    const [page, setPage] = useState<number>(1)
    const [statusFilter, setStatusFilter] = useState<
        "inactive" | "active" | "all"
    >("all")
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const [searchQuery] = useDebounceValue(inputSearchQuery, 1000)

    const {
        data: paginatedUsers,
        isError,
        isFetching,
        error,
        refetch,
    } = useQuery({
        queryKey: ["users", page, searchQuery, statusFilter],
        queryFn: () => fetchUsers(page, searchQuery, statusFilter),
    })

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "User deleted successfully!",
            })
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete user.",
                variant: "destructive",
            })
        },
    })

    useEffect(() => {
        ;(async () => {
            await refetch()
        })()
    }, [page, searchQuery, statusFilter])

    if (isError) return <div>Error: {error.message}</div>

    if (isFetching) return <UsersTableSkeleton />

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="w-full pl-8 bg-background"
                        value={inputSearchQuery}
                        onChange={e => setInputSearchQuery(e.target.value)}
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={value =>
                        setStatusFilter(value as "all" | "active" | "inactive")
                    }
                >
                    <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers!.data.length > 0 ? (
                            paginatedUsers?.data.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.isActive
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {user.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Time
                                            timeStamp={String(user.joinedAt)}
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
                                                        href={`/admin/dashboard/users/${user.id}`}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/admin/dashboard/users/${user.id}/edit`}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        deleteMutation.mutate(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {paginatedUsers && paginatedUsers.data.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            paginatedUsers.data?.length,
                            (page - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            paginatedUsers.data?.length,
                            page * itemsPerPage
                        )}{" "}
                        of {paginatedUsers.data?.length} users
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            Page {page} of{" "}
                            {paginatedUsers.pagination.totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={
                                paginatedUsers.pagination.totalPages === page ||
                                paginatedUsers.data?.length === 0
                            }
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setPage(paginatedUsers.pagination.totalPages)
                            }
                            disabled={
                                paginatedUsers.pagination.totalPages === page ||
                                paginatedUsers.data.length === 0
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

function UsersTableSkeleton() {
    return (
        <div className="space-y-4">
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <div className="h-10 bg-gray-500  animate-pulse rounded-xl" />
                </div>
                <div className="w-full sm:w-36">
                    <div className="h-10 bg-gray-500 rounded-xl animate-pulse" />
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <div className="h-4 w-16 bg-gray-500 rounded animate-pulse" />
                            </TableHead>
                            <TableHead>
                                <div className="h-4 w-20 bg-gray-500 rounded animate-pulse" />
                            </TableHead>
                            <TableHead>
                                <div className="h-4 w-24 bg-gray-500 rounded animate-pulse" />
                            </TableHead>
                            <TableHead>
                                <div className="h-4 w-16 bg-gray-500 rounded animate-pulse" />
                            </TableHead>
                            <TableHead>
                                <div className="h-4 w-20 bg-gray-500 rounded animate-pulse" />
                            </TableHead>
                            <TableHead className="text-right">
                                <div className="h-4 w-16 bg-gray-500 rounded animate-pulse ml-auto" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Simulate 3 placeholder rows */}
                        {[...Array(3)].map((_, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <div className="h-4 w-32 bg-gray-500 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-24 bg-gray-500 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-40 bg-gray-500 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-16 bg-gray-500 rounded animate-pulse" />
                                </TableCell>
                                <TableCell>
                                    <div className="h-4 w-28 bg-gray-500 rounded animate-pulse" />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="h-8 w-8 bg-gray-500 rounded-full animate-pulse ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-32 bg-gray-500 rounded-xl animate-pulse" />
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-gray-500 rounded-xl animate-pulse" />
                    <div className="h-8 w-8 bg-gray-500 rounded-xl animate-pulse" />
                    <div className="h-7 w-16 bg-gray-500 rounded-md  animate-pulse" />
                    <div className="h-8 w-8 bg-gray-500 rounded-xl animate-pulse" />
                    <div className="h-8 w-8 bg-gray-500 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    )
}
