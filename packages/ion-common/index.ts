import { createClient } from 'redis';

const client = createClient();
await client.connect();

export const LPUSH = (key: string, value: string) => {
    client.lPush(key, value);
}
