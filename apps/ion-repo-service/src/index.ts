/* 
    1. Here we get the repo that need to clone and store it in the output by giving random ID for each cloned project.
    2. After cloning and putting it in the ouput, we need to upload those files to the S3.
    3. After uploading file we will get the ID from above, we need to push that ID into the queue so that deployment service
        pick the ID from and continue the process.
*/

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import fs from "fs";
import { generateRandomString } from "./generateRandom";
import { LPUSH, REDIS_QUEUE_NAME } from "ion-common/redis";
import { uploadDirectory } from "ion-aws/general-functions";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.url;
    console.log("hit");
    console.log(repoUrl);

    if (!repoUrl) {
        res.status(400).json({
            success: false,
            message: "Please provide url!",
        });
    }
    const id = generateRandomString();
    const outputPath = path.join(__dirname, `output/${id}`);
    await simpleGit().clone(repoUrl, outputPath); // what to clone and where to clone.

    // upload to S3
    await uploadDirectory(outputPath, `clones/${id}`);
    console.log("uploadFileS3 - 01");

    // remove from local machine
    await fs.promises.rm(outputPath, { recursive: true, force: true });
    console.log("cleaned up local files in repo service");

    // push the ID to QUEUE
    LPUSH(REDIS_QUEUE_NAME, id);

    res.json({
        success: true,
        id,
    });
});

app.listen(process.env.REPO_BACKEND_PORT || 3002);