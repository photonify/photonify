import sharp from "sharp";

import { Settings, Files, Sizes } from "./types";
import { DEFAULT_SIZES } from "./constants";

export async function process(files: Files, settings: Settings) {
  const sizes = settings?.sizes || DEFAULT_SIZES;
  const ops: any[] = [];

  files.forEach((file: any) => {
    Object.keys(sizes).forEach((alias: string, index: number) => {
      ops.push(
        sharp(file)
          .resize({
            width: sizes[alias as keyof Sizes]?.width,
            height: sizes[alias as keyof Sizes]?.height,
          })
          .toFile(settings.fileName)
      );
    });
  });

  try {
    await Promise.all(ops);
  } catch (e) {
    throw new Error("Photonify: Error processing images");
  }
}
