import fs from "fs";
import path from "path";

export function renderNotFound(filePath: string) {
    const template = fs.readFileSync(
        path.join(__dirname, "not-found.html"),
        "utf-8"
    );

    return template.replace("{{PATH}}", filePath);
}