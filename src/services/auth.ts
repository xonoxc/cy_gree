import store, { ITokenStore } from "@/store/token"

interface RegisterPlayload {
    username: string
    password: string
    first_name: string
    last_name: string
    email: string
}

type Roles = "Client" | "Agent"

class Authentication {
    private serverUri: string
    private authStore: ITokenStore

    constructor() {
        this.serverUri = process.env.NEXT_PUBLIC_SERVER_URL! as string

        this.authStore = store.getState()
    }

    public async login(
        username: string,
        password: string
    ): Promise<Roles | null> {
        try {
            const resposne = await fetch(`${this.serverUri}/api/user/login`, {
                headers: {
                    "content-type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                }),
            })

            if (resposne.status === 200) {
                const json = await resposne.json()

                this.authStore.setRole(json.role)
                this.authStore.setRefreshToken(json.refresh)
                this.authStore.setAccesstoken(json.access)

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
            const resposne = await fetch(
                `${this.serverUri}/api/user/register`,
                {
                    headers: {
                        "content-type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        username,
                        password,
                        email,
                        first_name,
                        last_name,
                    }),
                }
            )

            if (resposne.status === 201) {
                return (await this.login(username, password)) as Roles
            }

            return null
        } catch (error) {
            throw error
        }
    }

    public logout() {
        localStorage.removeItem("auth")
    }
}

export const auth = new Authentication()
