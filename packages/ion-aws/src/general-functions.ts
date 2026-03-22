import path from "path";
import fs from "fs";

// recursively get all the files inside every folder.
export const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
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