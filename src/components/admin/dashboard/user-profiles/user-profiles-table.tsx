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

// Mock data
const userProfiles = [
    {
        id: "1",
        userId: "user1",
        userName: "John Doe",
        profilePic: "/placeholder.svg?height=40&width=40&text=JD",
        role: "Client",
        address: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        phoneNumber: "9876543210",
        totalPlasticRecycled: 25.5,
        earnedPoints: 1250.0,
    },
    {
        id: "2",
        userId: "user2",
        userName: "Jane Smith",
        profilePic: "/placeholder.svg?height=40&width=40&text=JS",
        role: "Agent",
        address: "456 Park Ave",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        phoneNumber: "8765432109",
        totalPlasticRecycled: 0,
        earnedPoints: 500.0,
    },
    {
        id: "3",
        userId: "user3",
        userName: "Mike Johnson",
        profilePic: "/placeholder.svg?height=40&width=40&text=MJ",
        role: "Client",
        address: "789 Oak St",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        phoneNumber: "7654321098",
        totalPlasticRecycled: 15.2,
        earnedPoints: 760.0,
    },
    {
        id: "4",
        userId: "user4",
        userName: "Sarah Williams",
        profilePic: "/placeholder.svg?height=40&width=40&text=SW",
        role: "Client",
        address: "101 Pine Rd",
        city: "Chennai",
        state: "Tamil_Nadu",
        country: "India",
        phoneNumber: "6543210987",
        totalPlasticRecycled: 8.7,
        earnedPoints: 435.0,
    },
    {
        id: "5",
        userId: "user5",
        userName: "David Brown",
        profilePic: "/placeholder.svg?height=40&width=40&text=DB",
        role: "Agent",
        address: "202 Maple Dr",
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        phoneNumber: "5432109876",
        totalPlasticRecycled: 0,
        earnedPoints: 1500.0,
    },
]

export function UserProfilesTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [roleFilter, setRoleFilter] = useState("all")

    const itemsPerPage = 10

    // Filter profiles based on search query and role
    const filteredProfiles = userProfiles.filter(profile => {
        const matchesSearch =
            profile.userName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            profile.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (profile.state &&
                profile.state
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (profile.phoneNumber && profile.phoneNumber.includes(searchQuery))

        const matchesRole = roleFilter === "all" || roleFilter === profile.role

        return matchesSearch && matchesRole
    })

    // Calculate pagination
    const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage)
    const paginatedProfiles = filteredProfiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Format state name for display
    const formatStateName = (state: string) => {
        return state ? state.replace(/_/g, " ") : ""
    }

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
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-36">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Agent">Agent</SelectItem>
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
                        {paginatedProfiles.length > 0 ? (
                            paginatedProfiles.map(profile => (
                                <TableRow key={profile.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={profile.profilePic}
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

            {/* Pagination */}
            {filteredProfiles.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            filteredProfiles.length,
                            (currentPage - 1) * itemsPerPage + 1
                        )}{" "}
                        to{" "}
                        {Math.min(
                            filteredProfiles.length,
                            currentPage * itemsPerPage
                        )}{" "}
                        of {filteredProfiles.length} profiles
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
