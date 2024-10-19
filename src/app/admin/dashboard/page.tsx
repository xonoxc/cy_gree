"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart3,
    Users,
    Recycle,
    Gift,
    Plus,
    Trash,
    Menu,
    CircleX,
} from "lucide-react"
import { ModeToggle } from "@/components/mode_toggle"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
    const [partners, setPartners] = useState([
        { id: 1, name: "EcoRecycle Co.", location: "New York" },
        { id: 2, name: "GreenWaste Solutions", location: "Los Angeles" },
    ])
    const [rewards, setRewards] = useState([
        { id: 1, name: "Eco-friendly Water Bottle", points: 500 },
        { id: 2, name: "Reusable Shopping Bag", points: 300 },
    ])
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const addPartner = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const newPartner = {
            id: partners.length + 1,
            name: formData.get("partnerName") as string,
            location: formData.get("partnerLocation") as string,
        }
        setPartners([...partners, newPartner])
        event.currentTarget.reset()
    }

    const addReward = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const newReward = {
            id: rewards.length + 1,
            name: formData.get("rewardName") as string,
            points: Number(formData.get("rewardPoints")),
        }
        setRewards([...rewards, newReward])
        event.currentTarget.reset()
    }

    const removePartner = (id: number) => {
        setPartners(partners.filter(partner => partner.id !== id))
    }

    const removeReward = (id: number) => {
        setRewards(rewards.filter(reward => reward.id !== id))
    }

    return (
        <div className="relative min-h-screen">
            {/* Floating Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-white dark:bg-black shadow-md`}
            >
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                        cyGree
                    </h2>
                </div>
                <nav className="mt-6">
                    <a
                        href="#"
                        className="block py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black hover:text-black dark:hover:text-white"
                    >
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className="block py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black hover:text-black dark:hover:text-white"
                    >
                        Users
                    </a>
                    <a
                        href="#"
                        className="block py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black hover:text-black dark:hover:text-white"
                    >
                        Partners
                    </a>
                    <a
                        href="#"
                        className="block py-2 px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-black hover:text-black dark:hover:text-white"
                    >
                        Rewards
                    </a>
                </nav>

                <Button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 bg-transparent dark:text-white text-black "
                >
                    <CircleX size={20} />
                </Button>
            </aside>

            {/* Main Content */}
            <main className="p-8 bg-gray-100 dark:bg-black min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="mr-2"
                    >
                        <Menu className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                    <h1 className="text-3xl font-bold dark:text-white">
                        Admin Dashboard
                    </h1>
                    <ModeToggle />
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                1,234
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Waste Collected (kg)
                            </CardTitle>
                            <Recycle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                5,678
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Active Partners
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                {partners.length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-black dark:border-gray-700">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium dark:text-gray-200">
                                Rewards Claimed
                            </CardTitle>
                            <Gift className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold dark:text-white">
                                789
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="users" className="space-y-4">
                    <TabsList>
                        <TabsTrigger
                            value="users"
                            className="dark:text-gray-300 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                        >
                            User Data
                        </TabsTrigger>
                        <TabsTrigger
                            value="partners"
                            className="dark:text-gray-300 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                        >
                            Recycling Partners
                        </TabsTrigger>
                        <TabsTrigger
                            value="rewards"
                            className="dark:text-gray-300 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                        >
                            Manage Rewards
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            User Data
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                <div className="rounded-md border dark:border-gray-700">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b dark:border-gray-700 bg-gray-200 dark:bg-black text-left">
                                                <th className="p-2 dark:text-gray-300">
                                                    Name
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Email
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Waste Collected (kg)
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Points
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b dark:border-gray-700">
                                                <td className="p-2 dark:text-gray-300">
                                                    John Doe
                                                </td>
                                                <td className="p-2 dark:text-gray-300">
                                                    john@example.com
                                                </td>
                                                <td className="p-2 dark:text-gray-300">
                                                    50
                                                </td>
                                                <td className="p-2 dark:text-gray-300">
                                                    500
                                                </td>
                                            </tr>
                                            <tr className="border-b dark:border-gray-700">
                                                <td className="p-2 dark:text-gray-300">
                                                    Jane Smith
                                                </td>
                                                <td className="p-2 dark:text-gray-300">
                                                    jane@example.com
                                                </td>
                                                <td className="p-2 dark:text-gray-300">
                                                    75
                                                </td>
                                                <td className="p-2 dark:text-gray-300">
                                                    750
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="partners" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            Recycling Partners
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                <form
                                    onSubmit={addPartner}
                                    className="space-y-4 mb-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                htmlFor="partnerName"
                                                className="dark:text-gray-300"
                                            >
                                                Partner Name
                                            </Label>
                                            <Input
                                                id="partnerName"
                                                name="partnerName"
                                                required
                                                className="dark:bg-black dark:text-white dark:border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="partnerLocation"
                                                className="dark:text-gray-300"
                                            >
                                                Location
                                            </Label>
                                            <Input
                                                id="partnerLocation"
                                                name="partnerLocation"
                                                required
                                                className="dark:bg-black dark:text-white dark:border-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="bg-black text-white dark:bg-white dark:text-black hover:bg-black dark:hover:bg-gray-200"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        Partner
                                    </Button>
                                </form>
                                <div className="rounded-md border dark:border-gray-700">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b dark:border-gray-700 bg-gray-200 dark:bg-black text-left">
                                                <th className="p-2 dark:text-gray-300">
                                                    Name
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Location
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {partners.map(partner => (
                                                <tr
                                                    key={partner.id}
                                                    className="border-b dark:border-gray-700"
                                                >
                                                    <td className="p-2 dark:text-gray-300">
                                                        {partner.name}
                                                    </td>
                                                    <td className="p-2 dark:text-gray-300">
                                                        {partner.location}
                                                    </td>
                                                    <td className="p-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                removePartner(
                                                                    partner.id
                                                                )
                                                            }
                                                            className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rewards" className="space-y-4">
                        <h2 className="text-2xl font-bold dark:text-white">
                            Manage Rewards
                        </h2>
                        <Card className="dark:bg-black dark:border-gray-700">
                            <CardContent>
                                <form
                                    onSubmit={addReward}
                                    className="space-y-4 mb-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                htmlFor="rewardName"
                                                className="dark:text-gray-300"
                                            >
                                                Reward Name
                                            </Label>
                                            <Input
                                                id="rewardName"
                                                name="rewardName"
                                                required
                                                className="dark:bg-black dark:text-white dark:border-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="rewardPoints"
                                                className="dark:text-gray-300"
                                            >
                                                Points Required
                                            </Label>
                                            <Input
                                                id="rewardPoints"
                                                name="rewardPoints"
                                                type="number"
                                                required
                                                className="dark:bg-black dark:text-white dark:border-gray-600"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="bg-black text-white dark:bg-white dark:text-black hover:bg-black  dark:hover:bg-gray-200"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        Reward
                                    </Button>
                                </form>
                                <div className="rounded-md border dark:border-gray-700">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b dark:border-gray-700 bg-gray-200 dark:bg-black text-left">
                                                <th className="p-2 dark:text-gray-300">
                                                    Reward
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Points
                                                </th>
                                                <th className="p-2 dark:text-gray-300">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rewards.map(reward => (
                                                <tr
                                                    key={reward.id}
                                                    className="border-b dark:border-gray-700"
                                                >
                                                    <td className="p-2 dark:text-gray-300">
                                                        {reward.name}
                                                    </td>
                                                    <td className="p-2 dark:text-gray-300">
                                                        {reward.points}
                                                    </td>
                                                    <td className="p-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeReward(
                                                                    reward.id
                                                                )
                                                            }
                                                            className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
