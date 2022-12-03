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
exports.collectionResolver = void 0;
const graphql_fields_list_1 = require("graphql-fields-list");
const mutations_1 = require("../mutations");
const utils_1 = require("../utils");
const where_1 = require("../where");
const collectionResolver = async (type, parents, src, _a, info) => {
    var { where, limit, offset } = _a, input = __rest(_a, ["where", "limit", "offset"]);
    const parentId = src && Object.assign(Object.assign({}, src), { [`${(0, utils_1.firstLowercase)(info.parentType.name)}Id`]: src.id });
    const parentIds = (0, mutations_1.getParentIds)(parents, Object.assign(Object.assign({}, input), parentId));
    let collection = (0, mutations_1.getCollection)(type, parentIds);
    const fields = (0, graphql_fields_list_1.fieldsList)(info, { path: "edges.node" });
    if (fields.length)
        collection = collection.select(...fields);
    if (where) {
        const whereCollection = new where_1.WhereCollection(info.schema);
        const whereInput = whereCollection.getWhereInput(type, where, type);
        const firstWhere = whereInput[0];
        if ((firstWhere === null || firstWhere === void 0 ? void 0 : firstWhere.name) === type) {
            collection = whereCollection.whereCollection(firstWhere, collection);
            whereInput.shift();
        }
        if (whereInput.length) {
            return whereCollection.get(whereInput, collection);
        }
    }
    if (typeof limit === "number") {
        collection = collection.limit(limit);
    }
    if (typeof offset === "number") {
        collection = collection.offset(offset);
    }
    const count = (await collection.count().get()).data().count;
    const data = await collection.get();
    const edges = data.docs.map((doc) => ({
        node: Object.assign(Object.assign({ id: doc.id }, parentId), doc.data()),
    }));
    return { count, edges };
};
exports.collectionResolver = collectionResolver;
