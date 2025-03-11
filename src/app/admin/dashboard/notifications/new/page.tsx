import { NotificationForm } from "@/components/admin/dashboard/notifications/notification-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewNotificationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/admin/dashboard/notifications">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New Notification
                </h1>
            </div>
            <NotificationForm />
        </div>
    )
}
