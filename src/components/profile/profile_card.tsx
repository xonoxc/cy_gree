import { Label } from "../ui/label"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useCallback, useState } from "react"
import { useClientstats } from "@/hooks/useClientstats"
import { useToast } from "@/hooks/use-toast"
import { Edit, Save } from "lucide-react"
import { ProfileCardSkeleton } from "./profile_sekeleton"
import { states } from "@/constants/states/states"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import React from "react"
import { IKImage, IKUpload } from "imagekitio-next"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"

const ProfileCard = () => {
    const [editing, setEditing] = useState(false)
    const [avatar, setAvatar] = useState<string | null>(null)
    const [imageUploadError, setImageUploadError] = useState<string>("")
    const [progress, setProgress] = useState<number | null>(null)

    const {
        handleProfileUpdate,
        userData,
        handleInputChange,
        isProfileDataLoading,
        isfetchProfileDataError,
    } = useClientstats()
    const { toast } = useToast()

    const handleEditToggle = useCallback(async () => {
        try {
            if (editing) {
                const result = await handleProfileUpdate(avatar)
                if (result.status === 200) {
                    toast({
                        title: "Changes saved successfully!",
                        description: "Your profile has been updated.",
                    })
                }
            }
        } catch (e: any) {
            toast({
                title: e.message || "Profile update failed",
                variant: "destructive",
            })
        } finally {
            setEditing(!editing)
        }
    }, [editing, avatar, handleProfileUpdate, toast])

    /*conditionals if the current component is no ready*/
    if (isProfileDataLoading) return <ProfileCardSkeleton />

    if (isfetchProfileDataError) return <div>Error loading profile data.</div>

    if (!userData) return null

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Manage your personal information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                    {progress && progress > 0 && progress < 0 && (
                        <div>
                            <div>progress : {progress} %</div>
                        </div>
                    )}

                    {imageUploadError && (
                        <span>Upload failed : {imageUploadError}</span>
                    )}

                    {editing ? (
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <IKUpload
                                folder={"collections"}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleInputChange}
                                onError={(e: any) =>
                                    setImageUploadError(JSON.stringify(e))
                                }
                                onSuccess={(resp: IKUploadResponse) =>
                                    setAvatar(resp.filePath)
                                }
                                onUploadProgress={(
                                    e: ProgressEvent<XMLHttpRequestEventTarget>
                                ) => setProgress((e.loaded / e.total) * 100)}
                            />
                        </div>
                    ) : (
                        <Avatar className="h-20 w-20">
                            <div>
                                <IKImage
                                    className="object-cover"
                                    path={avatar || userData.profilePic}
                                    alt="uploaded image"
                                    fill={true}
                                />
                            </div>
                            <AvatarFallback>
                                {userData.user.name
                                    .split(" ")
                                    .map(n => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold">
                            {userData.user.name}
                        </h2>
                        <Badge variant="outline" className="mt-1">
                            User
                        </Badge>
                    </div>

                    <Button
                        onClick={handleEditToggle}
                        variant="outline"
                        size="sm"
                        className="w-1/8 ml-2 bg-white text-black font-bold rounded-xl"
                    >
                        {editing ? (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </>
                        ) : (
                            <>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </>
                        )}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={userData.user.email}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="text"
                            maxLength={10}
                            value={userData.phoneNumber}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={userData.address}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            value={userData.city}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        {editing ? (
                            <Select
                                onValueChange={value =>
                                    handleInputChange({ name: "state", value })
                                }
                                defaultValue={userData.state}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue
                                        placeholder="Select a state"
                                        defaultValue={userData.state}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map(state => (
                                        <SelectItem key={state} value={state}>
                                            {state.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                id="state"
                                name="state"
                                value={userData.state}
                                disabled={true}
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            name="country"
                            value={userData.country}
                            onChange={handleInputChange}
                            disabled={!editing}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProfileCard
