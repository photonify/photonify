import { expect } from "chai";
import fs from "fs";
import path from "path";

import photonify from "../src/index";

describe("Function: Process", () => {
  it("Should call the process function with one image and custom sizes", async () => {
    const image1 = fs.readFileSync(
      path.join(__dirname, "test_images/first_image.jpg")
    );

    const result = await photonify.process([image1], {
      outputDest: path.join(__dirname, "tmp_resized_images"),
      sizes: {
        lg: {
          width: 500,
          height: 250,
        },
        md: {
          width: 250,
          height: 125,
        },
      },
    });

    result.createdFiles.forEach((createdFile: string) => {
      const newFilePath = path.join(
        __dirname,
        "tmp_resized_images",
        createdFile
      );

      expect(fs.existsSync(newFilePath)).to.be.true;

      // Delete temp file after spec is run
      fs.unlinkSync(newFilePath);
    });
  });
});
