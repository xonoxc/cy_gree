"use client"

import { useState, useEffect } from "react"
import {
    Header,
    Footer,
    HeroSection,
    AboutSection,
    FeaturesSection,
    JoinSection,
} from "@/components/LandingPage"

export default function Home() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen dark:bg-black bg-white text-white overflow-x-hidden">
            <Header />
            <main className="container mx-auto px-4 py-12 ">
                <HeroSection />
                <AboutSection />
                <FeaturesSection />
                <JoinSection />
            </main>
            <Footer />
        </div>
    )
}
