import type { Request, Response, NextFunction } from "express";
import { prisma } from "@ion/database";

declare module "express" {
    export interface Request {
        userId?: string;
    }
}

export const middlewareService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const cookieHeader = req.headers.cookie;

        if (!cookieHeader) {
            return res.status(401).json({ error: "Unauthorized: Missing cookies" });
        }

        // Parse cookies
        const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));

        // Match Better Auth/Next Auth session cookie keys
        const token = cookies['better-auth.session_token'] || cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token'];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Missing session token in cookies" });
        }

        // Verify the extracted session token exists and hasn't expired
        const session = await prisma.session.findFirst({
            where: { token }
        });

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ error: "Unauthorized: Session invalid or expired" });
        }

        // Attach user ID to the request object so subsequent handlers can access it
        req.userId = session.userId;

        next();
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};