import crypto from "crypto";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length = 6): string => {
    let result = "";
    const bytes = crypto.randomBytes(length);

    for (let index = 0; index < length; index++) {
        result += CHARSET[bytes[index] % CHARSET.length];
    }

    return result;
}
