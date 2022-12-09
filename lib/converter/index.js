"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const file_1 = require("../file");
const async_1 = __importDefault(require("async"));
const utils_1 = require("../utils");
const mutations_1 = require("../mutations");
class Converter {
    constructor(schema, batch) {
        this.fileListToFirestore = async (field, input, ref) => {
            const { link = [], add = [], remove = [] } = input;
            const addedFiles = await async_1.default.map(add || [], file_1.uploadFile);
            if (addedFiles.length)
                this.batch.set(ref, { [field.name]: firebase_admin_1.default.firestore.FieldValue.arrayUnion(...addedFiles) }, { merge: true });
            if (link.length)
                this.batch.set(ref, { [field.name]: firebase_admin_1.default.firestore.FieldValue.arrayUnion(...link) }, { merge: true });
            if (remove.length)
                this.batch.update(ref, {
                    [field.name]: firebase_admin_1.default.firestore.FieldValue.arrayRemove(...remove),
                });
        };
        this.fileToFirestore = async (input) => {
            if (input === null || input === void 0 ? void 0 : input.upload) {
                return (0, file_1.uploadFile)(input.upload);
            }
            if (input === null || input === void 0 ? void 0 : input.link) {
                return input.link;
            }
            return null;
        };
        this.schema = schema;
        this.batch = batch;
    }
    async toFirebase(name, newData, parentRef, created) {
        const fields = (0, utils_1.getSchemaFields)(name, this.schema);
        const resultArray = await Promise.all(fields.map(async (field) => {
            let fieldData = newData[field.name];
            if (typeof fieldData === "undefined")
                return {};
            if (field.type === "Reference") {
                fieldData = await this.convertReference(field, fieldData);
            }
            else if (field.type === "ReferenceList") {
                await this.convertReferenceList(field, fieldData, parentRef);
                return {};
            }
            else if (field.type === "Collection") {
                await this.convertCollection(field, fieldData, parentRef);
                return {};
            }
            else if (field.type === "File") {
                fieldData = await this.fileToFirestore(fieldData);
            }
            else if (field.type === "FileList") {
                await this.fileListToFirestore(field, fieldData, parentRef);
                return {};
            }
            return { [field.name]: fieldData };
        }));
        return resultArray.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), cur)), Object.assign({ id: parentRef.id, updatedAt: new Date() }, (created && { createdAt: new Date() })));
    }
    async convertCollection({ name, target }, input, parentRef) {
        const ref = parentRef.collection(name);
        await async_1.default.map((input === null || input === void 0 ? void 0 : input.createAndAdd) || [], async (data2) => {
            if (!target)
                throw new Error(`·no target found for field ${name}`);
            const docRef = ref.doc();
            const data = await this.toFirebase(target, data2, docRef, true);
            this.batch.set(docRef, data);
            return docRef;
        });
        await async_1.default.map((input === null || input === void 0 ? void 0 : input.update) || [], async (data2) => {
            if (!target)
                throw new Error(`·no target found for field ${name}`);
            const docRef = ref.doc(data2.id);
            const data = await this.toFirebase(target, data2.fields, docRef);
            this.batch.update(docRef, data);
            return docRef;
        });
        await async_1.default.map((input === null || input === void 0 ? void 0 : input.delete) || [], async (id) => {
            const docRef = ref.doc(id);
            this.batch.delete(docRef);
            return docRef;
        });
    }
    async convertReference({ target }, input) {
        if (!target)
            return null;
        const createAndLink = input === null || input === void 0 ? void 0 : input.createAndLink;
        const parents = (0, mutations_1.getParents)(target, [], this.schema);
        const collection = (0, mutations_1.getCollection)(parents);
        if (createAndLink) {
            const docRef = collection.doc();
            const data = await this.toFirebase(target, createAndLink, docRef, true);
            this.batch.set(docRef, data);
            return docRef;
        }
        if (input === null || input === void 0 ? void 0 : input.link) {
            return collection.doc(input.link);
        }
        return null;
    }
    async convertReferenceList(field, input, ref) {
        if (!field.target)
            throw new Error(`·no target found for field ${field.name}`);
        const parents = (0, mutations_1.getParents)(field.target, [], this.schema);
        const collection = (0, mutations_1.getCollection)(parents);
        const created = await async_1.default.map(input.createAndAdd || [], async (data2) => {
            if (!field.target)
                throw new Error(`·no target found for field ${field.name}`);
            const ref = collection.doc();
            const data = await this.toFirebase(field.target, data2, ref, true);
            this.batch.set(ref, data);
            return ref;
        });
        if (created.length) {
            this.batch.set(ref, { [field.name]: firebase_admin_1.default.firestore.FieldValue.arrayUnion(...created) }, { merge: true });
        }
        const addRef = (input.add || []).map((id) => collection.doc(id));
        if (addRef.length)
            this.batch.set(ref, { [field.name]: firebase_admin_1.default.firestore.FieldValue.arrayUnion(...addRef) }, { merge: true });
        const removeRef = (input.remove || []).map((id) => collection.doc(id));
        if (removeRef.length) {
            this.batch.update(ref, {
                [field.name]: firebase_admin_1.default.firestore.FieldValue.arrayRemove(...removeRef),
            });
        }
    }
}
exports.Converter = Converter;
