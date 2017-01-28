const fs = require("fs");
const im = require("imagemagick");
const path = require("path");
const async = require("async");

const helpers = require("./helpers");
const s3Service = require("./s3_service");
const fsService = require("./fs_service");

let controller = {};

controller.process = (settings, callback) => {
    im.identify({data: settings.data}, (err, features) => {
        const sizes = settings.sizes || ["1024x768", "640x480", "160x144"];

        const aliases = ["large", "medium", "small"];

        let ops = [];
        let images = {};

        sizes.forEach((size, index) => {
            ops.push((cb) => {
                im.resize({
                    srcData: settings.data,
                    width: size.split("x")[0],
                    height: size.split("x")[1]
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
                        }, (err, imageUrl) => {
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
            callback(images);
        });
    });
}

controller.remove = (settings, callback) => {
    if (settings.storage === "filesystem") {
        fsService.destroy(settings, () => {
            callback();
        });
    } else {
        s3Service.destroy(settings, () => {
            callback();
        });
    }
}

module.exports = controller;
