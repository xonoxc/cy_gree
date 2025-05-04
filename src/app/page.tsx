import {
    Header,
    Footer,
    HeroSection,
    AboutSection,
    FeaturesSection,
    JoinSection,
} from "@/components/LandingPage"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Home | cyGree",
    description:
        "cyGree is a platform that faciliates the process of plastic waste management a breeze",
}

export default function Home() {
    return (
        <div className="min-h-screen dark:bg-black bg-white text-white overflow-x-hidden ">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <HeroSection />
                <AboutSection />
                <FeaturesSection />
                <JoinSection />
            </main>
            <Footer />
        </div>
    )
}
