"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
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

    return (
        <div className="mx-auto max-w-[90%] md:max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">
                    <span className="font-bold text-5xl text-green-400">
                        Sign
                    </span>{" "}
                    In
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your email or username below to login to your account
                </p>
            </div>
            <div className="space-y-4">
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
                    <Input
                        id="password"
                        type="password"
                        placeholder="password..."
                        className="p-4 rounded-xl"
                        value={creds.password}
                        onChange={e => {
                            setCreds({ ...creds, password: e.target.value })
                        }}
                        required
                    />
                </div>
                <Button
                    type="submit"
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
            </div>
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
