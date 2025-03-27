"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "@/components/mode_toggle"
import { Logo } from "../logo"
import { Menu, X } from "lucide-react"

const Header = () => {
    const router = useRouter()
    const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false)

    const toggleMobileNav = (): void => setIsMobileNavOpen(!isMobileNavOpen)

    return (
        <header className="dark:bg-black  dark:border-b-gray-200">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Logo />
                <nav className="hidden md:flex">
                    <ul className="flex space-x-4 border-0 sm:border-2 p-3 px-8 rounded-3xl border-gray-500">
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
                    <Button
                        onClick={() => router.push("/sign-in")}
                        className="rounded-xl font-bold text-black bg-gradient-to-r from-white to-green-600 hidden md:block"
                    >
                        Sign In
                    </Button>
                    <button
                        onClick={toggleMobileNav}
                        className="md:hidden dark:text-gray-300 text-black"
                        aria-expanded={isMobileNavOpen}
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileNavOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0.5, height: 0 }}
                        transition={{ duration: 0.3 }}
                        //@ts-ignore
                        className="md:hidden overflow-hidden backdrop-blur-lg"
                    >
                        <nav className="bg-transparent px-4 py-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <a
                                    href="#about"
                                    className="flex items-center justify-between py-3 text-gray-300 hover:text-white transition-colors duration-200"
                                    onClick={toggleMobileNav}
                                >
                                    About
                                </a>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <a
                                    href="#features"
                                    className="flex items-center justify-between py-3 text-gray-300 hover:text-white transition-colors duration-200"
                                    onClick={toggleMobileNav}
                                >
                                    Features
                                </a>
                            </motion.div>
                            <motion.div
                                //@ts-ignore
                                className="mt-4 flex flex-col space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <Button
                                    variant="outline"
                                    className="w-full justify-center border-gray-700 transition-colors duration-200 text-blac bg-white text-black rounded-xl bg-gradient-to-r from-white to-green-600"
                                    onClick={() => {
                                        router.push("/sign-in")
                                        toggleMobileNav()
                                    }}
                                >
                                    Sign In
                                </Button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
