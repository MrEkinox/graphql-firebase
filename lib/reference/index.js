"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceResolver = void 0;
const firebase_admin_1 = require("firebase-admin");
const graphql_fields_list_1 = require("graphql-fields-list");
const mutations_1 = require("../mutations");
const referenceResolver = async (target, isList, src, info) => {
    const fields = (0, graphql_fields_list_1.fieldsList)(info);
    const isOnlyId = fields.length === 1 && fields[0] === "id";
    const parents = (0, mutations_1.getParents)(target, [], info.schema);
    const collection = (0, mutations_1.getCollection)(parents);
    if (isList) {
        const refs = src[info.fieldName];
        if (refs === null || refs === void 0 ? void 0 : refs.length) {
            if (isOnlyId) {
                return refs.map((ref) => ({ id: ref.id }));
            }
            const collectionRefs = refs.map((ref) => collection.doc(ref.id));
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
    const snapshot = await collection.doc(ref.id).get();
    return snapshot.data();
};
exports.referenceResolver = referenceResolver;
