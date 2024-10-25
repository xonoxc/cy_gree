import { motion } from "framer-motion"
import { RainbowButton } from "@/components/Animated"
import { BoxReveal } from "@/components/Animated"
import { MoveRight } from "lucide-react"
import { Globe } from "@/components/Animated"
import { useRouter } from "next/navigation"

const HeroSection = () => {
    const router = useRouter()

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
        >
            <div className="container flex  justify gap-2 flex-col md:flex-row md:h-screen">
                <div className="intro flex items-center  md:py-52 flex-col">
                    <BoxReveal boxColor="green">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-white bg-clip-text text-transparent mb-4">
                            Reducing Plastic Usage for a Sustainable Future
                        </h2>
                    </BoxReveal>
                    <BoxReveal boxColor="green">
                        <p className="text-xl dark:text-gray-300 text-gray-600 mb-8">
                            Join our mission to create a cleaner environment and
                            earn rewards for your efforts!
                        </p>
                    </BoxReveal>
                    <BoxReveal boxColor="green">
                        <RainbowButton
                            className="font-bold flex items-center justify-center gap-2"
                            onClick={() => router.push("/sign-in")}
                        >
                            Get Started
                            <MoveRight size={14} />
                        </RainbowButton>
                    </BoxReveal>
                </div>

                <div className="relative flex size-full max-w-lg items-center justify-center  rounded-lg dark:bg-black  pb-40 pt-0 md:pb-60 overflow-hidden ">
                    <Globe className="top-10" />
                </div>
            </div>
        </motion.section>
    )
}

export default HeroSection
