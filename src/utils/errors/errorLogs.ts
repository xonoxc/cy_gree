export const logErrors = (error: any) => {
    if (error instanceof Error) {
        console.error("Error while claiming:", error.message)
    } else {
        console.error("Unexpected error:", error)
    }
}
