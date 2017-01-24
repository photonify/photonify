let helpers = {};

helpers.getExtension = (format) => {
    if (/png/i.test(format)) {
        return ".png";
    } else if (/jpeg/i.test(format)) {
        return ".jpg";
    }
}

module.exports = helpers;
