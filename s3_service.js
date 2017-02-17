const async = require("async");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

let service = {};

service.stripUrl = (url) => {
    return url.split("?")[0];
}

service.upload = (settings) => {
    return new Promise((resolve, reject) => {
        s3.putObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: settings.fileName,
            ACL: "public-read",
            Body: settings.data
        }, (err, data) => {
            s3.getSignedUrl("putObject", {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: settings.fileName
            }, (error, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(service.stripUrl(url));
                }
            });
        });
    });
}

service.destroy = (settings) => {
    return new Promise((resolve, reject) => {
        let ops = [];

        settings.keys.forEach((s3Key) => {
            ops.push((cb) => {
                console.log(`Photonify (S3) - Removing Key: ${s3Key}`);

                s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: s3Key
                }, (err, data) => {
                    cb(data);
                });
            });
        });

        async.parallel(ops, (result) => {
            resolve(result);
        });
    });
}

module.exports = service;
