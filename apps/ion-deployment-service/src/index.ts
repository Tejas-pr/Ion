/*
    1. Get the build ID from the QUEUE.
    2. Based on the build ID pull the project from the S3.
    3. Build the downloaded project (contanarize it).
    4. The final built output final push to the S3 again (only dist files).
    5. https://github.com/Tejas-pr/project01-vite.git
*/

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import path from "path";
import { BRPPO, REDIS_QUEUE_NAME, PUBLISH } from "ion-common/redis";
import { buildProject } from "./builder";
import { getFileFromS3, uploadDirectory } from "ion-aws/general-functions";
import { safeCleanup, scheduleCleanup, startCleanupJanitor } from "./cleaner";
import { prisma } from "@ion/database";
import express from "express";
import { metricsHandler } from "@ion/monitoring/monitoring";

const metricsApp = express();
metricsApp.get("/metrics", metricsHandler);
metricsApp.listen(3005, () => console.log("Metrics server on port 3005"));

const main = async () => {
    const outputBaseDir = path.join(__dirname, "output");

    // Start background janitor to remove old leftovers (older than 2 hrs)
    startCleanupJanitor(outputBaseDir);

    while (1) {
        const queueRes = await BRPPO(REDIS_QUEUE_NAME);
        const id = queueRes?.element;

        if (!id) {
            continue;
        }

        try {
            // Update status to BUILDING
            await prisma.project.update({
                where: { projectId: id },
                data: { status: "BUILDING" }
            });
            await PUBLISH("ion-broadcast", JSON.stringify({ projectId: id, status: "BUILDING" }));

            // download the project from S3
            const localOutputDir = path.join(__dirname, "output", id);
            const projectPath = await getFileFromS3(`clones/${id}`, localOutputDir);

            // build the project
            const { logs, duration } = await buildProject(projectPath, id);

            // Record build metadata in the database
            await prisma.build.create({
                data: {
                    status: "SUCCESS",
                    duration: duration,
                    commitHash: "N/A", 
                    logs: logs,
                    project: { connect: { projectId: id } }
                }
            });

            // Update status to DEPLOYING
            await prisma.project.update({
                where: { projectId: id },
                data: { status: "DEPLOYING" }
            });
            await PUBLISH("ion-broadcast", JSON.stringify({ projectId: id, status: "DEPLOYING" }));

            // push the built project to S3 into /dist folder of the id.
            await uploadDirectory(path.join(projectPath, "dist"), `dist/${id}`);

            // Update status to SUCCESS
            await prisma.project.update({
                where: { projectId: id },
                data: { status: "SUCCESS" }
            });
            await PUBLISH("ion-broadcast", JSON.stringify({ projectId: id, status: "SUCCESS" }));

            // Try to clean up immediately, fall back to timer if it fails (e.g. file lock)
            const success = await safeCleanup(localOutputDir);
            if (!success) {
                scheduleCleanup(localOutputDir);
            }
        } catch (error) {
            console.error("Deployment failed for ID:", id, error);

            // Still try to clean up if folder exists
            const currentPath = path.join(__dirname, "output", id);
            const success = await safeCleanup(currentPath);
            if (!success) {
                scheduleCleanup(currentPath);
            }

            await prisma.project.update({
                where: { projectId: id },
                data: { status: "FAILED" }
            });
            await PUBLISH("ion-broadcast", JSON.stringify({ projectId: id, status: "FAILED" }));
        }
    }
}

main();