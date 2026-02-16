import { prisma } from "@ion/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const trustedOrigins = [process.env.BETTER_AUTH_URL as string, process.env.MAINORIGINS2 as string, process.env.MAINORIGINS3 as string]

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: trustedOrigins,
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24, // 1 day
            refreshCache: {
                updateAge: 300 // Refresh when 5 mins remain before expiry
            }
        }
    }
});