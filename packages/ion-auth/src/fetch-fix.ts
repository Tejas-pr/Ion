import axios from "axios";

/**
 * Native fetch in Node 25 is currently experiencing connection timeouts to github.com
 * on this system. We monkey-patch global.fetch to use axios which works correctly.
 */
// @ts-ignore
const originalFetch = global.fetch;

// @ts-ignore
global.fetch = async (url: any, options: any) => {
    const urlStr = url.toString();

    // Only override for github.com to minimize side effects
    if (!urlStr.includes("github.com")) {
        return originalFetch(url, options);
    }

    try {
        const res = await axios({
            url: urlStr,
            method: options?.method || "GET",
            data: options?.body,
            headers: {
                "Accept": "application/json",
                ...options?.headers
            },
            // For GitHub OAuth, we need to handle both JSON and form-data responses
            transformResponse: [(data) => {
                try { return JSON.parse(data); } catch { return data; }
            }],
            validateStatus: () => true,
        });

        return {
            ok: res.status >= 200 && res.status < 300,
            status: res.status,
            statusText: res.statusText,
            headers: new Headers(res.headers as any),
            json: async () => res.data,
            text: async () => (typeof res.data === "string" ? res.data : JSON.stringify(res.data)),
            blob: async () => new Blob([res.data]),
            arrayBuffer: async () => {
                const buf = Buffer.from(res.data);
                return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
            },
            formData: async () => {
                throw new Error("formData not implemented in fetch-fix");
            },
        } as any;
    } catch (err) {
        console.error("Fetch bypass failed:", err);
        return originalFetch(url, options);
    }
};
