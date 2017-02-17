const async = require("async");
const fs = require("fs");
const path = require("path");

let service = {};

service.destroy = (settings) => {
    return new Promise((resolve, reject) => {
        let ops = [];

        settings.keys.forEach((fsKey) => {
            ops.push((cb) => {
                console.log(`Photonify (Filesystem) - Removing Key: ${fsKey}`);

                fs.unlink(path.join(settings.source, fsKey), () => {
                    cb();
                });
            });
        });

        async.parallel(ops, () => {
            resolve();
        });
    });
}

module.exports = service;
