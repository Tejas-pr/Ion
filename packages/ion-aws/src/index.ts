import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getAllFiles } from "./general-functions";
import path from "path";
import fs from "fs";

const accessKey = process.env.CLOUDFLARE_ACCESS_KEY!;
const secretAccess = process.env.CLOUDFLARE_SECRET_KEY!;
const bucketName = process.env.BUCKET_NAME;
const endPoint = process.env.S3_API;

const s3Client = new S3Client({
    region: "auto",
    endpoint: endPoint,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccess
    }
});

const uploadFileS3 = async (fileName: string, localFilePath: string) => {
    console.log("uploadFileS3");
    const fileStream = fs.createReadStream(localFilePath);

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileStream,
        }),
    );
};

export const uploadDirectory = async (dirPath: string, projectId: string) => {
    console.log("uploadDirectory");
    const files = getAllFiles(dirPath);

    await Promise.all(
        files.map((filePath) => {
            const relativePath = path.relative(dirPath, filePath);
            const s3Key = `${projectId}/${relativePath.replace(/\\/g, "/")}`;
            return uploadFileS3(s3Key, filePath);
        })
    )
};
