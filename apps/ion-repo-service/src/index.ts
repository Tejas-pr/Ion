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
import { getUserGitHubAccessToken, LPUSH, REDIS_QUEUE_NAME } from "ion-common/redis";
import { uploadDirectory } from "ion-aws/general-functions";
import { prisma } from "@ion/database";
import { toNodeHandler } from "better-auth/node";
import { authMiddleware } from "ion-common/middleware-service";
import { metricsHandler, metricsMiddleware } from "@ion/monitoring/monitoring";

const { auth } = await import("@ion/auth/auth");

const app = express();
app.use(metricsMiddleware);

app.all(/\/api\/auth\/.*/, toNodeHandler(auth));

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

app.get("/metrics", metricsHandler);


// https://docs.github.com/en/rest/repos/repos?apiVersion=2026-03-10&versionId=free-pro-team%40latest&category=repos&subcategory=contents
app.get("/github/repos", authMiddleware(auth), async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 20;

    console.log("PAGE:", page, "PER_PAGE:", perPage);

    const accessToken = await getUserGitHubAccessToken(userId);

    if (!accessToken) {
      return res.status(401).json({ error: "No GitHub token found" });
    }

    // const url = `https://api.github.com/user/repos?type=all&sort=pushed&direction=desc&page=${page}&per_page=${perPage}`;
    const url = `https://api.github.com/repos/`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();

    const linkHeader = response.headers.get("link");

    let hasNextPage = false;
    let hasPrevPage = false;

    if (linkHeader) {
      hasNextPage = linkHeader.includes('rel="next"');
      hasPrevPage = linkHeader.includes('rel="prev"');
    }

    return res.json({
      repos: data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        url: repo.html_url,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
      })),
      pagination: {
        page,
        perPage,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("GitHub Repo Fetch Error:", error);
    return res.status(500).json({ error: "Failed to fetch repos" });
  }
});

app.post("/deploy", authMiddleware(auth), async (req, res) => {
  // @ts-ignore
  const userId = req.user.id;

  const name = req.body.name;
  const repoUrl = req.body.url;

  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: "User not found in database",
    });
  }

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

  const project = await prisma.project.create({
    data: {
      projectId: id,
      name: name,
      repoUrl,
      userId,
      status: "CLONING",
    }
  });

  // Return immediately to the frontend
  res.json({
    success: true,
    id,
    project,
  });

  // Handle cloning/uploading in the background
  (async () => {
    try {
      const outputPath = path.join(__dirname, `output/${id}`);
      await simpleGit().clone(repoUrl, outputPath);

      await uploadDirectory(outputPath, `clones/${id}`);

      await fs.promises.rm(outputPath, { recursive: true, force: true });

      // update status to IN_QUEUE before pushing to redis
      await prisma.project.update({
        where: { id: project.id },
        data: { status: "IN_QUEUE" }
      });

      LPUSH(REDIS_QUEUE_NAME, id);
    } catch (error) {
      console.error("Cloning or uploading failed for project:", id, error);
      await prisma.project.update({
        where: { id: project.id },
        data: { status: "FAILED" }
      });
    }
  })();
});

app.listen(process.env.REPO_BACKEND_PORT || 3002, () => {
  console.log("Repo service is running on port", process.env.REPO_BACKEND_PORT || 3002);
});