"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchemaFields = exports.plural = exports.getParentIdLabel = exports.firstLowercase = exports.capitalize = exports.getDefinitionFields = void 0;
const graphql_1 = require("graphql");
const graphql_2 = require("graphql");
const core_1 = require("nexus/dist/core");
const file_1 = require("../file");
const getTargetName = (type = "Any") => {
    if ((0, core_1.isNexusObjectTypeDef)(type) ||
        (0, core_1.isNexusInputObjectTypeDef)(type) ||
        (0, core_1.isNexusScalarTypeDef)(type) ||
        (0, core_1.isNexusEnumTypeDef)(type)) {
        return type.name;
    }
    return type.toString();
};
const getDefinitionFields = (definition) => {
    let fields = [];
    definition({
        collection: (name, opts) => {
            const target = getTargetName(opts === null || opts === void 0 ? void 0 : opts.type);
            fields.push(Object.assign(Object.assign({}, opts), { name, type: "Collection", target, list: undefined }));
        },
        ref: (name, opts) => {
            const target = getTargetName(opts === null || opts === void 0 ? void 0 : opts.type);
            if (!(opts === null || opts === void 0 ? void 0 : opts.list)) {
                fields.push(Object.assign(Object.assign({}, opts), { name, type: "Reference", target }));
                return;
            }
            fields.push(Object.assign(Object.assign({}, opts), { name, type: "ReferenceList", target, list: undefined }));
        },
        object: (name, opts) => {
            const target = getTargetName(opts === null || opts === void 0 ? void 0 : opts.type);
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "Object", target }));
        },
        boolean: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "Boolean" }));
        },
        string: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "String" }));
        },
        int: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "Int" }));
        },
        id: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "ID" }));
        },
        file: (name, opts) => {
            if (!(opts === null || opts === void 0 ? void 0 : opts.list)) {
                fields.push(Object.assign(Object.assign({}, opts), { name, type: "File", list: undefined }));
                return;
            }
            fields.push(Object.assign(Object.assign({}, opts), { name, type: "FileList", list: undefined }));
        },
        float: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "Float" }));
        },
        field: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: opts === null || opts === void 0 ? void 0 : opts.type }));
        },
        date: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "Date" }));
        },
        any: (name, opts) => {
            fields.push(Object.assign(Object.assign({ name }, opts), { type: "Any" }));
        },
    });
    return fields.filter(({ type }) => type);
};
exports.getDefinitionFields = getDefinitionFields;
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
const firstLowercase = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
};
exports.firstLowercase = firstLowercase;
const getParentIdLabel = (parentIds) => parentIds === null || parentIds === void 0 ? void 0 : parentIds.map((parent) => (0, exports.firstLowercase)(`${parent}Id`));
exports.getParentIdLabel = getParentIdLabel;
const plural = (str) => {
    if (str.endsWith("y"))
        return str.charAt(0).toLowerCase() + str.substring(1, -1) + "ies";
    return str.charAt(0).toLowerCase() + str.slice(1) + "s";
};
exports.plural = plural;
const getSchemaFields = (name, schema) => {
    const schemaObject = schema.getType(name);
    const schemaInput = schema.getType(`Create${name}Input`);
    if (!schemaObject || !schemaInput)
        throw new Error(`can't found type ${name}`);
    const objectFields = schemaObject === null || schemaObject === void 0 ? void 0 : schemaObject["_fields"];
    const inputFields = schemaInput === null || schemaInput === void 0 ? void 0 : schemaInput["_fields"];
    const fields = Object.keys(objectFields).map((key) => {
        var _a, _b, _c, _d, _e, _f;
        const field = objectFields[key];
        const input = inputFields[key];
        const isList = (0, graphql_2.isListType)(field === null || field === void 0 ? void 0 : field.type);
        const typeName = ((_b = (_a = input === null || input === void 0 ? void 0 : input.type) === null || _a === void 0 ? void 0 : _a.ofType) === null || _b === void 0 ? void 0 : _b.name) || ((_c = input === null || input === void 0 ? void 0 : input.type) === null || _c === void 0 ? void 0 : _c.name);
        if (typeName === file_1.UploadFileInput.name) {
            return { name: key, type: "File" };
        }
        if (typeName === file_1.UploadFileListInput.name) {
            return { name: key, type: "FileList" };
        }
        if (typeName === null || typeName === void 0 ? void 0 : typeName.includes("CollectionInput")) {
            const target = typeName.replace("CollectionInput", "");
            return { name: key, type: "Collection", target };
        }
        if (typeName === null || typeName === void 0 ? void 0 : typeName.includes("ReferenceInput")) {
            const target = typeName.replace("ReferenceInput", "");
            return { name: key, type: "Reference", target };
        }
        if (typeName === null || typeName === void 0 ? void 0 : typeName.includes("ReferenceListInput")) {
            const target = typeName.replace("ReferenceListInput", "");
            return { name: key, type: "ReferenceList", target };
        }
        const objectName = ((_e = (_d = field === null || field === void 0 ? void 0 : field.type) === null || _d === void 0 ? void 0 : _d.ofType) === null || _e === void 0 ? void 0 : _e.name) || ((_f = field === null || field === void 0 ? void 0 : field.type) === null || _f === void 0 ? void 0 : _f.name);
        if ((field === null || field === void 0 ? void 0 : field.type) instanceof graphql_1.GraphQLObjectType) {
            return { name: key, type: "Object", target: objectName };
        }
        if (!objectName) {
            throw new Error(`type not found for field ${key}`);
        }
        return { name: key, type: objectName, list: isList };
    });
    return fields;
};
exports.getSchemaFields = getSchemaFields;
