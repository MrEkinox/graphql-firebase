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
exports.getAllQuery = exports.getQuery = void 0;
const nexus_1 = require("nexus");
const mutations_1 = require("../mutations");
const utils_1 = require("../utils");
const getQuery = (_a) => {
    var { name } = _a, options = __rest(_a, ["name"]);
    const parentIds = (0, utils_1.getParentIdLabel)(options.parents);
    const parentIdArgs = parentIds === null || parentIds === void 0 ? void 0 : parentIds.reduce((acc, id) => (Object.assign(Object.assign({}, acc), { [id]: (0, nexus_1.idArg)({ required: true }) })), {});
    return (0, nexus_1.queryField)((0, utils_1.firstLowercase)(name), Object.assign(Object.assign({}, options), { 
        // @ts-ignore
        type: name, args: Object.assign(Object.assign({}, parentIdArgs), { id: (0, nexus_1.idArg)({ required: true }) }), resolve: async (_, _a, ctx, info) => {
            var { id } = _a, input = __rest(_a, ["id"]);
            const parents = (0, mutations_1.getParents)(name, options.parents, info.schema, input);
            const parentsIds = (0, mutations_1.getParentIds)(parents);
            const collection = (0, mutations_1.getCollection)(parents);
            const ref = collection.doc(id);
            const snapshot = await ref.get();
            return Object.assign(Object.assign({}, snapshot.data()), parentsIds);
        } }));
};
exports.getQuery = getQuery;
const getAllQuery = (_a) => {
    var { name } = _a, options = __rest(_a, ["name"]);
    const parentIds = (0, utils_1.getParentIdLabel)(options.parents);
    const parentIdArgs = parentIds === null || parentIds === void 0 ? void 0 : parentIds.reduce((acc, id) => (Object.assign(Object.assign({}, acc), { [id]: (0, nexus_1.idArg)({ required: true }) })), {});
    return (0, nexus_1.queryField)((t) => {
        t.collection((0, utils_1.plural)(name), Object.assign(Object.assign({}, options), { 
            // @ts-ignore
            type: name, parents: options.parents, additionalArgs: parentIdArgs }));
    });
};
exports.getAllQuery = getAllQuery;
