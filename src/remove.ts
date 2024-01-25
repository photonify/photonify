import fs from "fs";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { Settings } from "./types";

export async function remove(
  settings: Partial<Settings>,
  pathToFile?: string,
  fileName?: string
) {
  if (settings.storage === "s3") {
    const client = new S3Client(settings.s3Config);

    const command = new DeleteObjectCommand({
      Bucket: settings.s3Bucket,
      Key: fileName,
    });

    try {
      await client.send(command);
      console.log(`Photonify S3 Delete: ${fileName}`);
    } catch (err) {
      console.error(err);
    }
  } else {
    if (pathToFile) {
      fs.unlinkSync(pathToFile);
    }

    console.log(`Photonify Local Delete: ${pathToFile}`);
  }
}
