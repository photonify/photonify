const fs = require("fs");
const im = require("imagemagick");
const path = require("path");
const async = require("async");
const slug = require("slug");

const helpers = require("./helpers");

let controller = {};

controller.resize = (settings, callback) => {
    im.identify({data: settings.data}, (err, features) => {
        const extension = helpers.getExtension(features.format);

        const sizes = ["1024x768", "640x480", "160x144"];

        const fileSuffixes = ["-large", "-medium", "-small"];

        let ops = [];

        sizes.forEach((size, index) => {
            ops.push((cb) => {
                im.resize({
                    srcData: settings.data,
                    width: size.split("x")[0],
                    height: size.split("x")[1]
                }, (err, stdout, stderr) => {
                    fs.writeFileSync(
                        path.join(
                            settings.dest,
                            slug(settings.fileName) + fileSuffixes[index] + (extension || ".jpg")
                        ),
                        stdout,
                        "binary"
                    );

                    cb();
                });
            });
        });

        async.parallel(ops, () => {
            callback();
        });
    });
}

module.exports = controller;
