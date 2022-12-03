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
exports.getDeleteMutation = exports.getUpdateMutation = exports.getCreateMutation = exports.getParentIds = exports.getCollection = void 0;
const firebase_admin_1 = require("firebase-admin");
const nexus_1 = require("nexus");
const converter_1 = require("../converter");
const inputs_1 = require("../inputs");
const utils_1 = require("../utils");
const getCollection = (name, parentIds) => {
    const pluralName = (0, utils_1.plural)(name);
    const ref = (0, firebase_admin_1.firestore)().collection(pluralName);
    if (!(parentIds === null || parentIds === void 0 ? void 0 : parentIds.length))
        return ref;
    const lastParent = parentIds.pop();
    if (!lastParent) {
        throw new Error(`no id found for ${name}`);
    }
    const parentCollection = (0, exports.getCollection)(lastParent.name, parentIds);
    return parentCollection.doc(lastParent.id).collection(pluralName);
};
exports.getCollection = getCollection;
const getParentIds = (parents, input) => parents === null || parents === void 0 ? void 0 : parents.map((parent) => ({
    name: parent,
    id: input === null || input === void 0 ? void 0 : input[(0, utils_1.firstLowercase)(`${parent}Id`)],
}));
exports.getParentIds = getParentIds;
const getCreateMutation = (options) => {
    const { name } = options, field = __rest(options, ["name"]);
    const createInput = (0, inputs_1.getCreateInput)(options);
    const parentIds = (0, utils_1.getParentIdLabel)(options.parents);
    const idsArgs = parentIds === null || parentIds === void 0 ? void 0 : parentIds.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: (0, nexus_1.idArg)({ required: true }) })), {});
    return (0, nexus_1.mutationField)(`create${name}`, Object.assign(Object.assign({}, field), { 
        // @ts-ignore
        type: name, args: Object.assign(Object.assign({}, idsArgs), { input: (0, nexus_1.arg)({ type: createInput, required: true }) }), resolve: async (src, _a, ctx, info) => {
            var { input } = _a, ids = __rest(_a, ["input"]);
            const parentIds = (0, exports.getParentIds)(options.parents, ids);
            const collection = (0, exports.getCollection)(name, parentIds);
            const ref = collection.doc();
            const batch = (0, firebase_admin_1.firestore)().batch();
            const converter = new converter_1.Converter(info.schema, batch);
            const newData = await converter.toFirebase(name, input, ref);
            batch.set(ref, newData);
            await batch.commit();
            const snapshot = await ref.get();
            return snapshot.data();
        } }));
};
exports.getCreateMutation = getCreateMutation;
const getUpdateMutation = (options) => {
    const { name } = options, field = __rest(options, ["name"]);
    const updateInput = (0, inputs_1.getUpdateInput)(options);
    const parentIds = (0, utils_1.getParentIdLabel)(options.parents);
    const idsArgs = parentIds === null || parentIds === void 0 ? void 0 : parentIds.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: (0, nexus_1.idArg)({ required: true }) })), {});
    return (0, nexus_1.mutationField)(`update${name}`, Object.assign(Object.assign({}, field), { 
        // @ts-ignore
        type: name, args: Object.assign(Object.assign({}, idsArgs), { input: (0, nexus_1.arg)({ type: updateInput, required: true }), force: (0, nexus_1.booleanArg)() }), resolve: async (src, _a, ctx, info) => {
            var { force, input: { id, fields } } = _a, ids = __rest(_a, ["force", "input"]);
            const parentIds = (0, exports.getParentIds)(options.parents, ids);
            const collection = (0, exports.getCollection)(name, parentIds);
            const ref = collection.doc(id);
            const batch = (0, firebase_admin_1.firestore)().batch();
            const snapshot = await ref.get();
            if (!snapshot.exists && !force) {
                throw new Error("Object not found");
            }
            const converter = new converter_1.Converter(info.schema, batch);
            const newData = await converter.toFirebase(name, fields, ref, snapshot);
            batch.set(ref, newData, { merge: true });
            await batch.commit();
            const newSnapshot = await ref.get();
            return newSnapshot.data();
        } }));
};
exports.getUpdateMutation = getUpdateMutation;
const getDeleteMutation = (options) => {
    const { name } = options, field = __rest(options, ["name"]);
    const parentIds = (0, utils_1.getParentIdLabel)(options.parents);
    const idsArgs = parentIds === null || parentIds === void 0 ? void 0 : parentIds.reduce((acc, cur) => (Object.assign(Object.assign({}, acc), { [cur]: (0, nexus_1.idArg)({ required: true }) })), {});
    const deleteInput = (0, inputs_1.getDeleteInput)(name);
    return (0, nexus_1.mutationField)(`delete${name}`, Object.assign(Object.assign({}, field), { type: "Boolean", args: Object.assign(Object.assign({}, idsArgs), { input: (0, nexus_1.arg)({ type: deleteInput, required: true }) }), resolve: async (_, _a) => {
            var { input } = _a, ids = __rest(_a, ["input"]);
            const parentIds = (0, exports.getParentIds)(options.parents, ids);
            const collection = (0, exports.getCollection)(name, parentIds);
            const targetRef = collection.doc(input.id);
            await targetRef.delete();
            return true;
        } }));
};
exports.getDeleteMutation = getDeleteMutation;
