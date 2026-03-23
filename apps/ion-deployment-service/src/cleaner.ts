import fs from "fs";

export const safeCleanup = async (dir: string) => {
    try {
        if (!fs.existsSync(dir)) {
            console.log("cleanup: directory does not exist");
            return;
        }

        await fs.promises.rm(dir, {
            recursive: true,
            force: true,
            maxRetries: 3,
            retryDelay: 100
        });

        console.log("✅ cleaned up:", dir);
    } catch (err: any) {
        console.error("❌ cleanup failed:", dir, err.message);
    }
}