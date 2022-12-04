"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileToFirestore = exports.fileListToFirestore = exports.UploadFileListInput = exports.UploadFileInput = exports.UploadFileLinkInput = void 0;
const firebase_admin_1 = require("firebase-admin");
const nexus_1 = require("nexus");
const async_1 = __importDefault(require("async"));
exports.UploadFileLinkInput = (0, nexus_1.inputObjectType)({
    name: "UploadFileLinkInput",
    definition(t) {
        t.string("name", { required: true });
        t.string("url", { required: true });
    },
});
exports.UploadFileInput = (0, nexus_1.inputObjectType)({
    name: "UploadFileInput",
    definition(t) {
        t.field("upload", { type: "Upload" });
        t.field("link", { type: exports.UploadFileLinkInput });
    },
});
exports.UploadFileListInput = (0, nexus_1.inputObjectType)({
    name: "UploadFileListInput",
    definition(t) {
        t.field("add", { type: "Upload", list: true });
        t.field("link", { type: exports.UploadFileLinkInput, list: true });
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
    return { name: filename, url: publicUrl, isLinked: false };
};
const fileListToFirestore = async (input, currentData = []) => {
    const { link = [], add = [], remove = [] } = input;
    const addedFiles = await async_1.default.map(add || [], uploadFile);
    const linked = link.map((link) => (Object.assign(Object.assign({}, link), { isLinked: true })));
    const newCurrentData = await async_1.default.filter(currentData, async (file) => {
        if (remove.includes(file.name)) {
            try {
                if (!file.isLinked)
                    await (0, firebase_admin_1.storage)().bucket().file(file.name).delete();
                return false;
            }
            catch (error) {
                return true;
            }
        }
        return true;
    });
    return newCurrentData.concat(addedFiles).concat(linked);
};
exports.fileListToFirestore = fileListToFirestore;
const fileToFirestore = async (input, currentData) => {
    if (currentData && (input === null || input === void 0 ? void 0 : input.upload) && input.link && !currentData.isLinked) {
        await (0, firebase_admin_1.storage)().bucket().file(currentData.name).delete();
    }
    if (input === null || input === void 0 ? void 0 : input.upload) {
        return uploadFile(input.upload);
    }
    if (input === null || input === void 0 ? void 0 : input.link) {
        return Object.assign(Object.assign({}, input.link), { isLinked: true });
    }
    return null;
};
exports.fileToFirestore = fileToFirestore;
