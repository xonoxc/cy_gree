"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { AdminUserProfileCreateSchema as formSchema } from "@/utils/validation/profile"

import { states } from "@/constants/states/states"
import { useMutation } from "@tanstack/react-query"

type ProfileData = z.infer<typeof formSchema>

export function UserProfileForm({ profileId }: { profileId?: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingProfile, setIsLoadingProfile] =
        useState<boolean>(!!profileId)

    const form = useForm<ProfileData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            profilePic: "",
            role: "Client",
            address: "",
            city: "",
            state: "",
            country: "India",
            phoneNumber: "",
            totalPlasticRecycled: 0,
            earnedPoints: 0,
        },
    })

    useEffect(() => {
        if (profileId) {
            setIsLoadingProfile(true)
            fetch(`/api/admin/profiles/${profileId}`)
                .then(res => res.json())
                .then((data: ProfileData) =>
                    form.reset({
                        profilePic: data.profilePic,
                        role: data.role as "Client" | "Agent",
                        address: data.address || "",
                        city: data.city,
                        state: data.state,
                        country: data.country,
                        phoneNumber: data.phoneNumber || "",
                        totalPlasticRecycled: data.totalPlasticRecycled,
                        earnedPoints: data.earnedPoints,
                    })
                )
                .catch(e => console.log(e))

            setIsLoadingProfile(false)
        }
    }, [profileId, form])

    async function onSubmit(values: ProfileData) {
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: profileId ? "Profile updated" : "Profile created",
                description: profileId
                    ? "The user profile has been updated successfully."
                    : "The user profile has been created successfully.",
            })

            router.push("/dashboard/user-profiles")
        } catch (e) {
            toast({
                title: "Something went wrong.",
                description: "Your profile was not saved. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const updateMutation = useMutation({
        mutationFn: onSubmit,
    })

    const formatStateName = (state: string) => state.replace(/_/g, " ")

    if (isLoadingProfile)
        return (
            <Card className="flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Loading profile data...
                    </p>
                </div>
            </Card>
        )

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={
                                        form.watch("profilePic") ||
                                        "/placeholder.svg?height=96&width=96"
                                    }
                                    alt="Profile"
                                />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2 flex-1">
                                <FormField
                                    control={form.control}
                                    name="profilePic"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Profile Picture URL
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://example.com/profile.jpg"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter a URL for the profile
                                                picture.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Client">
                                                    Client
                                                </SelectItem>
                                                <SelectItem value="Agent">
                                                    Agent
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            The user's role in the system.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="9876543210"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            10-digit phone number without
                                            country code.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 Main St"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Mumbai"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a state" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-80">
                                                {states.map(state => (
                                                    <SelectItem
                                                        key={state}
                                                        value={state}
                                                    >
                                                        {formatStateName(state)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="totalPlasticRecycled"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Total Plastic Recycled (kg)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="earnedPoints"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Earned Points</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push("/dashboard/user-profiles")
                            }
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-1">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Saving...
                                </span>
                            ) : profileId ? (
                                "Update Profile"
                            ) : (
                                "Create Profile"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
