const rawRequestUrl =
    process.env.NEXT_PUBLIC_REQUEST_BACKEND_URL || "http://localhost:3003";

export const REPO_BACKEND_URL =
    process.env.NEXT_PUBLIC_REPO_BACKEND_URL || "http://localhost:3002";

export const REQUEST_BACKEND_URL = rawRequestUrl;

export const BASE_URL = rawRequestUrl.replace(/^https?:\/\//, "");

export const WEBSOCKET_URL =
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8081";