import { spawn } from "child_process";
import { PUBLISH } from "ion-common/redis";

export const buildProject = async (projectPath: string, projectId: string) => {
    const startTime = Date.now();
    console.log("Starting Docker build...");
    const logs = await runDockerBuild(projectPath, projectId);
    const duration = Date.now() - startTime;
    console.log("Build finished");
    return { logs, duration };
};

const runDockerBuild = (projectPath: string, projectId: string) => {
    console.log("projectPath", projectPath);

    return new Promise<string>((resolve, reject) => {
        const uid = process.getuid?.() || 1000;
        const gid = process.getgid?.() || 1000;
        let logs = "";

        const docker = spawn("docker", [
            "run",
            "--rm",
            "--dns=8.8.8.8",
            "-v", `${projectPath}:/app`,
            "-w", "/app",
            "node:20",
            "sh",
            "-c",
            `npm install --no-audit --no-fund --no-progress && npm run build && chown -R ${uid}:${gid} .`
        ]);

        docker.stdout.on("data", (data) => {
            const str = data.toString();
            logs += str;
            PUBLISH("ion-broadcast", JSON.stringify({ projectId, message: str }));
        });

        docker.stderr.on("data", (data) => {
            const str = data.toString();
            logs += str;
            PUBLISH("ion-broadcast", JSON.stringify({ projectId, message: str }));
        });

        docker.on("close", (code) => {
            if (code === 0) resolve(logs);
            else reject(new Error(`Build failed with code ${code}`));
        });
    });
};