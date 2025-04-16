import { UsersTable } from "@/components/admin/dashboard/users/users-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage user accounts and their information.
                    </p>
                </div>
                <Link href="/admin/dashboard/users/new">
                    <Button className="rounded-xl">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </Link>
            </div>
            <UsersTable />
        </div>
    )
}
