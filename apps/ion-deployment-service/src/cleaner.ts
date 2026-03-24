import fs from "fs";
import path from "path";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const safeCleanup = async (dir: string): Promise<boolean> => {
    try {
        if (!fs.existsSync(dir)) {
            return true;
        }

        await fs.promises.rm(dir, {
            recursive: true,
            force: true,
            maxRetries: 3,
            retryDelay: 100
        });

        console.log("✅ cleaned up:", dir);
        return true;
    } catch (err: any) {
        console.error("❌ cleanup failed:", dir, err.message);
        return false;
    }
}

// Defer cleanup by a specified timeout
export const scheduleCleanup = (dir: string, delayMs = TWO_HOURS_MS) => {
    console.log(`🕒 scheduled cleanup for ${dir} in ${delayMs / (1000 * 60)} minutes`);
    setTimeout(() => safeCleanup(dir), delayMs);
}

// Background janitor to cleanup any files older than X hours (e.g., if process crashed before timer)
export const startCleanupJanitor = (baseDir: string, intervalMs = 15 * 60 * 1000) => {
    console.log("🧹 starting cleanup janitor in:", baseDir);

    const runJanitor = async () => {
        try {
            if (!fs.existsSync(baseDir)) return;

            const entries = await fs.promises.readdir(baseDir);
            const now = Date.now();

            for (const entry of entries) {
                const fullPath = path.join(baseDir, entry);
                const stats = await fs.promises.stat(fullPath);

                if (now - stats.mtimeMs > TWO_HOURS_MS) {
                    console.log("🚮 janitor: removing old directory:", fullPath);
                    await safeCleanup(fullPath);
                }
            }
        } catch (err) {
            console.error("❌ janitor failed:", err);
        }
    };

    // Run once on start
    runJanitor();
    // Then periodically
    setInterval(runJanitor, intervalMs);
}