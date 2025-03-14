"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
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
    User,
    UserCircle,
    MapPin,
    Phone,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleFilter } from "@/app/api/admin/profiles/route"
import { ProfilesResp } from "@/app/api/admin/profiles/route"
import { PaginatedResponse } from "@/types/response"
import { useQuery } from "@tanstack/react-query"

type PaginatedProfilsResponse = PaginatedResponse<ProfilesResp[]>

const ITEMS_PER_PAGE = 3

export function UserProfilesTable() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")

    // const router = useRouter()

    const {
        data: profileResponseData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["userProfiles", searchQuery, roleFilter, currentPage],
        queryFn: () =>
            fetchProfiles({
                search: searchQuery,
                role: roleFilter,
                page: currentPage,
            }),
    })

    const formatStateName = (state: string | null) => {
        return state ? state.replace(/_/g, " ") : ""
    }

    if (error) {
        return <div>Error: {(error as Error).message}</div>
    }

    const profiles = profileResponseData?.data || []
    const total = profileResponseData?.pagination?.totalEntries || 0
    const totalPages = profileResponseData?.pagination?.totalPages || 1

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search profiles..."
                        className="w-full pl-8 bg-background"
                        value={searchQuery}
                        onChange={e => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
                <Select
                    value={roleFilter}
                    onValueChange={(value: RoleFilter) => {
                        setRoleFilter(value)
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Plastic Recycled</TableHead>
                            <TableHead>Points</TableHead>
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
                        ) : profiles.length > 0 ? (
                            profiles.map((profile: ProfilesResp) => (
                                <TableRow
                                    key={profile.id}
                                    // onClick={() =>
                                    //     router.push(
                                    //         `/admin/dashboard/users/${profile.userId}`
                                    //     )
                                    // }
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        profile.profilePic || ""
                                                    }
                                                    alt={profile.userName}
                                                />
                                                <AvatarFallback>
                                                    {profile.userName
                                                        .split(" ")
                                                        .map(n => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">
                                                {profile.userName}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                profile.role === "Agent"
                                                    ? "default"
                                                    : "outline"
                                            }
                                        >
                                            {profile.role === "Agent" ? (
                                                <UserCircle className="h-3 w-3 mr-1" />
                                            ) : (
                                                <User className="h-3 w-3 mr-1" />
                                            )}
                                            {profile.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                                            <span>
                                                {profile.city},{" "}
                                                {formatStateName(profile.state)}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {profile.phoneNumber ? (
                                            <div className="flex items-center">
                                                <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                                <span>
                                                    {profile.phoneNumber}
                                                </span>
                                            </div>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {profile.totalPlasticRecycled > 0
                                            ? `${profile.totalPlasticRecycled.toFixed(2)} kg`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        {profile.earnedPoints.toFixed(2)}
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
                                                        href={`/dashboard/user-profiles/${profile.id}`}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        href={`/dashboard/user-profiles/${profile.id}/edit`}
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center"
                                >
                                    No profiles found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {total > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            total,
                            (currentPage - 1) * ITEMS_PER_PAGE + 1
                        )}{" "}
                        to {Math.min(total, currentPage * ITEMS_PER_PAGE)} of{" "}
                        {total} profiles
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
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * function to fetch paginated Profiles
 */

async function fetchProfiles({
    search,
    role,
    page = 1,
}: {
    search: string
    role: RoleFilter
    page: number
}): Promise<PaginatedProfilsResponse> {
    const searchParams = new URLSearchParams({
        search,
        role,
        limit: ITEMS_PER_PAGE.toString(),
        page: page.toString(),
    })
    const response = await fetch(`/api/admin/profiles?${searchParams}`)

    if (!response.ok) {
        throw new Error("An error occurred while fetching profiles")
    }
    return response.json()
}
