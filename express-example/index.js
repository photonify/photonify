const express = require("express");
const photonify = require("photonify");
const fileUpload = require("express-fileupload");

let app = express();

//Configure dotenv to set environment variables
require("dotenv").config();

//Use the plugin express-fileupload. This plugin simply adds a "files" property to req.
app.use(fileUpload());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//Test using S3 storage
app.post("/s3_test", (req, res) => {
    photonify.process({
        data: req.files.photo.data,
        fileName: req.files.photo.name,
        fingerprint: true,
        storage: "s3"
    })
    .then((images) => {
        res.status(201).json(images);
    });
});

//Test using filesystem storage
app.post("/filesystem_test", (req, res) => {
    photonify.process({
        data: req.files.photo.data,
        fileName: req.files.photo.name,
        dest: "./public/images",
        fingerprint: true,
        storage: "filesystem"
    })
    .then((images) => {
        res.status(201).json(images);
    });
});

app.listen(9000);
