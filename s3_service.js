const AWS = require("aws-sdk");
const s3 = new AWS.S3();

let service = {};

service.stripUrl = (url) => {
    return url.split("?")[0];
}

service.upload = (settings, callback) => {
    return s3.putObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: settings.fileName,
        ACL: "public-read",
        Body: settings.data
    }, (err, data) => {
        return s3.getSignedUrl("putObject", {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: settings.fileName
        }, (error, url) => {
            return callback(err, service.stripUrl(url));
        });
    });
}

module.exports = service;
