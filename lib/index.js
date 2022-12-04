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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSchema = exports.firestoreType = exports.objectType = exports.scalarType = exports.enumType = exports.GraphQLFirebasePlugin = void 0;
const core_1 = require("nexus/dist/core");
const Scalars = __importStar(require("./scalars"));
const inputs_1 = require("./inputs");
const fileInput = __importStar(require("./file"));
const mutations_1 = require("./mutations");
const queries_1 = require("./queries");
const utils_1 = require("./utils");
const plugin_1 = require("./plugin");
var plugin_2 = require("./plugin");
Object.defineProperty(exports, "GraphQLFirebasePlugin", { enumerable: true, get: function () { return plugin_2.GraphQLFirebasePlugin; } });
const enumType = (options) => {
    const type = (0, core_1.enumType)(options);
    const whereInput = (0, inputs_1.getFieldWhereInput)(type.name);
    return [type, whereInput];
};
exports.enumType = enumType;
const scalarType = (options) => {
    const type = (0, core_1.scalarType)(options);
    const whereInput = (0, inputs_1.getFieldWhereInput)(type.name);
    return [type, whereInput];
};
exports.scalarType = scalarType;
const objectType = (options) => {
    const type = (0, core_1.objectType)(options);
    const whereInput = (0, inputs_1.getWhereInput)(options);
    const createInput = (0, inputs_1.getCreateInput)(options);
    const updateInput = (0, inputs_1.getObjectUpdateInput)(options);
    return [type, whereInput, createInput, updateInput];
};
exports.objectType = objectType;
const firestoreType = (options) => {
    const parentIds = (0, utils_1.getParentIdLabel)(options.parents);
    const fields = (0, utils_1.getDefinitionFields)(options.definition);
    const parents = [...(options.parents || []), options.name];
    const type = (0, core_1.objectType)(Object.assign(Object.assign({}, options), { definition: (t) => {
            parentIds === null || parentIds === void 0 ? void 0 : parentIds.forEach((parentId) => t.id(parentId, { required: true }));
            t.id("id", { required: true });
            t.field("createdAt", { type: "Date", required: true });
            t.field("updatedAt", { type: "Date", required: true });
            options.definition(t);
            fields.forEach((field) => {
                const type = field.target || field.type;
                if (field.type === "Collection" && field.target)
                    // @ts-ignore
                    return t.collection(field.name, Object.assign(Object.assign({}, field), { type, parents }));
            });
        } }));
    const singleQuery = (0, queries_1.getQuery)(options);
    const allQuery = (0, queries_1.getAllQuery)(options);
    const whereInput = (0, inputs_1.getWhereInput)(type.value);
    const deleteMutation = (0, mutations_1.getDeleteMutation)(options);
    const createMutation = (0, mutations_1.getCreateMutation)(options);
    const updateMutation = (0, mutations_1.getUpdateMutation)(options);
    const relationInput = (0, inputs_1.getReferenceInput)(options.name);
    const pointerInput = (0, inputs_1.getReferenceListInput)(options.name);
    const collectionInput = (0, inputs_1.getCollectionInput)(options.name);
    return [
        type,
        deleteMutation,
        whereInput,
        allQuery,
        singleQuery,
        updateMutation,
        createMutation,
        relationInput,
        pointerInput,
        collectionInput,
    ];
};
exports.firestoreType = firestoreType;
const makeSchema = (config) => {
    const defaultWhere = (0, inputs_1.createDefaultWhereInputs)();
    return (0, core_1.makeSchema)(Object.assign(Object.assign({}, config), { types: [...config.types, defaultWhere, Scalars, fileInput], plugins: [
            ...(config.plugins || []),
            (0, core_1.fieldAuthorizePlugin)(),
            (0, core_1.declarativeWrappingPlugin)(),
            (0, plugin_1.GraphQLFirebasePlugin)(),
            (0, core_1.connectionPlugin)({
                includeNodesField: false,
                disableBackwardPagination: true,
                disableForwardPagination: true,
                validateArgs: () => { },
                extendConnection: {
                    count: { type: "Int", requireResolver: false },
                },
                getConnectionName: (fieldName) => `${fieldName}Collection`,
            }),
            (0, plugin_1.LogTimePlugin)(config.debug),
        ] }));
};
exports.makeSchema = makeSchema;
