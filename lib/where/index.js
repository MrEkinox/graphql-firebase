"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereCollection = exports.sortOrderBy = exports.computeDate = void 0;
const firebase_admin_1 = require("firebase-admin");
const firestore_1 = require("firebase-admin/firestore");
const mutations_1 = require("../mutations");
const chunk_1 = __importDefault(require("lodash/chunk"));
const utils_1 = require("../utils");
const scalars_1 = require("../scalars");
const getWhereType = (type) => {
    switch (type) {
        case "equalTo":
            return "==";
        case "notEqualTo":
            return "!=";
        case "lessThan":
            return "<";
        case "lessThanOrEqualTo":
            return "<=";
        case "greaterThan":
            return ">";
        case "greaterThanOrEqualTo":
            return ">=";
        case "in":
            return "in";
        case "notIn":
            return "not-in";
        case "arrayContains":
            return "array-contains";
    }
    return undefined;
};
const computeDate = (value) => {
    if (value instanceof firestore_1.Timestamp)
        return value.toMillis();
    return value;
};
exports.computeDate = computeDate;
const sortOrderBy = (edges, orderBy = { createdAt: scalars_1.OrderByEnum.desc }) => {
    return edges.sort((a, b) => {
        return Object.keys(orderBy).reduce((acc, fieldName) => {
            var _a, _b;
            const direction = orderBy[fieldName];
            const valueA = (0, exports.computeDate)((_a = a === null || a === void 0 ? void 0 : a.node) === null || _a === void 0 ? void 0 : _a[fieldName]);
            const valueAB = (0, exports.computeDate)((_b = b === null || b === void 0 ? void 0 : b.node) === null || _b === void 0 ? void 0 : _b[fieldName]);
            if (direction === scalars_1.OrderByEnum.desc) {
                return valueA > valueAB ? -1 : 1;
            }
            return valueA < valueAB ? -1 : 1;
        }, 0);
    });
};
exports.sortOrderBy = sortOrderBy;
class WhereCollection {
    constructor(schema, parentsIds, orderBy) {
        this.getWhereInput = (type, input, parentFieldName, fieldName) => {
            const fields = (0, utils_1.getSchemaFields)(type, this.schema);
            const newInput = this.removeCollectionFields(type, input, fieldName, parentFieldName);
            return fields.reduce((acc, field) => {
                const fieldInput = input === null || input === void 0 ? void 0 : input[field.name];
                if (field.type === "Collection" && field.target && fieldInput) {
                    const newParent = newInput ? fieldName : parentFieldName;
                    const inField = this.getWhereInput(field.target, fieldInput, newParent, field.name);
                    return [...acc, ...inField];
                }
                return acc;
            }, newInput ? [newInput] : []);
        };
        this.whereReferenceId = (field, input, collection) => {
            const whereField = Object.keys(input).at(0);
            const whereOperator = getWhereType(whereField);
            const whereID = whereField && input[whereField];
            if (!whereField || !whereOperator || !field.target || !whereID)
                return collection;
            const parents = (0, mutations_1.getParents)(field.target, [], this.schema);
            const targetCollection = (0, mutations_1.getCollection)(parents);
            if (whereField === "in" && whereID instanceof Array) {
                const targetDocs = whereID.map((id) => targetCollection.doc(id));
                return collection.where(field.name, "in", targetDocs);
            }
            const targetDoc = targetCollection.doc(whereID);
            return collection.where(field.name, whereOperator, targetDoc);
        };
        this.whereReferenceListId = (field, input, collection) => {
            const whereField = Object.keys(input).at(0);
            const whereOperator = getWhereType(whereField);
            const whereID = whereField && input[whereField];
            if (!whereField || !whereOperator || !field.target || !whereID)
                return collection;
            const parents = (0, mutations_1.getParents)(field.target, [], this.schema);
            const targetCollection = (0, mutations_1.getCollection)(parents);
            if (whereField === "in" && whereID instanceof Array) {
                const targetDocs = whereID.map((id) => targetCollection.doc(id));
                const isIn = Array.from(targetDocs).reverse();
                return collection.where(field.name, "in", [targetDocs, isIn]);
            }
            const targetDoc = targetCollection.doc(whereID);
            if (whereField === "equalTo") {
                return collection.where(field.name, "array-contains", targetDoc);
            }
            return collection;
        };
        this.whereObject = (parentName, fieldName, input, collection) => {
            return Object.keys(input).reduce((acc, operator) => {
                const inputValue = input[operator];
                const field = `${parentName}.${fieldName}`;
                if (typeof inputValue === "undefined")
                    return acc;
                if (inputValue instanceof Array) {
                    if (!inputValue.length)
                        return acc;
                }
                else if (inputValue && typeof inputValue === "object") {
                    return this.whereObject(field, operator, inputValue, acc);
                }
                if (operator === "exists") {
                    return acc.where(field, inputValue ? "!=" : "==", null);
                }
                const whereOperator = getWhereType(operator);
                if (!whereOperator)
                    return acc;
                return acc.where(field, whereOperator, inputValue);
            }, collection);
        };
        this.whereFieldCollection = (field, collection, input) => {
            return Object.keys(input).reduce((acc, operator) => {
                const inputValue = input[operator];
                if (typeof inputValue === "undefined")
                    return acc;
                if (operator === "exists") {
                    return acc.where(field.name, inputValue ? "!=" : "==", null);
                }
                if (field.type === "Object" || field.type === "Any") {
                    return this.whereObject(field.name, operator, inputValue, acc);
                }
                if (field.type === "Reference" && operator === "id") {
                    return this.whereReferenceId(field, inputValue, acc);
                }
                if (field.type === "ReferenceList" && operator === "id") {
                    return this.whereReferenceListId(field, inputValue, acc);
                }
                const whereOperator = getWhereType(operator);
                if (!whereOperator)
                    return acc;
                return acc.where(field.name, whereOperator, inputValue);
            }, collection);
        };
        this.whereCollection = (whereInput, collection) => {
            const fields = (0, utils_1.getSchemaFields)(whereInput.name, this.schema);
            return fields.reduce((acc, field) => {
                var _a;
                const fieldInput = (_a = whereInput.input) === null || _a === void 0 ? void 0 : _a[field.name];
                if (!fieldInput)
                    return acc;
                if (field.type === "Collection")
                    return acc;
                return this.whereFieldCollection(field, acc, fieldInput);
            }, collection);
        };
        this.schema = schema;
        this.parentsIds = parentsIds;
        this.orderBy = orderBy;
    }
    async chunkQuery(collection, ids) {
        const chunkIds = (0, chunk_1.default)(ids, 10);
        const allData = await Promise.all(chunkIds.map(async (id) => {
            const newCollection = collection.where("id", "in", id);
            return this.getData(newCollection);
        }));
        const concatValue = allData.reduce((acc, cur) => {
            const newCount = acc.count + cur.count;
            const newEdges = [...cur.edges, ...acc.edges];
            return { count: newCount, edges: newEdges };
        }, { count: 0, edges: [] });
        return {
            count: concatValue.count,
            edges: (0, exports.sortOrderBy)(concatValue.edges, this.orderBy),
        };
    }
    async getData(collection) {
        const count = (await collection.count().get()).data().count;
        const data = await collection.get();
        const edges = (0, exports.sortOrderBy)(data.docs.map((doc) => ({
            node: Object.assign(Object.assign({ id: doc.id }, this.parentsIds), doc.data()),
        })), this.orderBy);
        return { count, edges };
    }
    async get(whereInput, collection) {
        const ids = await this.getCollectionWhere(whereInput);
        if (ids.length) {
            if (ids.length <= 10) {
                const newCollection = collection.where("id", "in", ids);
                return this.getData(newCollection);
            }
            return this.chunkQuery(collection, ids);
        }
        return { count: 0, edges: [] };
    }
    removeCollectionFields(name, input, fieldName, parentFieldName) {
        const fields = (0, utils_1.getSchemaFields)(name, this.schema);
        const newFields = fields.reduce((acc, field) => {
            const fieldInput = input === null || input === void 0 ? void 0 : input[field.name];
            if (!fieldInput)
                return acc;
            if (field.type === "Collection" && field.target) {
                return acc;
            }
            return Object.assign(Object.assign({}, acc), { [field.name]: fieldInput });
        }, {});
        if (Object.keys(newFields).length) {
            return {
                name,
                input: newFields,
                parentFieldName,
                fieldName: fieldName || (0, utils_1.plural)(name),
            };
        }
        return undefined;
    }
    async getCollectionWhere(whereInput, ids = []) {
        const where = whereInput.shift();
        if (!where)
            return ids;
        const collectionGroup = (0, firebase_admin_1.firestore)().collectionGroup(where.fieldName);
        let collection = this.whereCollection(where, collectionGroup);
        if (ids.length) {
            collection = collection.where("id", "in", ids);
        }
        const snapshot = await collection.get();
        const snapIds = snapshot.docs.map((doc) => {
            const path = doc.ref.path.split("/");
            const index = where.parentFieldName
                ? path.indexOf(where.parentFieldName)
                : path.indexOf(where.fieldName);
            return path.at(index + 1) || "";
        });
        if (snapIds.length) {
            const newIds = [...ids, ...snapIds].reduce((acc, id) => {
                if (acc.find((id2) => id2 === id))
                    return acc;
                return [...acc, id];
            }, []);
            return this.getCollectionWhere(whereInput, newIds);
        }
        return ids;
    }
}
exports.WhereCollection = WhereCollection;
