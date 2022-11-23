"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetFromFirestore = exports.targetToFirestore = void 0;
const utils_1 = require("../utils");
const file_1 = require("./file/");
const pointer_1 = require("./pointer/");
const relation_1 = require("./relation/");
const collection_1 = require("./collection/");
const async_1 = __importDefault(require("async"));
const targetToFirestore = ({ fields }, data, batch, parentRef, snapshot) => {
    const currentData = snapshot === null || snapshot === void 0 ? void 0 : snapshot.data();
    return (0, utils_1.AsyncObjectReduce)(fields, async (acc, fieldName, fieldOptions) => {
        let fieldData = data === null || data === void 0 ? void 0 : data[fieldName];
        const fieldLastData = currentData === null || currentData === void 0 ? void 0 : currentData[fieldName];
        const { type } = fieldOptions;
        if (typeof fieldData === "undefined") {
            if (!currentData && typeof fieldOptions["defaultValue"] !== "undefined")
                return Object.assign(Object.assign({}, acc), { [fieldName]: fieldOptions["defaultValue"] });
            if (!currentData && type === "Pointer")
                return Object.assign(Object.assign({}, acc), { [fieldName]: null });
            return acc;
        }
        if (type === "Pointer") {
            const { target } = fieldOptions;
            fieldData = await (0, pointer_1.pointerToFirestore)(fieldData, target, batch);
            return Object.assign(Object.assign({}, acc), { [fieldName]: fieldData });
        }
        if (type === "File") {
            if (fieldOptions.list)
                fieldData = await (0, file_1.fileListToFireStore)(fieldData, fieldLastData);
            else
                fieldData = await (0, file_1.fileToFirestore)(fieldData, fieldLastData);
            return Object.assign(Object.assign({}, acc), { [fieldName]: fieldData });
        }
        if (type === "Object") {
            if (fieldData instanceof Array) {
                fieldData = await async_1.default.map(fieldData, async (data) => (0, exports.targetToFirestore)(fieldOptions, data, batch, parentRef, snapshot));
            }
            else {
                fieldData = await (0, exports.targetToFirestore)(fieldOptions, fieldData, batch, parentRef, snapshot);
            }
        }
        if (type === "Relation") {
            const { target } = fieldOptions;
            fieldData = await (0, relation_1.relationToFirestore)(fieldData, target, batch, fieldLastData);
        }
        if (type === "Collection") {
            const { target } = fieldOptions;
            await (0, collection_1.collectionToFirestore)(fieldData, target, batch, parentRef);
            return acc;
        }
        if (type === "Boolean" || type === "String" || type === "Number") {
            return Object.assign(Object.assign({}, acc), { [fieldName]: fieldData });
        }
        return Object.assign(Object.assign({}, acc), { [fieldName]: fieldData || null });
    });
};
exports.targetToFirestore = targetToFirestore;
const targetFromFirestore = async ({ fields }, currentData, whereInput, parentIds = {}) => {
    return (0, utils_1.AsyncObjectReduce)(fields, async (acc, fieldName, fieldOptions) => {
        const { type } = fieldOptions;
        const whereFieldsInput = whereInput === null || whereInput === void 0 ? void 0 : whereInput[fieldName];
        if (type === "Collection" && whereFieldsInput) {
            const { target } = fieldOptions;
            await (0, collection_1.collectionWhereFromFirestore)(target, parentIds, whereFieldsInput);
        }
        let fieldData = currentData === null || currentData === void 0 ? void 0 : currentData[fieldName];
        if (typeof fieldData === "undefined")
            return acc;
        if (type === "Pointer") {
            const { target } = fieldOptions;
            fieldData = await (0, pointer_1.pointerFromFirestore)(fieldData, target, whereFieldsInput);
        }
        if (type === "Object") {
            if (fieldData instanceof Array) {
                fieldData = await async_1.default.map(fieldData, async (data) => (0, exports.targetFromFirestore)(fieldOptions, data, whereInput, parentIds));
            }
            else {
                fieldData = await (0, exports.targetFromFirestore)(fieldOptions, fieldData, whereInput, parentIds);
            }
        }
        if (type === "Relation") {
            const { target } = fieldOptions;
            fieldData = await (0, relation_1.relationFromFirestore)(fieldData, target, whereFieldsInput);
        }
        return Object.assign(Object.assign({}, acc), { [fieldName]: fieldData });
    }, {});
};
exports.targetFromFirestore = targetFromFirestore;
