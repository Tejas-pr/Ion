import { spawn } from "child_process";
import { PUBLISH } from "ion-common/redis";

export const buildProject = async (projectPath: string, projectId: string) => {
    console.log("Starting Docker build...");
    await runDockerBuild(projectPath, projectId);
    console.log("Build finished");
};

const runDockerBuild = (projectPath: string, projectId: string) => {
    console.log("projectPath", projectPath);

    return new Promise<void>((resolve, reject) => {
        const uid = process.getuid?.() || 1000;
        const gid = process.getgid?.() || 1000;

        const docker = spawn("docker", [
            "run",
            "--rm",
            "--dns=8.8.8.8",
            "-v", `${projectPath}:/app`,
            "-w", "/app",
            "node:20",
            "sh",
            "-c",
            `rm -rf node_modules && node -v && npm -v && npm install --verbose && npm run build && chown -R ${uid}:${gid} .`
        ]);

        docker.stdout.on("data", (data) => {
            // process.stdout.write(data.toString());
            PUBLISH("ion-broadcast", JSON.stringify({ projectId, message: data.toString() }));
        });

        docker.stderr.on("data", (data) => {
            // process.stderr.write(data.toString());
            PUBLISH("ion-broadcast", JSON.stringify({ projectId, message: data.toString() }));
        });

        docker.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Build failed with code ${code}`));
        });
    });
};