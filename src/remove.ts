import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { Settings } from "./types";

export async function remove(fileName: string, settings: Partial<Settings>) {
  if (settings.storage !== "s3" || !settings.s3Config || !settings.s3Bucket) {
    throw new Error(
      "Photonify: Storage must be set to S3 and have s3Config and s3Bucket configured."
    );
  }

  if (process.env.NODE_ENV === "test") {
    return;
  }

  const client = new S3Client(settings.s3Config);

  const command = new DeleteObjectCommand({
    Bucket: settings.s3Bucket,
    Key: fileName,
  });

  try {
    await client.send(command);
    console.log(`Photonify S3 Delete: ${fileName}`);
  } catch (err) {
    console.error("Photonify: S3 delete error");
    console.error(err);
  }
}
