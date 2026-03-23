import { createClient } from 'redis';

const client = createClient();
await client.connect();

export const REDIS_QUEUE_NAME = process.env.REIDS_QUEUE_NAME || "ion-build-queue";

export const LPUSH = async (key: string, value: string) => {
    await client.lPush(key, value);
}

export const BRPPO = async (key: string, timeout: number = 0) => {
    const res = await client.brPop(key, timeout);
    return res;
}


export const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL!];