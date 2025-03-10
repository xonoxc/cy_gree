import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Manage your basic account settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Admin User" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    defaultValue="admin@ecotrack.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <select
                                    id="language"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                    <option value="ta">Tamil</option>
                                    <option value="te">Telugu</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="two-factor">
                                    Two-factor authentication
                                </Label>
                                <Switch id="two-factor" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delete Account</CardTitle>
                            <CardDescription>
                                Permanently delete your account and all of your
                                data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Once you delete your account, there is no going
                                back. Please be certain.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="destructive">
                                Delete Account
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize the appearance of the dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <select
                                    id="theme"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="animations">Animations</Label>
                                <Switch id="animations" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="compact-mode">
                                    Compact Mode
                                </Label>
                                <Switch id="compact-mode" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>
                                Configure how you receive notifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="email-notifications">
                                    Email Notifications
                                </Label>
                                <Switch
                                    id="email-notifications"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="push-notifications">
                                    Push Notifications
                                </Label>
                                <Switch
                                    id="push-notifications"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="collection-updates">
                                    Collection Updates
                                </Label>
                                <Switch
                                    id="collection-updates"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="reward-notifications">
                                    Reward Notifications
                                </Label>
                                <Switch
                                    id="reward-notifications"
                                    defaultChecked
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="system-notifications">
                                    System Notifications
                                </Label>
                                <Switch
                                    id="system-notifications"
                                    defaultChecked
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="api" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>
                                Manage your API keys for external integrations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="api-key">API Key</Label>
                                    <Button variant="outline" size="sm">
                                        Regenerate
                                    </Button>
                                </div>
                                <div className="flex">
                                    <Input
                                        id="api-key"
                                        value="sk_live_7g8d62h3j4k5l6m7n8o9p0q1r2s3t4u5v"
                                        readOnly
                                        className="rounded-r-none"
                                    />
                                    <Button
                                        variant="secondary"
                                        className="rounded-l-none"
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Last used: 2 hours ago
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="webhook-url">
                                        Webhook URL
                                    </Label>
                                </div>
                                <Input
                                    id="webhook-url"
                                    placeholder="https://your-app.com/webhook"
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="webhook-active">
                                    Webhook Active
                                </Label>
                                <Switch id="webhook-active" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
