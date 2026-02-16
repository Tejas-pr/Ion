import { createAuthClient } from "better-auth/react"

const BASE_URL = process.env.BETTER_AUTH_URL;

export const authClient = createAuthClient({
    baseURL: BASE_URL
})

export const { signIn, signUp, useSession, signOut } = createAuthClient()
export { fromNodeHeaders, toNodeHandler } from "better-auth/node";