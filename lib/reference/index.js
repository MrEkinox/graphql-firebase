"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceResolver = void 0;
const firebase_admin_1 = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const mutations_1 = require("../mutations");
const utils_1 = require("../utils");
const getRefCollection = (type, ref, schema) => {
    if (ref instanceof firestore_1.DocumentReference)
        return ref;
    const parents = (0, mutations_1.getParents)(type, [], schema);
    const collection = (0, mutations_1.getCollection)(parents);
    return collection.doc(ref.id);
};
const referenceResolver = async (type, isList, src, info) => {
    const isOnlyId = (0, utils_1.isOnlyIdField)(info);
    if (isList) {
        const refs = src[info.fieldName];
        if (refs === null || refs === void 0 ? void 0 : refs.length) {
            if (isOnlyId) {
                return refs.map((ref) => ({ id: ref.id }));
            }
            const collectionRefs = refs.map((ref) => getRefCollection(type, ref, info.schema));
            const snapshot = await (0, firebase_admin_1.firestore)().getAll(...collectionRefs);
            return snapshot.map((doc) => doc.data());
        }
        return [];
    }
    const ref = src[info.fieldName];
    if (!ref)
        return null;
    if (isOnlyId)
        return { id: ref.id };
    const snapshot = await getRefCollection(type, ref, info.schema).get();
    return snapshot.data();
};
exports.referenceResolver = referenceResolver;
