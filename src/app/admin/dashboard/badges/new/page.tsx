import { BadgeForm } from "@/components/admin/dashboard/badges/badge-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBadgePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 flex-col">
                <div className="w-full px-3">
                    <Link href="/admin/dashboard/badges">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="w-full px-3">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Award New Badge
                    </h1>
                </div>
            </div>
            <BadgeForm />
        </div>
    )
}
