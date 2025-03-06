"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClientstats } from "@/hooks/useClientstats"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"

export default function PlasticCollectionModalForm() {
    const [open, setOpen] = useState(false)
    const [amount_collected, setAmountCollected] = useState<string>("")
    const [picture, setPicture] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const { data: session } = useSession()

    const { handleCollectionCreate } = useClientstats(session?.user?.id)

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            if (!amount_collected || !picture) {
                toast({
                    title: "Please fill in all required fields",
                    variant: "destructive",
                })
                return
            }

            setIsSubmitting(true)
            try {
                const created = await handleCollectionCreate(
                    amount_collected,
                    picture
                )
                if (created) {
                    toast({
                        title: "Collection Created Successfully!",
                    })
                    setOpen(false)
                    setAmountCollected("0.0")
                    setPicture(null)
                }
            } catch (error: any) {
                toast({
                    title: error.message || "Error creating collection",
                    variant: "destructive",
                })
            } finally {
                setIsSubmitting(false)
            }
        },
        [amount_collected, picture, handleCollectionCreate, toast]
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="dark:bg-white dark:text-black font-bold mb-5"
                >
                    <Plus className="mr-2" size={15} />
                    Add Collection
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-6">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Create New Collection
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] w-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 w-2/3">
                            <Label htmlFor="amount_collected">
                                Amount Collected (kg) *
                            </Label>
                            <Input
                                id="amount_collected"
                                name="amount_collected"
                                value={amount_collected}
                                type="text"
                                min={0.0}
                                inputMode="decimal"
                                onChange={e => {
                                    const value = e.target.value
                                    const regex = /^\d*\.?\d{0,2}$/
                                    if (regex.test(value)) {
                                        setAmountCollected(value)
                                    }
                                }}
                                required
                                className="dark:bg-muted w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pic">Picture *</Label>
                            <Input
                                id="pic"
                                name="pic"
                                type="text"
                                accept="image/*"
                                onChange={e => setPicture(e.target.value)}
                                required
                                className="dark:bg-muted"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
