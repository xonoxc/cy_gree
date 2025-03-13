"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode_toggle"
import { Logo } from "../logo"

const Header = () => {
    const router = useRouter()

    return (
        <header className="dark:bg-black shadow-lg dark:border-b-gray-200">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Logo />
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <a
                                href="#about"
                                className="dark:text-gray-300 text-black hover:text-green-300"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#features"
                                className="dark:text-gray-300 text-black hover:text-green-300"
                            >
                                Features
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="right flex items-center justify-center gap-3">
                    <ModeToggle />
                    <Button
                        onClick={() => router.push("/sign-in")}
                        className="rounded-lg font-bold"
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header
