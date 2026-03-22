
import path from "path";
import fs from "fs";
import { getFileContents, getFilesFromS3Folder, uploadFileS3 } from "./index";

// this will upload the directory to the S3
export const uploadDirectory = async (dirPath: string, projectId: string) => {
    const files = getAllFiles(dirPath);

    await Promise.all(
        files.map((filePath) => {
            const relativePath = path.relative(dirPath, filePath);
            const s3Key = `${projectId}/${relativePath.replace(/\\/g, "/")}`;
            return uploadFileS3(s3Key, filePath);
        })
    )
    console.log("getting and merging files");
};

// this will get all the files from the S3 folder
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullpath = path.join(dirPath, file);

        if (fs.statSync(fullpath).isDirectory()) {
            getAllFiles(fullpath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullpath);
        }
    });

    return arrayOfFiles;
};

// this will get the file from the S3 folder
export const getFileFromS3 = async (s3Prefix: string, localOutputDir: string) => {
    const files = await getFilesFromS3Folder(s3Prefix);

    const baseDir = localOutputDir;

    await Promise.all(
        files.map(async (file) => {
            const key = file.Key!; // e.g. clones/id/src/index.js
            const data = await getFileContents(key);

            // remove prefix length
            const relativePath = key.replace(`${s3Prefix}/`, "");

            const localPath = path.join(baseDir, relativePath);

            await streamToFile(data, localPath);
        })
    );

    return baseDir; // return local folder path
};

// this will convert the stream to file
export const streamToFile = async (stream: any, filePath: string) => {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

    return new Promise<void>((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);

        stream
            .pipe(writeStream)
            .on("finish", () => resolve())
            .on("error", reject);
    });
};
