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
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps {
    columns: { key: string; label: string }[]
    data: any[]
    onEditAction: (item: any) => void
    onDeleteAction: (item: any) => void
    onCreateAction: () => void
}

export function DataTable({
    columns,
    data,
    onEditAction,
    onDeleteAction,
    onCreateAction,
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 10

    const filteredData = data.filter(item =>
        Object.values(item).some(
            value =>
                typeof value === "string" &&
                value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Button onClick={onCreateAction}>Create New</Button>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map(column => (
                                <TableHead key={column.key}>
                                    {column.label}
                                </TableHead>
                            ))}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index}>
                                {columns.map(column => (
                                    <TableCell key={column.key}>
                                        {item[column.key]}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditAction(item)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => onDeleteAction(item)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
            <div className="flex items-center justify-between">
                <div>
                    Showing {startIndex + 1} to{" "}
                    {Math.min(startIndex + itemsPerPage, filteredData.length)}{" "}
                    of {filteredData.length} entries
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage(prev => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>
                        {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage(prev =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
