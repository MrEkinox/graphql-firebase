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
exports.GraphQLFirebase = exports.parsedCollections = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const nexus_1 = require("nexus");
const core_1 = require("nexus/dist/core");
const inputs_1 = require("./inputs");
const mutations_1 = require("./mutations");
const parser_1 = require("./parser");
const queries_1 = require("./queries");
const utils_1 = require("./utils");
const CustomScalars = __importStar(require("./scalars"));
const collection_1 = require("./converter/collection");
const file_1 = require("./converter/file");
const getFieldDefinition = (t, collectionName, name, options) => {
    const { type } = options;
    switch (type) {
        case "Collection":
            t.connectionField(name, {
                getConnectionName: () => `${collectionName}${(0, utils_1.capitalize)(name)}Collection`,
                deprecation: options.deprecation,
                authorize: options.authorize,
                description: options.description,
                // @ts-ignore
                type: options.target,
                additionalArgs: {
                    limit: (0, nexus_1.arg)({ type: "Int", default: 50 }),
                    offset: (0, nexus_1.arg)({ type: "Int", default: 0 }),
                    where: (0, nexus_1.arg)({ type: `${options.target}WhereInput` }),
                    orderBy: (0, nexus_1.arg)({ type: `${options.target}OrderByInput` }),
                },
                resolve: async (root, _a, ctx, info) => {
                    var { where, orderBy } = _a, input = __rest(_a, ["where", "orderBy"]);
                    return (0, collection_1.collectionFromFirestore)(options.target, input, where, orderBy, root, info);
                },
            });
            break;
        case "Relation":
            // @ts-ignore
            t.field(name, Object.assign(Object.assign({}, options), { type: options.target, list: true }));
            break;
        case "Pointer":
            // @ts-ignore
            t.field(name, Object.assign(Object.assign({}, options), { type: options.target }));
            break;
        case "Object":
            // @ts-ignore
            const newCollectionName = collectionName + (0, utils_1.capitalize)(name);
            t.field(name, Object.assign(Object.assign({}, options), { type: (0, nexus_1.objectType)({
                    name: newCollectionName,
                    definition: (t) => {
                        getFieldsDefinition(t, newCollectionName, options.fields);
                    },
                }) }));
            break;
        default:
            if ((0, core_1.isNexusEnumTypeDef)(type) || (0, core_1.isNexusScalarTypeDef)(type)) {
                // @ts-ignore
                t.field(name, Object.assign(Object.assign({}, options), { type: type.name }));
            }
            else if (type) {
                // @ts-ignore
                t.field(name, Object.assign({}, options));
            }
            break;
    }
};
const getFieldsDefinition = (t, collectionName, fields) => {
    (0, utils_1.ObjectEach)(fields, (fieldName, fieldOptions) => {
        getFieldDefinition(t, collectionName, fieldName, fieldOptions);
    });
};
const createCollection = (name, collection) => {
    const parentIds = (0, utils_1.getParentIds)(collection.parent);
    const type = (0, nexus_1.objectType)({
        name,
        definition: (t) => {
            parentIds === null || parentIds === void 0 ? void 0 : parentIds.forEach((id) => t.id(id, { required: true }));
            getFieldsDefinition(t, name, collection.fields);
        },
    });
    const inputs = (0, inputs_1.getInputs)(name, collection.fields);
    const mutations = (0, mutations_1.getMutations)(collection, parentIds);
    const queries = (0, queries_1.getQueries)(collection);
    return { type, inputs, mutations, queries };
};
const createAllCollection = () => {
    return (0, utils_1.ObjectMap)(exports.parsedCollections, (name, collection) => {
        return createCollection(name, collection);
    });
};
const flattenObjectType = (name, options) => {
    return (0, utils_1.ObjectReduce)(options, (acc, fieldName, options2) => {
        const capitalizeName = name + (0, utils_1.capitalize)(fieldName);
        if (options2.type === "Object") {
            const underObjects = flattenObjectType(capitalizeName, options2.fields);
            const objectFields = (0, utils_1.ObjectReduce)(options2.fields, (acc, fieldName2, options2) => {
                const capitalizeFieldName = capitalizeName + (0, utils_1.capitalize)(fieldName2);
                if (options2.type === "Object") {
                    return Object.assign(Object.assign({}, acc), { [fieldName2]: Object.assign(Object.assign({}, options2), { type: `${capitalizeFieldName}Input` }) });
                }
                return Object.assign(Object.assign({}, acc), { [fieldName2]: options2 });
            }, {});
            const whereFields = (0, utils_1.ObjectReduce)(options2.fields, (acc, fieldName2, options2) => {
                const capitalizeFieldName = capitalizeName + (0, utils_1.capitalize)(fieldName2);
                if (options2.type === "Object") {
                    return Object.assign(Object.assign({}, acc), { [fieldName2]: Object.assign(Object.assign({}, options2), { type: `${capitalizeFieldName}` }) });
                }
                return Object.assign(Object.assign({}, acc), { [fieldName2]: options2 });
            }, {});
            const objectInput = (0, inputs_1.getObjectInput)(capitalizeName, objectFields);
            const objectWhereInput = (0, inputs_1.getWhereInput)(capitalizeName, whereFields);
            return Object.assign(Object.assign(Object.assign({}, acc), underObjects), { [capitalizeName]: [objectInput, objectWhereInput] });
        }
        if ((0, core_1.isNexusEnumTypeDef)(options2.type) ||
            (0, core_1.isNexusScalarTypeDef)(options2.type)) {
            const whereInput = (0, inputs_1.getFieldWhereInput)(options2.type.name);
            return Object.assign(Object.assign({}, acc), { [options2.type.name]: options2.type, [whereInput.name]: whereInput });
        }
        return acc;
    }, {});
};
const creatAllCustomTypeInput = () => {
    return (0, utils_1.ObjectReduce)(exports.parsedCollections, (acc, collectionName, collection) => {
        const typeInputs = flattenObjectType(collectionName, collection.fields);
        return Object.assign(Object.assign({}, acc), typeInputs);
    });
};
const GraphQLFirebase = (options) => {
    exports.parsedCollections = (0, parser_1.parseCollections)(options.collections);
    const customTypeInputs = creatAllCustomTypeInput();
    const defaultWhereInputs = (0, inputs_1.createDefaultWhereInputs)();
    const collectionSchemas = createAllCollection();
    const schema = (0, nexus_1.makeSchema)(Object.assign(Object.assign({}, options), { types: [
            options.types,
            defaultWhereInputs,
            customTypeInputs,
            collectionSchemas,
            CustomScalars,
            file_1.UploadFileListInput,
            file_1.UploadFileInput,
        ], plugins: [
            ...(options.plugins || []),
            (0, nexus_1.declarativeWrappingPlugin)(),
            (0, nexus_1.connectionPlugin)({
                includeNodesField: false,
                disableBackwardPagination: true,
                disableForwardPagination: true,
                validateArgs: () => { },
                extendConnection: {
                    count: { type: "Int", requireResolver: false },
                },
                getConnectionName: (fieldName) => `${(0, utils_1.capitalize)(fieldName)}Collection`,
            }),
            (0, nexus_1.fieldAuthorizePlugin)(),
        ] }));
    const server = new apollo_server_express_1.ApolloServer(Object.assign(Object.assign({ debug: true, csrfPrevention: true, cache: "bounded", introspection: true }, options), { 
        // @ts-ignore
        schema: schema, plugins: options.apolloPlugins }));
    return server;
};
exports.GraphQLFirebase = GraphQLFirebase;
