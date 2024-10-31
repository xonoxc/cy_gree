"use client"

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
    const [amount_collected, setAmoutCollected] = useState<number>(0.0)
    const [picture, setPicture] = useState<File | null>(null)

    const { toast } = useToast()

    const { handleCollectionCreate } = useClientstats()

    const handleSubmit = async () => {
        try {
            const created = await handleCollectionCreate(
                amount_collected,
                picture
            )

            if (created) {
                toast({
                    title: "Collection Created Successfully!",
                })
            }
        } catch (error: any) {
            toast({
                title: error.message || "Error creating collection",
                variant: "destructive",
            })
        }
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="dark:bg-white dark:text-black font-bold"
                >
                    <Plus size={15} />
                    Add Collection
                </Button>
            </DrawerTrigger>
            <DrawerContent className="flex items-center justify-center">
                <DrawerHeader>
                    <DrawerTitle>Create New Collection</DrawerTitle>
                </DrawerHeader>
                <ScrollArea className="h-[80vh] px-4 md:w-1/2 w-full">
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="amount_collected">
                                Amount Collected (kg)
                            </Label>
                            <Input
                                id="amount_collected"
                                name="amount_collected"
                                value={amount_collected}
                                type="number"
                                min={0}
                                inputMode="decimal"
                                onChange={e =>
                                    setAmoutCollected(Number(e.target.value))
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="pic">Picture</Label>
                            <Input
                                id="pic"
                                name="file.pic"
                                type="file"
                                accept="image/*"
                                onChange={e =>
                                    e.target.files &&
                                    setPicture(e.target.files[0])
                                }
                                required
                            />
                        </div>
                        <Button onClick={handleSubmit} className="mt-4">
                            Submit
                        </Button>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    )
}
