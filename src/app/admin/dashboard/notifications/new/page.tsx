import { NotificationForm } from "@/components/admin/dashboard/notifications/notification-form"
import BackBtn from "@/components/Backbtn"

export default function NewNotificationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 flex-col">
                <div className="w-full">
                    <BackBtn link={"/admin/dashboard/notifications"} />
                </div>

                <div className="w-full px-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create New Notification
                    </h1>
                </div>
            </div>
            <NotificationForm />
        </div>
    )
}
