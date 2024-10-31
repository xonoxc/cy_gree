import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

type Roles = "Client" | "Agent"

export interface ITokenStore {
    accessToken: string
    refreshToken: string
    role: string
    id: string
    hydrated: boolean
    setAccesstoken: (token: string) => void
    setRefreshToken: (token: string) => void
    setRole: (role: Roles) => void
    setHydrated(): void
}

const useTokenStore = create<ITokenStore>()(
    persist(
        immer(set => ({
            accessToken: "",
            refreshToken: "",
            role: "",
            id: "",
            hydrated: false,
            setHydrated(): void {
                set({ hydrated: true })
            },
            setAccesstoken(token: string): void {
                set({ accessToken: token })
            },
            setRefreshToken(token: string): void {
                set({ refreshToken: token })
            },
            setRole(role: Roles): void {
                set({ role: role })
            },
        })),
        {
            name: "auth",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage() {
                return (state, error) => {
                    if (error) state?.setHydrated()
                }
            },
        }
    )
)

export default useTokenStore
