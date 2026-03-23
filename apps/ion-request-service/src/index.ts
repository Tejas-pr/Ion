/*
    1. Here user will hit this to get the HTML that need to service in the internet.
    2. get the files from the S3 based on the id and the filepath.
    3. Return that file to the client in the formate of html to serve in the browser.
*/

import express from "express";
import cors from "cors";
import { getFileContents } from "ion-aws/aws"

const app = express();
app.use(cors());
app.use(express.json());

app.get(/(.*)/, async (req, res) => {
    const host = req.hostname;
    // For example: "id.ion.com" -> "id"
    const id = host.split(".")[0].toUpperCase();

    // Default to /index.html if root path is accessed
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

        // Pipe the AWS SDK stream response to the express response
        if (contents) {
            // @ts-ignore
            contents.pipe(res);
        } else {
            res.status(404).send("Not Found");
        }
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(404).send("Not Found");
    }
});

app.listen(process.env.REQUEST_BACKEND_PORT || 3003);