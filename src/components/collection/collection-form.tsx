import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClientstats } from "@/hooks/useClientstats"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

export default function PlasticCollectionDrawerForm() {
    const [open, setOpen] = useState(false)
    const [amount_collected, setAmountCollected] = useState<string>("")
    const [picture, setPicture] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const { handleCollectionCreate } = useClientstats()

    const handleSubmit = async (e: React.FormEvent) => {
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
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="dark:bg-white dark:text-black font-bold mb-5"
                >
                    <Plus className="mr-2" size={15} />
                    Add Collection
                </Button>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center justify-start p-4">
                <DrawerHeader className="text-center">
                    <DrawerTitle>Create New Collection</DrawerTitle>
                </DrawerHeader>
                <ScrollArea className="h-[80vh] w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
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
                                className="dark:bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pic">Picture *</Label>
                            <Input
                                id="pic"
                                name="pic"
                                type="file"
                                accept="image/*"
                                onChange={e =>
                                    e.target.files &&
                                    setPicture(e.target.files[0])
                                }
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
            </DrawerContent>
        </Drawer>
    )
}
