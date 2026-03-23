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
import { BRPPO, REDIS_QUEUE_NAME } from "ion-common/redis";
import { buildProject } from "./builder";
import { getFileFromS3, uploadDirectory } from "ion-aws/general-functions";
import { safeCleanup } from "./cleaner";
import { prisma } from "@ion/database";

const main = async () => {
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

            // download the project from S3
            const localOutputDir = path.join(__dirname, "output", id);
            const projectPath = await getFileFromS3(`clones/${id}`, localOutputDir);

            // build the project
            await buildProject(projectPath, id);

            // Update status to DEPLOYING
            await prisma.project.update({
                where: { projectId: id },
                data: { status: "DEPLOYING" }
            });

            // push the built project to S3 into /dist folder of the id.
            await uploadDirectory(path.join(projectPath, "dist"), `dist/${id}`);

            // Update status to SUCCESS
            await prisma.project.update({
                where: { projectId: id },
                data: { status: "SUCCESS" }
            });

            // remove from local machine
            await safeCleanup(localOutputDir);
        } catch (error) {
            console.error("Deployment failed for ID:", id, error);
            await prisma.project.update({
                where: { projectId: id },
                data: { status: "FAILED" }
            });
        }
    }
}

main();