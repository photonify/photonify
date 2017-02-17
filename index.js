const fs = require("fs");
const im = require("imagemagick");
const path = require("path");
const async = require("async");

const helpers = require("./helpers");
const s3Service = require("./s3_service");
const fsService = require("./fs_service");

let controller = {};

controller.process = (settings) => {
    return new Promise((resolve, reject) => {
        im.identify({data: settings.data}, (err, features) => {
            const sizes = settings.sizes || ["1024x768", "640x480", "160x144", null];

            if (settings.keepOriginal) {
                var aliases = ["large", "medium", "small", "original"];
            } else {
                var aliases = ["large", "medium", "small"];
            }

            let ops = [];
            let images = {};

            aliases.forEach((alias, index) => {
                ops.push((cb) => {
                    if (sizes[index]) {
                        var width = parseInt(sizes[index].split("x")[0]);
                        var height = parseInt(sizes[index].split("x")[1]);
                    } else {
                        var width = features.width;
                        var height = features.height;
                    }

                    //Make sure width and height do not exceed original dimensions
                    if (width > features.width || height > features.height) {
                        var width = features.width;
                        var height = features.height;
                    }

                    im.resize({
                        srcData: settings.data,
                        width: width,
                        height: height
                    }, (err, stdout, stderr) => {
                        const newFilename = helpers.generateFileName(settings, features, index);

                        if (settings.storage === "filesystem" || !settings.storage) {
                            fs.writeFileSync(
                                path.join(
                                    settings.dest,
                                    newFilename
                                ),
                                stdout,
                                "binary"
                            );

                            images[aliases[index]] = {
                                key: newFilename
                            }

                            cb();
                        } else {
                            s3Service.upload({
                                data: new Buffer(stdout, "binary"),
                                fileName: newFilename
                            })
                            .then((imageUrl) => {
                                images[aliases[index]] = {
                                    url: imageUrl,
                                    key: newFilename
                                }
                                cb();
                            });
                        }
                    });
                });
            });

            async.parallel(ops, () => {
                resolve(images);
            });
        });
    });
}

controller.remove = (settings) => {
    return new Promise((resolve, reject) => {
        if (settings.storage === "filesystem") {
            fsService
            .destroy(settings)
            .then(() => {
                resolve();
            });
        } else {
            s3Service
            .destroy(settings)
            .then(() => {
                resolve();
            });
        }
    });
}

module.exports = controller;
