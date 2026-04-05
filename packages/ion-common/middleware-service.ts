import { fromNodeHeaders } from "better-auth/node";

export const authMiddleware = (auth: any) => async (req: any, res: any, next: any) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user?.id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized!",
        });
    }

    // Attach user to req for convenience
    // @ts-ignore
    req.user = session.user;
    next();
};

export const getUserSession = async (auth: any, req: any) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return session;
};
