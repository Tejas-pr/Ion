import { getFileContents, getFilesFromS3Folder } from "ion-aws/aws";
import path from "path";
import fs from "fs";

export const getFileFromS3 = async (id: string) => {
    const files = await getFilesFromS3Folder(id);

    const baseDir = path.join(__dirname, "output", id);

    await Promise.all(
        files.map(async (file) => {
            const key = file.Key!; // e.g. id/src/index.js
            const data = await getFileContents(key);

            // remove "id/" prefix
            const relativePath = key.replace(`${id}/`, "");

            const localPath = path.join(baseDir, relativePath);

            await streamToFile(data, localPath);
        })
    );

    return baseDir; // return local folder path
};

const streamToFile = async (stream: any, filePath: string) => {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);

        stream
            .pipe(writeStream)
            .on("finish", () => resolve())
            .on("error", reject);
    });
};