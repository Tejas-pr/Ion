import { WebSocketServer, WebSocket } from "ws";
import { SUBSCRIBE } from "ion-common/redis";

const clients = new Map<string, WebSocket>();

export const broadcast = (projectId: string, message: string) => {
    const ws = clients.get(projectId);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
    }
}

export const startServer = async () => {
    const port = Number(process.env.WEBSOCKET_PORT) || 8081;
    const wss = new WebSocketServer({ port });

    wss.on("connection", (ws: WebSocket, req: any) => {
        const url = new URL(req.url || "", `http://localhost:${port}`);
        const projectId = url.searchParams.get("projectId");

        if (!projectId) {
            ws.close(1008, "Missing projectId");
            return;
        }

        clients.set(projectId, ws);

        ws.on("close", () => {
            clients.delete(projectId);
        });
    });

    // Listen for broadcast requests from other services via Redis
    await SUBSCRIBE("ion-broadcast", (data: string) => {
        try {
            const parsed = JSON.parse(data);
            if (parsed.projectId) {
                broadcast(parsed.projectId, data);
            }
        } catch (e) {
            console.error("Failed to parse Redis broadcast message:", e);
        }
    });

    console.log("WebSocket server started on port", port);
    return wss;
}

// Start server if this file is run directly
if (import.meta.main || process.argv[1]?.endsWith("index.ts")) {
    startServer().catch(console.error);
}
