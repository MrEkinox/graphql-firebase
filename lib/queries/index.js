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
exports.getQueries = void 0;
const nexus_1 = require("nexus");
const utils_1 = require("../utils");
const collection_1 = require("../converter/collection");
const getQuery = (collection) => {
    const parentLabelIds = (0, utils_1.getParentIds)(collection.parent);
    const parentIdArgs = (0, utils_1.getParentLabelValues)(parentLabelIds, () => (0, nexus_1.idArg)({ required: true }));
    return (0, nexus_1.queryField)((0, utils_1.firstLowercase)(collection.name), {
        deprecation: collection.deprecation,
        authorize: collection.authorize,
        description: collection.description,
        // @ts-ignore
        type: collection.name,
        args: Object.assign(Object.assign({}, parentIdArgs), { id: (0, nexus_1.idArg)({ required: true }) }),
        resolve: async (_, _a) => {
            var { id } = _a, input = __rest(_a, ["id"]);
            const ids = parentLabelIds.map((label) => input[label]);
            const parentIdsValue = (0, utils_1.getParentLabelValues)(parentLabelIds, (_, index) => ids[index]);
            const target = (0, utils_1.getTarget)(collection.name);
            const targetCollection = (0, utils_1.getTargetCollection)(collection.name, ids);
            const targetRef = targetCollection.doc(id);
            const document = await targetRef.get();
            if (!document.exists) {
                throw new Error(`${collection.name} not found`);
            }
            return (0, collection_1.collectionTargetFromFirestore)(document, target, undefined, parentIdsValue);
        },
    });
};
const getAllQuery = (collection) => {
    const { parent } = (0, utils_1.getTarget)(collection.name);
    const parentLabelIds = (0, utils_1.getParentIds)(parent);
    const parentIdArgs = (0, utils_1.getParentLabelValues)(parentLabelIds, () => (0, nexus_1.idArg)({ required: true }));
    return (0, nexus_1.queryField)((t) => {
        t.connectionField((0, utils_1.plural)(collection.name), {
            deprecation: collection.deprecation,
            authorize: collection.authorize,
            description: collection.description,
            // @ts-ignore
            type: collection.name,
            additionalArgs: Object.assign(Object.assign({}, parentIdArgs), { limit: (0, nexus_1.arg)({ type: "Int" }), offset: (0, nexus_1.arg)({ type: "Int" }), where: (0, nexus_1.arg)({ type: `${collection.name}WhereInput` }), orderBy: (0, nexus_1.arg)({ type: `${collection.name}OrderByInput` }) }),
            resolve: async (root, _a, ctx, info) => {
                var { where, orderBy } = _a, input = __rest(_a, ["where", "orderBy"]);
                return (0, collection_1.collectionFromFirestore)(collection.name, input, where, orderBy, root, info);
            },
        });
    });
};
const getQueries = (collection) => {
    const query = getQuery(collection);
    const allQuery = getAllQuery(collection);
    return { query, allQuery };
};
exports.getQueries = getQueries;
