import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { Settings } from "./types";

export async function remove(fileName: string, settings: Partial<Settings>) {
  if (!settings.s3Config || !settings.s3Bucket) {
    throw new Error("Photonify: s3Config or s3Bucket is not set in settings");
  }

  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (settings && settings.storage === "s3") {
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
  }
}
