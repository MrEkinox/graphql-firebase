"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Converter = void 0;
const file_1 = require("../file");
const async_1 = __importDefault(require("async"));
const utils_1 = require("../utils");
const mutations_1 = require("../mutations");
class Converter {
    constructor(schema, batch) {
        this.schema = schema;
        this.batch = batch;
    }
    async toFirebase(name, newData, parentRef, snapshot) {
        const lastData = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data();
        const fields = (0, utils_1.getSchemaFields)(name, this.schema);
        const resultArray = await Promise.all(fields.map(async (field) => {
            let fieldData = newData[field.name];
            const lastFieldData = lastData === null || lastData === void 0 ? void 0 : lastData[field.name];
            if (typeof fieldData === "undefined")
                return {};
            if (field.type === "Reference" && field.target) {
                fieldData = await this.convertReference(field.target, fieldData);
            }
            else if (field.type === "ReferenceList" && field.target) {
                fieldData = await this.convertReferenceList(field.target, fieldData, lastFieldData);
            }
            else if (field.type === "Collection" && field.target) {
                await this.convertCollection(field.target, fieldData, parentRef);
                return {};
            }
            else if (field.type === "File") {
                fieldData = await (0, file_1.fileToFirestore)(fieldData, lastFieldData);
            }
            else if (field.type === "FileList") {
                fieldData = await (0, file_1.fileListToFirestore)(fieldData, lastFieldData);
            }
            return { [field.name]: fieldData };
        }));
        return resultArray.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), cur)), Object.assign({ id: parentRef.id, updatedAt: new Date() }, (!lastData && { createdAt: new Date() })));
    }
    async convertCollection(name, input, parentRef) {
        const ref = parentRef.collection((0, utils_1.plural)(name));
        await async_1.default.map((input === null || input === void 0 ? void 0 : input.createAndAdd) || [], async (data2) => {
            const docRef = ref.doc();
            const data = await this.toFirebase(name, data2, docRef);
            this.batch.set(docRef, data);
            return docRef;
        });
        await async_1.default.map((input === null || input === void 0 ? void 0 : input.update) || [], async (data2) => {
            const docRef = ref.doc(data2.id);
            const snapshot = await docRef.get();
            const data = await this.toFirebase(name, data2.fields, docRef, snapshot);
            this.batch.update(docRef, data);
            return docRef;
        });
        await async_1.default.map((input === null || input === void 0 ? void 0 : input.delete) || [], async (id) => {
            const docRef = ref.doc(id);
            this.batch.delete(docRef);
            return docRef;
        });
    }
    async convertReference(name, input) {
        const collection = (0, mutations_1.getCollection)(name);
        if (input === null || input === void 0 ? void 0 : input.createAndLink) {
            const docRef = collection.doc();
            const data = await this.toFirebase(name, input.createAndLink, docRef);
            this.batch.set(docRef, data);
            return docRef;
        }
        if (input === null || input === void 0 ? void 0 : input.link) {
            return collection.doc(input.link);
        }
        return null;
    }
    async convertReferenceList(name, input, lastData = []) {
        const collection = (0, mutations_1.getCollection)(name);
        const created = await async_1.default.map(input.createAndAdd || [], async (data2) => {
            const ref = collection.doc();
            const data = await this.toFirebase(name, data2, ref);
            this.batch.set(ref, data);
            return ref;
        });
        const addRef = (input.add || []).map((id) => collection.doc(id));
        const newCurrentData = lastData
            .filter((data) => { var _a; return !((_a = input.remove) === null || _a === void 0 ? void 0 : _a.includes(data.id)); })
            .concat(created)
            .concat(addRef);
        return newCurrentData.reduce((acc, cur) => {
            if (acc.find((c) => c.id === cur.id))
                return acc;
            return [...acc, cur];
        }, []);
    }
}
exports.Converter = Converter;
