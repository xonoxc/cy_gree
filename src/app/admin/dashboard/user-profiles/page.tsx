import { UserProfilesTable } from "@/components/admin/dashboard/user-profiles/user-profiles-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function UserProfilesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Profiles
                    </h1>
                    <p className="text-muted-foreground">
                        Manage detailed user profile information.
                    </p>
                </div>
                <Link href="/dashboard/user-profiles/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Profile
                    </Button>
                </Link>
            </div>
            <UserProfilesTable />
        </div>
    )
}
