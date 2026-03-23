import crypto from "crypto";

const CHARSET = "abcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length = 7): string => {
    const bytes = crypto.randomBytes(length);

    return Array.from(bytes)
        .map(b => CHARSET[b % CHARSET.length])
        .join("");
};