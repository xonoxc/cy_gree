"use client"

import type React from "react"
import { IKImage, IKUpload } from "imagekitio-next"
import { useEffect, useState } from "react"
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
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import { Progress } from "../ui/progress"

export default function PlasticCollectionModalForm() {
	const [open, setOpen] = useState<boolean>(false)
	const [amount_collected, setAmountCollected] = useState<string>("")
	const [picture, setPicture] = useState<string | null>(null)
	const [imageUploadError, setImageUploadError] = useState<string>("")
	const [progress, setProgress] = useState<number>(0)
	const [isProgressing, setIsProgressing] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const { toast } = useToast()
	const { handleCollectionCreate } = useClientstats()

	useEffect(() => {
		if (!open) {
			setPicture(null)
		}
	}, [open])

	const handleSubmit = (e: React.FormEvent) => {
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
			handleCollectionCreate({ amount_collected, picture })
			setOpen(false)
			setAmountCollected("")
			setPicture(null)
		} catch (e: any) {
			toast({
				title: "Error creating collection",
				variant: "destructive",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="dark:bg-white dark:text-black font-bold mb-5 flex items-center rounded-xl p-4"
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
									{imageUploadError && (
										<div>{imageUploadError}</div>
									)}
									<IKUpload
										folder={"collections"}
										className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										onError={(e: any) => {
											setImageUploadError(
												JSON.stringify(e)
											)
											setIsProgressing(false)
										}}
										onSuccess={(resp: IKUploadResponse) => {
											setPicture(resp.filePath)
											setIsProgressing(false)
										}}
										onUploadProgress={(
											e: ProgressEvent<XMLHttpRequestEventTarget>
										) => {
											setProgress(
												(e.loaded / e.total) * 100
											)
											setIsProgressing(true)
										}}
									/>
								</div>
								<div className="w-full items-center justify-center flex">
									{isProgressing ? (
										<Progress
											value={progress}
											className="w-[90%]"
										/>
									) : (
										picture && (
											<Card className="p-2 mt-2 overflow-hidden">
												<div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
													<IKImage
														path={picture}
														alt="uploaded image"
													/>
												</div>
											</Card>
										)
									)}
								</div>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full mt-6"
							disabled={isSubmitting || isProgressing || !amount_collected || !picture}
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
