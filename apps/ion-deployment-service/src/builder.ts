import { spawn } from "child_process";

export const buildProject = async (projectPath: string) => {
    console.log("Starting Docker build...");
    await runDockerBuild(projectPath);
    console.log("Build finished");
};

const runDockerBuild = (projectPath: string) => {
    console.log("projectPath", projectPath);

    return new Promise<void>((resolve, reject) => {
        const docker = spawn("docker", [
            "run",
            "--rm",
            "--dns=8.8.8.8",
            "-v", `${projectPath}:/app`,
            "-w", "/app",
            "node:20",
            "sh",
            "-c",
            "rm -rf node_modules && node -v && npm -v && npm install --verbose && npm run build"
        ]);

        docker.stdout.on("data", (data) => {
            process.stdout.write(data.toString());
        });

        docker.stderr.on("data", (data) => {
            process.stderr.write(data.toString());
        });

        docker.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Build failed with code ${code}`));
        });
    });
};