import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import { Settings, Files, Sizes } from "./types";
import { DEFAULT_SIZES } from "./constants";
import { upload } from "./upload";

export async function process(files: Files, settings: Settings) {
  const sizes = settings.sizes || DEFAULT_SIZES;
  const outputFormat = settings.outputFormat || "jpg";
  const outputDest =
    settings.storage === "s3"
      ? path.join(__dirname, "../tmp_for_upload")
      : settings.outputDest || "";

  const ops: any[] = [];
  const createdFiles: string[] = [];

  files.forEach((file: any) => {
    Object.keys(sizes).forEach((alias: string) => {
      const newFileName = `${uuidv4().replace(
        /-/g,
        ""
      )}-${alias}.${outputFormat}`;

      createdFiles.push(newFileName);

      ops.push(
        sharp(file)
          .resize({
            width: sizes[alias as keyof Sizes]?.width,
            height: sizes[alias as keyof Sizes]?.height,
          })
          .toFile(path.join(outputDest, newFileName))
          .then(() => {
            if (settings.storage === "s3") {
              ops.push(upload(path.join(outputDest, newFileName)));
            }
          })
      );
    });
  });

  try {
    await Promise.all(ops);

    return {
      createdFiles,
    };
  } catch (e) {
    console.log(e);
    throw new Error("Photonify: Error processing images");
  }
}
