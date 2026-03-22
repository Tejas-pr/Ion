import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

export const uploadFileS3 = async (fileName: string, localFilePath: string) => {
    const fileStream = fs.createReadStream(localFilePath);

    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileStream,
        }),
    );
};

// this will list all the files of this folderID
export const getFilesFromS3Folder = async (folderId: string) => {
    const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `${folderId}/`,
    });

    const response = await s3Client.send(command);

    return response.Contents || [];
};

// this will get file.
export const getFileContents = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
    })
    const response = await s3Client.send(command);
    return response.Body;
}
