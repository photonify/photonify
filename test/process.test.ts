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

  it("Should call the process function with multiple images and standard sizes", async () => {
    const image1 = fs.readFileSync(
      path.join(__dirname, "test_images/first_image.jpg")
    );

    const image2 = fs.readFileSync(
      path.join(__dirname, "test_images/second_image.jpg")
    );

    const image3 = fs.readFileSync(
      path.join(__dirname, "test_images/third_image.jpg")
    );

    const result = await photonify.process([image1, image2, image3], {
      outputDest: path.join(__dirname, "tmp_resized_images"),
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

  it("Should call the process function with one image, standard sizes, and S3 storage", async () => {
    const image1 = fs.readFileSync(
      path.join(__dirname, "test_images/first_image.jpg")
    );

    const result = await photonify.process([image1], {
      storage: "s3",
      s3Region: "us-west-1",
    });

    result.createdFiles.forEach((createdFile: string) => {
      const newFilePath = path.join(
        process.cwd(),
        "tmp_for_upload",
        createdFile
      );

      expect(fs.existsSync(newFilePath)).to.be.true;

      // Delete temp file after spec is run
      fs.unlinkSync(newFilePath);
    });
  });
});
