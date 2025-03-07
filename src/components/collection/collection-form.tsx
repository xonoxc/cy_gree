"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
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
import { useClientstats } from "@/hooks/useClientstats"
import { useToast } from "@/hooks/use-toast"
import { ImagePlus, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"

export default function PlasticCollectionModalForm() {
    const [open, setOpen] = useState<boolean>(false)
    const [amount_collected, setAmountCollected] = useState<string>("")
    const [picture, setPicture] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const { data: session } = useSession()

    const { handleCollectionCreate } = useClientstats(session?.user?.id)

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    useEffect(() => {
        if (!open) {
            setPreviewUrl(null)
        }
    }, [open])

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
                const reader = new FileReader()
                reader.readAsDataURL(picture)
                reader.onload = async () => {
                    const base64Image = reader.result as string

                    const created = await handleCollectionCreate(
                        amount_collected,
                        base64Image
                    )

                    if (created) {
                        toast({
                            title: "Collection Created Successfully!",
                        })
                        setOpen(false)
                        setAmountCollected("")
                        setPicture(null)
                        setPreviewUrl(null)
                    }
                }

                reader.onerror = () => {
                    throw new Error("Error processing image")
                }
            } catch (error: any) {
                toast({
                    title: error.message || "Error creating collection",
                    variant: "destructive",
                })
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
                    className="dark:bg-white dark:text-black font-bold mb-5 flex items-center"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add Collection</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-center text-xl font-semibold">
                        Create New Collection
                    </DialogTitle>
                </DialogHeader>
                <div className="px-6 pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="amount_collected"
                                className="text-sm font-medium"
                            >
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
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="pic"
                                className="text-sm font-medium"
                            >
                                Picture Upload *
                            </Label>
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <Input
                                        id="pic"
                                        name="pic"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                setPicture(file)
                                                const url =
                                                    URL.createObjectURL(file)
                                                setPreviewUrl(url)
                                            }
                                        }}
                                        required
                                        className="dark:bg-muted w-full"
                                    />
                                </div>

                                {previewUrl ? (
                                    <Card className="p-2 mt-2 overflow-hidden">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                                            <img
                                                src={
                                                    previewUrl ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Collection preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </Card>
                                ) : (
                                    <div
                                        className="flex items-center justify-center w-full h-32 rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 cursor-pointer"
                                        onClick={() =>
                                            document
                                                .getElementById("pic")
                                                ?.click()
                                        }
                                    >
                                        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
                                            <ImagePlus className="h-8 w-8" />
                                            <span>
                                                Click to upload an image
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Collection"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
