"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionFromFirestore = exports.collectionTargetFromFirestore = exports.collectionWhereFromFirestore = exports.collectionToFirestore = void 0;
const utils_1 = require("../../utils");
const async_1 = __importDefault(require("async"));
const __1 = require("..");
const where_1 = require("../../where");
const orderBy_1 = require("../../orderBy");
const graphql_fields_list_1 = require("graphql-fields-list");
const collectionToFirestore = async (input, targetName, batch, parentRef) => {
    const target = (0, utils_1.getTarget)(targetName);
    const collectionName = (0, utils_1.getCollectionName)(targetName, target.parent);
    const collectionRef = parentRef.collection(collectionName);
    await async_1.default.map((input === null || input === void 0 ? void 0 : input.createAndAdd) || [], async (data2) => {
        const docRef = collectionRef.doc();
        const data = await (0, __1.targetToFirestore)(target, data2, batch, docRef);
        batch.set(docRef, Object.assign(Object.assign({}, data), { id: docRef.id, createdAt: new Date(), updatedAt: new Date() }));
        return docRef;
    });
    await async_1.default.map((input === null || input === void 0 ? void 0 : input.update) || [], async (data2) => {
        const docRef = collectionRef.doc(data2.id);
        const snapshot = await docRef.get();
        const data = await (0, __1.targetToFirestore)(target, data2.fields, batch, docRef, snapshot);
        batch.update(docRef, Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
        return docRef;
    });
    await async_1.default.map((input === null || input === void 0 ? void 0 : input.delete) || [], async (id) => {
        const docRef = collectionRef.doc(id);
        batch.delete(docRef);
        return docRef;
    });
};
exports.collectionToFirestore = collectionToFirestore;
const collectionWhereFromFirestore = async (targetName, parentIds, whereInput) => {
    const target = (0, utils_1.getTarget)(targetName);
    const ids = Object.values(parentIds);
    const collection = (0, utils_1.getTargetCollection)(targetName, ids);
    const ref = (0, where_1.whereCollection)(target, collection, whereInput);
    const documents = await ref.get();
    if (whereInput && !documents.size)
        throw new Error("no where");
    const loop = await async_1.default.map(documents.docs, async (doc) => {
        return (0, utils_1.AsyncObjectReduce)(target.fields, async (_, fieldName, fieldOptions) => {
            try {
                const whereFieldInput = whereInput[fieldName];
                if (whereFieldInput && fieldOptions.type === "Collection") {
                    await (0, exports.collectionWhereFromFirestore)(fieldOptions.target, Object.assign(Object.assign({}, parentIds), { [targetName]: doc.id }), whereFieldInput);
                }
                return true;
            }
            catch (error) {
                return false;
            }
        });
    });
    const exist = loop.some((l) => l);
    if (!exist)
        throw new Error("no where");
};
exports.collectionWhereFromFirestore = collectionWhereFromFirestore;
const collectionTargetFromFirestore = async (snapshot, collection, whereInput, parentIds = {}) => {
    const currentData = snapshot.data();
    const convertedData = await (0, __1.targetFromFirestore)(collection, currentData, whereInput, parentIds);
    if (whereInput) {
        const whereResult = await (0, where_1.whereFilterEquality)(whereInput, currentData);
        if (!whereResult)
            throw new Error("no where");
    }
    return Object.assign(Object.assign({}, convertedData), parentIds);
};
exports.collectionTargetFromFirestore = collectionTargetFromFirestore;
const collectionFromFirestore = async (targetName, input, whereInput, orderByInput, root, info) => {
    const target = (0, utils_1.getTarget)(targetName);
    const parentLabelIds = (0, utils_1.getParentIds)(target.parent);
    const ids = parentLabelIds.reduce((acc, id) => input[id] || root[id] ? [input[id] || root[id], ...acc] : acc, root ? [root.id] : []);
    const parentIdsValue = (0, utils_1.getParentLabelValues)(parentLabelIds, (_, index) => ids[index]);
    const collection = (0, utils_1.getTargetCollection)(targetName, ids);
    const listDocuments = await collection.listDocuments();
    const count = listDocuments.length;
    let ref = (0, where_1.whereCollection)(target, collection, whereInput);
    if (orderByInput) {
        ref = (0, orderBy_1.orderByCollection)(collection, orderByInput);
    }
    if (input.limit) {
        ref = ref.limit(input.limit);
    }
    if (input.offset) {
        ref = ref.offset(input.offset);
    }
    if (info) {
        const fields = (0, graphql_fields_list_1.fieldsList)(info, { path: "edges.node" });
        ref = ref.select(...fields);
    }
    const documents = await ref.get();
    const edges = await async_1.default.reduce(documents.docs, [], async (acc, doc) => {
        try {
            const node = await (0, exports.collectionTargetFromFirestore)(doc, target, whereInput, Object.assign({ id: doc.id }, parentIdsValue));
            // @ts-ignore
            return [...acc, { cursor: doc.id, node }];
        }
        catch (error) {
            return acc;
        }
    });
    return { count, edges };
};
exports.collectionFromFirestore = collectionFromFirestore;
