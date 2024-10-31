import store from "@/store/token"
import { fetchWithConfig } from "@/config/fetch.config"

export const refreshTokens = async (refreshToken: string): Promise<boolean> => {
    try {
        const response = await fetchWithConfig("/token/refresh", {
            method: "POST",
            body: JSON.stringify({
                refresh: refreshToken,
            }),
        })

        if (response.status === 200) {
            const jsonResponse = await response.json()

            store.setState({ accessToken: jsonResponse.access })
            store.setState({ refreshToken: jsonResponse.refresh })

            return true
        }

        return false
    } catch (error: any) {
        console.error("erorr while refreshing token:", error)
        return false
    }
}
