import { PlasticCollectionForm } from "@/components/admin/dashboard/plastic-collections/pcollection-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPlasticCollectionPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Link href="/admin/dashboard/plastic-collections">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    Add Plastic Collection
                </h1>
            </div>
            <PlasticCollectionForm />
        </div>
    )
}
