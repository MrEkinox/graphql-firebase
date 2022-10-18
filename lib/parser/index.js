"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCollections = void 0;
const utils_1 = require("../utils");
const defaultFields = {
    id: { type: "ID", required: true },
    createdAt: { type: "Date", required: true },
    updatedAt: { type: "Date", required: true },
};
const parseCollection = (collection, parent) => {
    const parentName = parent ? parent + collection.name : collection.name;
    const fields = (0, utils_1.ObjectReduce)(collection.fields, (acc, key, value) => {
        if (value.type === "Collection") {
            const target = parentName + value.name;
            return Object.assign(Object.assign({}, acc), { [key]: { type: "Collection", target } });
        }
        return Object.assign(Object.assign({}, acc), { [key]: value });
    });
    return Object.assign(Object.assign({ parent }, collection), { name: parentName, fields: Object.assign(Object.assign({}, defaultFields), fields) });
};
const parseCollectionInCollection = (collection, parent) => {
    return (0, utils_1.ObjectReduce)(collection.fields, (acc, key, value) => {
        if (value.type === "Collection") {
            const parentName = parent || collection.name;
            const name = parentName + value.name;
            const inCollection = parseCollectionInCollection(value, name);
            const parsedCollection = parseCollection(value, parentName);
            return Object.assign(Object.assign(Object.assign({}, acc), inCollection), { [name]: parsedCollection });
        }
        return acc;
    });
};
const parseCollections = (collections) => {
    return collections.reduce((acc, collection) => {
        const { name } = collection;
        const inCollection = parseCollectionInCollection(collection);
        const parsedCollection = parseCollection(collection);
        return Object.assign(Object.assign(Object.assign({}, acc), inCollection), { [name]: parsedCollection });
    }, {});
};
exports.parseCollections = parseCollections;
