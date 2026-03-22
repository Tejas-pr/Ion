import { uploadFileS3 } from "ion-aws/aws";
import path from "path";
import fs from "fs";

export const uploadDirectory = async (dirPath: string, projectId: string) => {
    const files = getAllFiles(dirPath);

    await Promise.all(
        files.map((filePath) => {
            const relativePath = path.relative(dirPath, filePath);
            const s3Key = `${projectId}/${relativePath.replace(/\\/g, "/")}`;
            return uploadFileS3(s3Key, filePath);
        })
    )
};

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullpath = path.join(dirPath, file);

        if(fs.statSync(fullpath).isDirectory()) {
            getAllFiles(fullpath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullpath);
        }
    });

    return arrayOfFiles;
};