import { expect } from "chai";
import fs from "fs";
import path from "path";

import photonify from "../src/index";

describe("Function: Process", () => {
  it("Should properly call the process function", () => {
    const image1 = fs.readFileSync(
      path.join(__dirname, "test_images/first_image.jpg")
    );

    photonify.process([image1], {
      fileName: "first_image.jpg",
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
  });
});
