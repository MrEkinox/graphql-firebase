"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referenceResolver = void 0;
const firebase_admin_1 = require("firebase-admin");
const graphql_fields_list_1 = require("graphql-fields-list");
const referenceResolver = async (fieldName, isList, src, info) => {
    const fields = (0, graphql_fields_list_1.fieldsList)(info);
    const isOnlyId = fields.length === 1 && fields[0] === "id";
    if (isList) {
        const refs = src[fieldName];
        if (refs instanceof (Array)) {
            if (refs === null || refs === void 0 ? void 0 : refs.length) {
                if (isOnlyId) {
                    return refs.map((ref) => ref.id);
                }
                const snapshot = await (0, firebase_admin_1.firestore)().getAll(...refs);
                return snapshot.map((doc) => doc.data());
            }
        }
        return refs;
    }
    const ref = src[fieldName];
    if (ref instanceof firebase_admin_1.firestore.DocumentReference) {
        if (isOnlyId)
            return ref.id;
        const snapshot = await ref.get();
        return snapshot.data();
    }
    return ref;
};
exports.referenceResolver = referenceResolver;
