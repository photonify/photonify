"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFiles = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
function removeFiles(fileNames, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        if (settings.storage !== "s3" || !settings.s3Config || !settings.s3Bucket) {
            throw new Error("Photonify: Storage must be set to S3 and have s3Config and s3Bucket configured.");
        }
        if (process.env.NODE_ENV === "test") {
            return;
        }
        const client = new client_s3_1.S3Client(settings.s3Config);
        const deleteObjects = fileNames.map((fileName) => {
            return {
                Key: fileName,
            };
        });
        const command = new client_s3_1.DeleteObjectsCommand({
            Bucket: settings.s3Bucket,
            Delete: {
                Objects: deleteObjects,
            },
        });
        try {
            const result = yield client.send(command);
            fileNames.forEach((fileName) => {
                console.log(`Photonify S3 Delete: ${fileName}`);
            });
            return result;
        }
        catch (e) {
            console.error(e);
            throw new Error("Photonify: S3 delete error");
        }
    });
}
exports.removeFiles = removeFiles;
