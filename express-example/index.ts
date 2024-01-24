import express from "express";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import path from "path";
// import photonify from "../dist/index";

const app = express();

//Configure dotenv to set environment variables
dotenv.config();

//Use the plugin express-fileupload. This plugin simply adds a "files" property to req.
app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

//Test using S3 storage
app.post("/s3_test", (req, res) => {});

//Test using filesystem storage
app.post("/filesystem_test", (req, res) => {});

const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}...`);
});