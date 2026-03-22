/*
    1. Get the build ID from the QUEUE.
    2. Based on the build ID pull the project from the S3.
    3. Build the downloaded project (contanarize it).
    4. The final built output final push to the S3 again (only dist files).
*/

import { BRPPO, REDIS_QUEUE_NAME } from "ion-common/redis";
import { buildProject } from "./builder";
import { getFileFromS3 } from "./aws";

const main = async () => {
    console.log("inside");
    while (1) {
        const queueRes = await BRPPO(REDIS_QUEUE_NAME);
        const id = queueRes?.element;
        console.log("from queue id: ", id);

        if (!id) {
            return;
        }

        // download the project from S3
        const res = await getFileFromS3(id);
        console.log("sdflsdfjkl",res);

        // build the project
        // await buildProject();

        // push the built project to S3 into /dist folder of the id.
    }
}

main();