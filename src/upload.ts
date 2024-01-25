import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Settings } from "./types";

export async function upload(
  settings: Settings,
  pathToFile: string,
  newFileName: string
) {
  const file = fs.readFileSync(pathToFile);

  const client = new S3Client({
    region: settings.s3Region,
  });

  const command = new PutObjectCommand({
    Bucket: "outlet",
    Key: newFileName,
    Body: file,
  });

  try {
    const response = await client.send(command);
    console.log(`Photonify S3 Upload: ${newFileName}`);
    console.log(response);
  } catch (err) {
    console.error("Photonify: S3 error");
    console.error(err);
  }
}
