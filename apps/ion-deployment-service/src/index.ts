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

const main = async () => {
    while (1) {
        const queueRes = await BRPPO(REDIS_QUEUE_NAME);
        const id = queueRes?.element;

        if (!id) {
            return;
        }

        // download the project from S3
        const localOutputDir = path.join(__dirname, "output", id);
        const projectPath = await getFileFromS3(`clones/${id}`, localOutputDir);

        // build the project
        await buildProject(projectPath);

        // push the built project to S3 into /dist folder of the id.
        await uploadDirectory(path.join(projectPath, "dist"), `dist/${id}`);

        // remove from local machine
        await safeCleanup(localOutputDir);
    }
}

main();