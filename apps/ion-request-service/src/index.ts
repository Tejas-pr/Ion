/*
    1. Here user will hit this to get the HTML that need to service in the internet.
    2. get the files from the S3 based on the id and the filepath.
    3. Return that file to the client in the formate of html to serve in the browser.
*/

import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import express from "express";
import cors from "cors";
import { getFileContents } from "ion-aws/aws"
import { prisma } from "@ion/database";
import { renderNotFound } from "./template";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { allowedOrigins } from "ion-common/redis";
import { metricsHandler, metricsMiddleware } from "@ion/monitoring/monitoring";
const { auth } = await import("@ion/auth/auth");

const app = express();
app.use(metricsMiddleware);

app.all(/\/api\/auth\/.*/, toNodeHandler(auth));

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.get("/metrics", metricsHandler);

app.get("/api/me", async (req, res) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

app.use(express.json());

app.get('/workspace', async (req, res) => {
    const userId = (await getUserSession(req, res))?.user?.id;

    const projects = await prisma.project.findMany({
        where: {
            userId,
        },
    });

    return res.status(200).json({
        success: true,
        projects,
    });
});

app.get('/project/:id', async (req, res) => {
    const id = req.params.id;
    const userId = (await getUserSession(req, res))?.user?.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Please provide project id!",
        });
    }

    const project = await prisma.project.findUnique({
        where: {
            projectId: id,
            userId,
        },
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found!",
        });
    }

    return res.status(200).json({
        success: true,
        project,
    });
});

app.get(/(.*)/, async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];

    let filePath = req.path;
    if (filePath === "/") {
        filePath = "/index.html";
    }

    try {
        const contents = await getFileContents(`dist/${id}${filePath}`);

        let type = "text/html";
        if (filePath.endsWith(".css") || filePath.endsWith("css")) type = "text/css";
        else if (filePath.endsWith(".js") || filePath.endsWith("js")) type = "application/javascript";
        else if (filePath.endsWith(".svg") || filePath.endsWith("svg")) type = "image/svg+xml";
        else if (filePath.endsWith(".json") || filePath.endsWith("json")) type = "application/json";

        res.set("Content-Type", type);

        if (contents) {
            // @ts-ignore
            contents.pipe(res);
        } else {
            res.status(404).send(renderNotFound(filePath));
        }
    } catch (error) {
        res.status(404).send(renderNotFound(filePath));
    }
});

app.listen(process.env.REQUEST_BACKEND_PORT || 3003, () => {
    console.log("Request service is running on port", process.env.REQUEST_BACKEND_PORT || 3003);
});

const getUserSession = async (req: any, res: any) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return session;
}