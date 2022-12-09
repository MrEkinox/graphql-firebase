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
const mutations_1 = require("../mutations");
const utils_1 = require("../utils");
const where_1 = require("../where");
const collectionResolver = async (type, fieldName, parents, src, _a, info) => {
    var _b;
    var { where, limit, offset } = _a, input = __rest(_a, ["where", "limit", "offset"]);
    const allInputs = Object.assign(Object.assign({}, input), (src && Object.assign(Object.assign({}, src), { [`${(0, utils_1.firstLowercase)(info.parentType.name)}Id`]: src.id })));
    const parentFields = (0, mutations_1.getParents)(type, parents, info.schema, allInputs);
    const parentsIds = (0, mutations_1.getParentIds)(parentFields);
    let collection = (0, mutations_1.getCollection)(parentFields);
    if (where) {
        const whereCollection = new where_1.WhereCollection(info.schema, parentsIds);
        const whereInput = whereCollection.getWhereInput(type, where, parentFields[0].fieldName || fieldName, (_b = parentFields.pop()) === null || _b === void 0 ? void 0 : _b.fieldName);
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
    const edges = (0, where_1.orderByCreatedAt)(data.docs.map((doc) => ({
        node: Object.assign(Object.assign({ id: doc.id }, parentsIds), doc.data()),
    })));
    return { count, edges };
};
exports.collectionResolver = collectionResolver;
