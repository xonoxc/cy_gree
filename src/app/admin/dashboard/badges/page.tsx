import { BadgesTable } from "@/components/admin/dashboard/badges-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function BadgesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Badges
                    </h1>
                    <p className="text-muted-foreground">
                        Manage achievement badges awarded to users.
                    </p>
                </div>
                <Link href="/admin/dashboard/badges/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Award Badge
                    </Button>
                </Link>
            </div>
            <BadgesTable />
        </div>
    )
}

