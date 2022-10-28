"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationFromFirestore = exports.relationToFirestore = void 0;
const __1 = require("..");
const async_1 = __importDefault(require("async"));
const utils_1 = require("../../utils");
const where_1 = require("../../where");
const collection_1 = require("../collection");
const relationToFirestore = async (input, targetName, batch, currentData = []) => {
    const target = (0, utils_1.getTarget)(targetName);
    const targetCollection = (0, utils_1.getTargetCollection)(targetName, []);
    const created = await async_1.default.map(input.createAndAdd || [], async (data2) => {
        const targetRef = targetCollection.doc();
        const data = await (0, __1.targetToFirestore)(target, data2, batch, targetRef);
        batch.set(targetRef, Object.assign(Object.assign({}, data), { id: targetRef.id, createdAt: new Date(), updatedAt: new Date() }));
        return targetRef;
    });
    const addRef = (input.add || []).map((id) => targetCollection.doc(id));
    return [...currentData, ...addRef, ...created].filter((newData) => { var _a; return !((_a = input.remove) === null || _a === void 0 ? void 0 : _a.includes(newData.id)); });
};
exports.relationToFirestore = relationToFirestore;
const relationFromFirestore = async (refs, targetName, whereInput) => {
    if (!refs.length) {
        if (whereInput)
            throw new Error("no where");
        return [];
    }
    const target = (0, utils_1.getTarget)(targetName);
    const targetCollection = (0, utils_1.getTargetCollection)(targetName, []);
    if (whereInput) {
        const collection = (0, where_1.whereCollection)(target, targetCollection, whereInput, true).where("__name__", "in", refs);
        const documents = await collection.count().get();
        if (!documents.data().count)
            throw new Error("no where");
    }
    const collection = targetCollection.where("__name__", "in", refs);
    const documents = await collection.get();
    return async_1.default.map(documents.docs, async (doc) => (0, collection_1.collectionTargetFromFirestore)(doc, target));
};
exports.relationFromFirestore = relationFromFirestore;
