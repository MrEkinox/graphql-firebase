"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMutations = void 0;
const nexus_1 = require("nexus");
const firebase_admin_1 = require("firebase-admin");
const converter_1 = require("../converter");
const utils_1 = require("../utils");
const collection_1 = require("../converter/collection");
const getCreateMutation = (collection, parentLabelIds = []) => {
    const parentIdArgs = (0, utils_1.getParentLabelValues)(parentLabelIds, () => (0, nexus_1.idArg)({ required: true }));
    return (0, nexus_1.mutationField)(`create${collection.name}`, {
        deprecation: collection.deprecation,
        authorize: collection.authorize,
        description: collection.description,
        // @ts-ignore
        type: collection.name,
        args: Object.assign(Object.assign({}, parentIdArgs), { input: (0, nexus_1.arg)({ type: `Create${collection.name}Input`, required: true }) }),
        resolve: async (_, _a) => {
            var _b;
            var { input } = _a, idsValue = __rest(_a, ["input"]);
            const ids = parentLabelIds.map((label) => idsValue[label]);
            await ((_b = collection.beforeCreate) === null || _b === void 0 ? void 0 : _b.call(collection, input, ids));
            const parentIdsValue = (0, utils_1.getParentLabelValues)(parentLabelIds, (_, index) => ids[index]);
            const target = (0, utils_1.getTarget)(collection.name);
            const targetCollection = (0, utils_1.getTargetCollection)(collection.name, ids);
            const targetRef = targetCollection.doc();
            const batch = (0, firebase_admin_1.firestore)().batch();
            const convertedData = await (0, converter_1.targetToFirestore)(target, input, batch, targetRef);
            batch.set(targetRef, Object.assign({ id: targetRef.id, createdAt: new Date(), updatedAt: new Date() }, convertedData));
            await batch.commit();
            const snapshot = await targetRef.get();
            return (0, collection_1.collectionTargetFromFirestore)(snapshot, target, undefined, parentIdsValue);
        },
    });
};
const getUpdateMutation = (collection, parentLabelIds = []) => {
    const parentIdArgs = (0, utils_1.getParentLabelValues)(parentLabelIds, () => (0, nexus_1.idArg)({ required: true }));
    return (0, nexus_1.mutationField)(`update${collection.name}`, {
        deprecation: collection.deprecation,
        authorize: collection.authorize,
        description: collection.description,
        // @ts-ignore
        type: collection.name,
        args: Object.assign(Object.assign({}, parentIdArgs), { input: (0, nexus_1.arg)({ type: `Update${collection.name}Input`, required: true }), force: (0, nexus_1.booleanArg)() }),
        resolve: async (_, _a) => {
            var _b;
            var { input, force } = _a, idsValue = __rest(_a, ["input", "force"]);
            const ids = parentLabelIds.map((label) => idsValue[label]);
            await ((_b = collection.beforeUpdate) === null || _b === void 0 ? void 0 : _b.call(collection, input.id, input.fields, ids));
            const parentIdsValue = (0, utils_1.getParentLabelValues)(parentLabelIds, (_, index) => ids[index]);
            const target = (0, utils_1.getTarget)(collection.name);
            const targetCollection = (0, utils_1.getTargetCollection)(collection.name, ids);
            const targetRef = targetCollection.doc(input.id);
            const firstSnapshot = await targetRef.get();
            if (!firstSnapshot.exists && !force) {
                throw new Error("Object not found");
            }
            const batch = (0, firebase_admin_1.firestore)().batch();
            const convertedData = await (0, converter_1.targetToFirestore)(target, input.fields, batch, targetRef, firstSnapshot);
            batch.set(targetRef, Object.assign(Object.assign({ id: targetRef.id, createdAt: new Date() }, convertedData), { updatedAt: new Date() }), { merge: true });
            await batch.commit();
            const lastSnapshot = await targetRef.get();
            return (0, collection_1.collectionTargetFromFirestore)(lastSnapshot, target, undefined, parentIdsValue);
        },
    });
};
const getDeleteMutation = (collection, parentLabelIds = []) => {
    const parentIdArgs = (0, utils_1.getParentLabelValues)(parentLabelIds, () => (0, nexus_1.idArg)({ required: true }));
    return (0, nexus_1.mutationField)(`delete${collection.name}`, {
        deprecation: collection.deprecation,
        authorize: collection.authorize,
        description: collection.description,
        type: "Boolean",
        args: Object.assign(Object.assign({}, parentIdArgs), { input: (0, nexus_1.arg)({ type: `Delete${collection.name}Input`, required: true }) }),
        resolve: async (_, _a) => {
            var _b;
            var { input } = _a, idsValue = __rest(_a, ["input"]);
            const ids = parentLabelIds.map((label) => idsValue[label]);
            await ((_b = collection.beforeDelete) === null || _b === void 0 ? void 0 : _b.call(collection, input.id, ids));
            const targetCollection = (0, utils_1.getTargetCollection)(collection.name, ids);
            const targetRef = targetCollection.doc(input.id);
            await targetRef.delete();
            return true;
        },
    });
};
const getMutations = (collection, parentIds = []) => {
    const createMutation = getCreateMutation(collection, parentIds);
    const updateMutation = getUpdateMutation(collection, parentIds);
    const deleteMutation = getDeleteMutation(collection, parentIds);
    return { createMutation, updateMutation, deleteMutation };
};
exports.getMutations = getMutations;
