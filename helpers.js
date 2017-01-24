const uuid = require("node-uuid");
const slug = require("slug");

let helpers = {};

helpers.getExtension = (format) => {
    if (/png/i.test(format)) {
        return ".png";
    } else if (/jpeg/i.test(format)) {
        return ".jpg";
    } else if (/gif/i.test(format)) {
        return ".gif";
    }
}

helpers.generateFingerprint = () => {
    return `-${uuid.v4().replace(/-/g, "")}`;
}

helpers.generateFileName = (settings, features, index) => {
    const fileSuffixes = ["-large", "-medium", "-small"];

    if (settings.fingerprint) {
        var fingerprint = helpers.generateFingerprint();
    }

    const extension = helpers.getExtension(features.format);

    return slug(settings.fileName) + (fingerprint || "") + fileSuffixes[index] + (extension || ".jpg");
}

module.exports = helpers;
