/* 
    1. Here we get the repo that need to clone and store it in the output by giving random ID for each cloned project.
    2. After cloning and putting it in the ouput, we need to upload those files to the S3.
    3. After uploading file we will get the ID from above, we need to push that ID into the queue so that deployment service
        pick the ID from and continue the process.
*/

import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import path from "path";
import fs from "fs";
import { generateRandomString } from "./generateRandom";
import { LPUSH, REDIS_QUEUE_NAME } from "ion-common/redis";
import { uploadDirectory } from "ion-aws/general-functions";
import { prisma } from "@ion/database";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";

const { auth } = await import("@ion/auth/auth");

const app = express();

app.all(/\/api\/auth\/.*/, toNodeHandler(auth));

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user?.id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized!",
        });
    }

    const userId = session.user.id;
    const name = req.body.name;
    const repoUrl = req.body.url;

    if (!repoUrl || !name || !userId) {
        res.status(400).json({
            success: false,
            message: "Please provide url, project name and user id!",
        });
    }
    const id = generateRandomString();
    if (!id) {
        res.status(500).json({
            success: false,
            message: "Failed to generate random string!",
        });
    }

    await prisma.project.create({
        data: {
            projectId: id,
            name: name,
            repoUrl,
            userId,
        }
    });

    const outputPath = path.join(__dirname, `output/${id}`);
    await simpleGit().clone(repoUrl, outputPath);

    await uploadDirectory(outputPath, `clones/${id}`);

    await fs.promises.rm(outputPath, { recursive: true, force: true });

    LPUSH(REDIS_QUEUE_NAME, id);

    res.json({
        success: true,
        id,
    });
});

app.listen(process.env.REPO_BACKEND_PORT || 3002, () => {
    console.log("Repo service is running on port", process.env.REPO_BACKEND_PORT || 3002);
});