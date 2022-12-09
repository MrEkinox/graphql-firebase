"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.UploadFileListInput = exports.UploadFileInput = void 0;
const firebase_admin_1 = require("firebase-admin");
const nexus_1 = require("nexus");
exports.UploadFileInput = (0, nexus_1.inputObjectType)({
    name: "UploadFileInput",
    definition(t) {
        t.field("upload", { type: "Upload" });
        t.string("link");
    },
});
exports.UploadFileListInput = (0, nexus_1.inputObjectType)({
    name: "UploadFileListInput",
    definition(t) {
        t.field("add", { type: "Upload", list: true });
        t.string("link", { list: true });
        t.string("remove", { list: true });
    },
});
const uploadFile = async (input) => {
    const { createReadStream, filename } = await input;
    const stream = createReadStream();
    const file = (0, firebase_admin_1.storage)().bucket().file(filename);
    await new Promise((resolve, reject) => {
        const writeStream = file.createWriteStream({
            validation: false,
            metadata: { cacheControl: "public,max-age=31536000" },
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
        stream.on("error", writeStream.destroy);
        stream.on("error", reject);
        stream.pipe(writeStream);
    });
    const publicUrl = await file.publicUrl();
    return publicUrl;
};
exports.uploadFile = uploadFile;
