"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface LoginCreds {
    username: string
    password: string
}

export function LoginForm() {
    const [creds, setCreds] = useState<LoginCreds>({
        username: "",
        password: "",
    })
    const [isLoading, setLoading] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmission = async () => {
        setLoading(true)
        try {
            const result = await signIn("credentials", {
                username: creds.username,
                password: creds.password,
                redirect: false,
            })
            if (result?.error) {
                toast({
                    title: result.error,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Login Successful",
                })
                router.refresh()
            }
        } catch (e: any) {
            toast({
                variant: "destructive",
                title: e.message || "something went wrong!!",
                description: "please check your credentials",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) {
            e.preventDefault()
            handleSubmission()
        }
    }

    return (
        <div className="mx-auto max-w-[90%] md:max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">
                    <span className="font-bold text-5xl text-green-400">
                        Sign
                    </span>
                    In
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your email or username below to login to your account
                </p>
            </div>
            <form onKeyDown={handleKeyDown} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        className="p-4 rounded-xl"
                        placeholder="username..."
                        value={creds.username}
                        onChange={e => {
                            setCreds({ ...creds, username: e.target.value })
                        }}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="password..."
                            className="p-4 rounded-xl pr-10"
                            value={creds.password}
                            onChange={e => {
                                setCreds({ ...creds, password: e.target.value })
                            }}
                            required
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-black"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <Button
                    type="button"
                    onClick={handleSubmission}
                    disabled={isLoading}
                    className="w-full font-bold rounded-xl"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>
            <div className="link flex items-center justify-center">
                <span>
                    Don't have an account?
                    <Link href="/sign-up" className="text-green-300 text-sm">
                        Sign up
                    </Link>
                </span>
            </div>
        </div>
    )
}
