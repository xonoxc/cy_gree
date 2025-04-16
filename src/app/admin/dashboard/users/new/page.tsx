import { UserForm } from "@/components/admin/dashboard/users/users-form"
import BackBtn from "@/components/Backbtn"

export default function NewUserPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <BackBtn link={"/admin/dashboard/users"} />
            </div>
            <div className="w-full px-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create New User
                </h1>
            </div>
            <UserForm />
        </div>
    )
}
