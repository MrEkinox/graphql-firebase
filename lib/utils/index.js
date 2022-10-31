"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParentLabelValues = exports.getParentIds = exports.getTargetCollection = exports.getCollectionName = exports.getTarget = exports.plural = exports.firstLowercase = exports.capitalize = exports.AsyncObjectReduce = exports.ObjectEach = exports.ObjectSome = exports.ObjectMap = exports.ObjectReduce = exports.hasType = void 0;
const admin = __importStar(require("firebase-admin"));
const async_1 = __importDefault(require("async"));
const __1 = require("..");
const hasType = (typeName, values) => {
    return !!Object.keys(values).find((key) => {
        const value = values[key];
        return value.name === typeName;
    });
};
exports.hasType = hasType;
const ObjectReduce = (object, callback, initialValue = {}) => Object.keys(object).reduce((acc, key, index) => callback(acc, key, object[key], index), initialValue);
exports.ObjectReduce = ObjectReduce;
const ObjectMap = (object, callback) => Object.keys(object).map((key, index) => callback(key, object[key], index));
exports.ObjectMap = ObjectMap;
const ObjectSome = (object, callback) => Object.keys(object).some((key, index) => callback(key, object[key], index));
exports.ObjectSome = ObjectSome;
const ObjectEach = (object, callback) => Object.keys(object).forEach((key, index) => callback(key, object[key], index));
exports.ObjectEach = ObjectEach;
const AsyncObjectReduce = (object, callback, initialValue) => async_1.default.reduce(Object.keys(object), initialValue, async (acc, key) => callback(acc, key, object[key]));
exports.AsyncObjectReduce = AsyncObjectReduce;
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
const firstLowercase = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
exports.firstLowercase = firstLowercase;
const plural = (str) => {
    if (str.endsWith("y"))
        return str.charAt(0).toLowerCase() + str.substring(1, -1) + "ies";
    return str.charAt(0).toLowerCase() + str.slice(1) + "s";
};
exports.plural = plural;
const getTarget = (name) => {
    return __1.parsedCollections[name];
};
exports.getTarget = getTarget;
const getTargetName = (name, parent = "") => {
    return name.replace(parent, "");
};
const getCollectionName = (name, parent) => {
    const targetName = getTargetName(name, parent);
    return (0, exports.plural)(targetName);
};
exports.getCollectionName = getCollectionName;
const getTargetCollection = (name, ids) => {
    const target = (0, exports.getTarget)(name);
    const collectionName = (0, exports.getCollectionName)(name, target.parent);
    const ref = admin.firestore().collection(collectionName);
    if (target.parent) {
        const rightId = ids.pop();
        if (!rightId) {
            throw new Error(`no id found for ${target.parent}`);
        }
        const parentCollection = (0, exports.getTargetCollection)(target.parent, ids);
        return parentCollection.doc(rightId).collection(collectionName);
    }
    return ref;
};
exports.getTargetCollection = getTargetCollection;
const getParentIds = (name, currentIds = []) => {
    if (!name)
        return [];
    const target = (0, exports.getTarget)(name);
    const targetName = getTargetName(name, target.parent);
    const newId = `${(0, exports.firstLowercase)(targetName)}Id`;
    currentIds = [...currentIds, newId];
    const inParent = (0, exports.getParentIds)(target.parent, currentIds);
    return [...inParent, newId];
};
exports.getParentIds = getParentIds;
const getParentLabelValues = (labels, callback, initialValue) => {
    return labels.reduce((acc, label, index) => {
        const value = callback(label, index);
        if (value)
            return Object.assign(Object.assign({}, acc), { [label]: callback(label, index) });
        return acc;
    }, initialValue);
};
exports.getParentLabelValues = getParentLabelValues;
