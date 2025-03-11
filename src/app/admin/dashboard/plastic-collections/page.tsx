import { PlasticCollectionsTable } from "@/components/admin/dashboard/plastic-collections/table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function PlasticCollectionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Plastic Collections
                    </h1>
                    <p className="text-muted-foreground">
                        Manage plastic collection records and their status.
                    </p>
                </div>
                <Link href="/admin/dashboard/plastic-collections/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Collection
                    </Button>
                </Link>
            </div>
            <PlasticCollectionsTable />
        </div>
    )
}
