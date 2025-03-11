import { NotificationsTable } from "@/components/admin/dashboard/notifications/notifications-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-muted-foreground">
                        Manage system and user notifications.
                    </p>
                </div>
                <Link href="/admin/dashboard/notifications/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Notification
                    </Button>
                </Link>
            </div>
            <NotificationsTable />
        </div>
    )
}
