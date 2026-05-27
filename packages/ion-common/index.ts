import { prisma } from '@ion/database';
import { createClient } from 'redis';


const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({
    url: redisUrl
});

let isConnected = false;
const getRedisClient = async () => {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    return client;
};

export const REDIS_QUEUE_NAME = process.env.REIDS_QUEUE_NAME || "ion-build-queue";

export const LPUSH = async (key: string, value: string) => {
    const c = await getRedisClient();
    await c.lPush(key, value);
}

export const BRPPO = async (key: string, timeout: number = 0) => {
    const c = await getRedisClient();
    const res = await c.brPop(key, timeout);
    return res;
}

export const PUBLISH = async (channel: string, message: string) => {
    const c = await getRedisClient();
    await c.publish(channel, message);
}

export const SUBSCRIBE = async (channel: string, callback: (message: string) => void) => {
    const subscriber = client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe(channel, callback);
    return subscriber;
}

export const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL!];

export const getUserGitHubAccessToken = async (userId: string) => {
    const account = await prisma.account.findFirst({
        where: { userId, providerId: 'github' },
        select: { accessToken: true }
    });
    return account?.accessToken;
}
