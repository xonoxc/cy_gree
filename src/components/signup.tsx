"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RegistrationForm() {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const onSubmit = async () => {
		setIsLoading(true)
		setIsLoading(false)
	}

	return (
		<div className="max-w-[50%]">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl">Create an account</CardTitle>
				<CardDescription>
					Enter your email below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="grid grid-cols-2 gap-6">
					<Button variant="outline">
						<Github className="mr-2 h-4 w-4" />
						Github
					</Button>
					<Button variant="outline">
						{/* <Google className="mr-2 h-4 w-4" /> */}
						Google
					</Button>
				</div>
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" required />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" type="text" required />
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={onSubmit} disabled={isLoading}>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing up...
						</>
					) : (
						'Sign Up'
					)}
				</Button>
			</CardFooter>
			<div className="link flex items-center justify-center">
				Already have an account? <Link href="/auth/sign-in" className='text-sm'>
					Sign In
				</Link>
			</div>
		</div>

	)
}
