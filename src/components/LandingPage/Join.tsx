import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Handshake } from "lucide-react"

const JoinSection = () => {
    const router = useRouter()

    return (
        <motion.section
            id="join"
            className="text-center my-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h3 className="text-3xl font-semibold text-green-400 mb-6 flex gap-2 items-center justify-center">
                Join the
                <div>
                    <span className="dark:text-white text-black">Cy</span>
                    <span className="text-green-300">Gree</span>
                </div>
                Movement
            </h3>
            <p className="text-xl text-gray-300 mb-8">
                Be part of the solution. Start reducing plastic waste and
                earning rewards today!
            </p>

            <div className="illus flex items-center justify-center my-6">
                <Handshake size={100} />
            </div>
            <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 font-bold"
                onClick={() => router.push("/sign-up")}
            >
                Sign Up Now
            </Button>
        </motion.section>
    )
}

export default JoinSection
