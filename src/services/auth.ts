import { fetchWithConfig } from "@/config/fetch.config"
import store from "@/store/token"

interface RegisterPlayload {
    username: string
    password: string
    first_name: string
    last_name: string
    email: string
}

type Roles = "Client" | "Agent"

class Authentication {
    private authStore = store

    public async login(
        username: string,
        password: string
    ): Promise<Roles | null> {
        try {
            const resposne = await fetchWithConfig("/user/login", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                }),
            })

            if (resposne.status === 400) {
                const errorData = await resposne.json()
                throw new Error(
                    errorData.message || "Invalid username or password"
                )
            }

            if (resposne.status === 200) {
                const json = await resposne.json()

                this.authStore.setState({
                    role: json.role,
                    accessToken: json.access,
                    refreshToken: json.refresh,
                    id: json.id,
                })

                return json.role as Roles
            }

            return null
        } catch (error) {
            throw error
        }
    }

    public async register({
        email,
        username,
        password,
        first_name,
        last_name,
    }: RegisterPlayload): Promise<Roles | null> {
        try {
            const resposne = await fetchWithConfig("/user/register", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    first_name,
                    last_name,
                }),
            })

            if (resposne.status === 400) {
                throw new Error("Invalid credentials")
            }

            if (resposne.status === 200) {
                return (await this.login(username, password)) as Roles
            }

            return null
        } catch (error) {
            throw error
        }
    }

    public logout() {
        this.authStore.setState({
            accessToken: "",
            refreshToken: "",
            role: undefined,
            id: undefined,
        })
    }
}

export const auth = new Authentication()
