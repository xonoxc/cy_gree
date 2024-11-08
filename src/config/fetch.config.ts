const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as string

import store from "@/store/token"
import { refreshTokens } from "@/services/token"
import { auth } from "@/services/auth"

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>
}

const defaultConfig: FetchOptions = {
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${store.getState().accessToken}`,
    },
    mode: "no-cors",
    // credentials: "include",
}

export const fetchWithConfig = async (
    endpoint: string,
    options: FetchOptions = {}
): Promise<Response> => {
    const config: FetchOptions = {
        ...defaultConfig,
        ...options,
    }

    if (!(options.body instanceof FormData)) {
        config.headers = {
            "Content-Type": "application/json",
            ...config.headers,
        }
    }

    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${store.getState().accessToken}`,
    }

    if (!BASE_URL) {
        throw new Error("Please provide NEXT_PUBLIC_SERVER_URL in .env")
    }

    try {
        const response = await fetch(`${BASE_URL}/api${endpoint}`, config)

        if (response.status === 401) {
            const refreshToken = store.getState().refreshToken
            if (!refreshToken) {
                auth.logout()
                throw new Error("No refresh token available")
            }

            const refreshStatus = await refreshTokens(refreshToken)
            if (refreshStatus) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${store.getState().accessToken}`,
                }
                return await fetch(`${BASE_URL}/api${endpoint}`, config)
            } else {
                auth.logout()
                throw new Error("Token refresh failed")
            }
        }

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "Request failed")
        }

        return response
    } catch (error) {
        throw error
    }
}
