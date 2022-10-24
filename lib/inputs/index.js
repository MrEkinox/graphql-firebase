"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = exports.getObjectInput = exports.getWhereInput = exports.createDefaultWhereInputs = exports.getFieldWhereInput = void 0;
const nexus_1 = require("nexus");
const core_1 = require("nexus/dist/core");
const orderBy_1 = require("../orderBy");
const utils_1 = require("../utils");
const getFieldDefinition = (t, collectionName, name, options, isUpdate) => {
    const { type } = options;
    const required = !isUpdate && options.required;
    if (name === "id" || name === "createdAt" || name === "updatedAt")
        return;
    switch (type) {
        case "File":
            t.field(name, Object.assign(Object.assign({}, options), { 
                // @ts-ignore
                type: options.list ? "UploadFileListInput" : "UploadFileInput", required, list: undefined }));
            break;
        case "Collection":
        case "Relation":
        case "Pointer":
            // @ts-ignore
            t.field(name, { type: `${options.target}${type}Input`, required });
            break;
        case "Object":
            t.field(name, {
                // @ts-ignore
                type: `${collectionName}${(0, utils_1.capitalize)(name)}Input`,
                required,
                list: options.list,
            });
            break;
        default:
            if ((0, core_1.isNexusEnumTypeDef)(type) || (0, core_1.isNexusScalarTypeDef)(type)) {
                // @ts-ignore
                t.field(name, Object.assign(Object.assign({}, options), { type: type.name, required }));
            }
            else if (type) {
                // @ts-ignore
                t.field(name, Object.assign(Object.assign({}, options), { required }));
            }
            break;
    }
};
const getFieldsDefinition = (t, collectionName, fields, isUpdate) => {
    (0, utils_1.ObjectEach)(fields, (fieldName, fieldOptions) => {
        getFieldDefinition(t, collectionName, fieldName, fieldOptions, isUpdate);
    });
};
const getFieldWhereInput = (type) => (0, nexus_1.inputObjectType)({
    name: `${type}WhereInput`,
    definition: (t) => {
        t.boolean("exists");
        if (type === "Pointer")
            return;
        if (type === "File")
            return;
        if (type === "Collection")
            return;
        if (type === "Relation")
            return;
        // @ts-ignore
        t.field("equalTo", { type });
        // @ts-ignore
        t.field("notEqualTo", { type });
        // @ts-ignore
        t.field("lessThan", { type });
        // @ts-ignore
        t.field("lessThanOrEqualTo", { type });
        // @ts-ignore
        t.field("greaterThan", { type });
        // @ts-ignore
        t.field("greaterThanOrEqualTo", { type });
        // @ts-ignore
        t.field("in", { type, list: true });
        // @ts-ignore
        t.field("notIn", { type, list: true });
    },
});
exports.getFieldWhereInput = getFieldWhereInput;
const createDefaultWhereInputs = () => {
    const stringWhereInput = (0, exports.getFieldWhereInput)("String");
    const booleanWhereInput = (0, exports.getFieldWhereInput)("Boolean");
    const idWhereInput = (0, exports.getFieldWhereInput)("ID");
    const dateWhereInput = (0, exports.getFieldWhereInput)("Date");
    const fileWhereInput = (0, exports.getFieldWhereInput)("File");
    const emailWhereInput = (0, exports.getFieldWhereInput)("Email");
    const numberWhereInput = (0, exports.getFieldWhereInput)("Number");
    const countryWhereInput = (0, exports.getFieldWhereInput)("Country");
    const phoneWhereInput = (0, exports.getFieldWhereInput)("Phone");
    return {
        phoneWhereInput,
        countryWhereInput,
        emailWhereInput,
        stringWhereInput,
        booleanWhereInput,
        idWhereInput,
        dateWhereInput,
        fileWhereInput,
        numberWhereInput,
    };
};
exports.createDefaultWhereInputs = createDefaultWhereInputs;
const getWhereInput = (name, fields) => (0, nexus_1.inputObjectType)({
    name: `${name}WhereInput`,
    definition(t) {
        // @ts-ignore
        (0, utils_1.ObjectEach)(fields, (fieldName, options) => {
            switch (options.type) {
                case "Relation":
                    // @ts-ignore
                    t.field(fieldName, { type: `${options.target}WhereInput` });
                    break;
                case "Pointer":
                    // @ts-ignore
                    t.field(fieldName, { type: `${options.target}WhereInput` });
                    break;
                case "Collection":
                    // @ts-ignore
                    t.field(fieldName, { type: `${options.target}WhereInput` });
                    break;
                case "Object":
                    const target = name + (0, utils_1.capitalize)(fieldName);
                    // @ts-ignore
                    t.field(fieldName, { type: `${target}WhereInput` });
                    break;
                default:
                    if ((0, core_1.isNexusEnumTypeDef)(options.type) ||
                        (0, core_1.isNexusScalarTypeDef)(options.type)) {
                        // @ts-ignore
                        t.field(fieldName, { type: `${options.type.name}WhereInput` });
                        break;
                    }
                    // @ts-ignore
                    t.field(fieldName, { type: `${options.type}WhereInput` });
                    break;
            }
        });
    },
});
exports.getWhereInput = getWhereInput;
const orderBy = (0, nexus_1.enumType)({
    name: `OrderByEnum`,
    members: orderBy_1.OrderByEnum,
});
const getOrderByInput = (name, fields) => (0, nexus_1.inputObjectType)({
    name: `${name}OrderByInput`,
    definition(t) {
        (0, utils_1.ObjectEach)(fields, (fieldName) => {
            t.field(fieldName, { type: orderBy });
        });
    },
});
const getUpdateInput = (name, fields) => (0, nexus_1.inputObjectType)({
    name: `Update${name}Input`,
    definition: (t) => {
        t.id("id", { required: true });
        t.field("fields", {
            type: (0, nexus_1.inputObjectType)({
                name: `Update${name}FieldsInput`,
                definition: (t) => {
                    getFieldsDefinition(t, name, fields, true);
                },
            }),
            required: true,
        });
    },
});
const getObjectInput = (name, fields) => (0, nexus_1.inputObjectType)({
    name: `${name}Input`,
    definition: (t) => {
        getFieldsDefinition(t, name, fields);
    },
});
exports.getObjectInput = getObjectInput;
const getCreateInput = (name, fields) => (0, nexus_1.inputObjectType)({
    name: `Create${name}Input`,
    definition: (t) => {
        getFieldsDefinition(t, name, fields);
    },
});
const getDeleteInput = (name) => (0, nexus_1.inputObjectType)({
    name: `Delete${name}Input`,
    definition: (t) => {
        t.id("id", { required: true });
    },
});
const getRelationInput = (name) => (0, nexus_1.inputObjectType)({
    name: `${name}RelationInput`,
    definition(t) {
        t.id("add", { list: true });
        t.id("remove", { list: true });
        // @ts-ignore
        t.field("createAndAdd", { type: `Create${name}Input`, list: true });
    },
});
const getPointerInput = (name) => (0, nexus_1.inputObjectType)({
    name: `${name}PointerInput`,
    definition(t) {
        t.id("link");
        // @ts-ignore
        t.field("createAndLink", { type: `Create${name}Input` });
    },
});
const getCollectionInput = (name) => (0, nexus_1.inputObjectType)({
    name: `${name}CollectionInput`,
    definition(t) {
        t.id("delete", { list: true });
        // @ts-ignore
        t.field("createAndAdd", { type: `Create${name}Input`, list: true });
        // @ts-ignore
        t.field("update", { type: `Update${name}Input`, list: true });
    },
});
const getInputs = (name, fields) => {
    const whereInput = (0, exports.getWhereInput)(name, fields);
    const orderByInput = getOrderByInput(name, fields);
    const updateInput = getUpdateInput(name, fields);
    const createInput = getCreateInput(name, fields);
    const deleteInput = getDeleteInput(name);
    const relationInput = getRelationInput(name);
    const pointerInput = getPointerInput(name);
    const collectionInput = getCollectionInput(name);
    return {
        whereInput,
        orderByInput,
        updateInput,
        createInput,
        deleteInput,
        relationInput,
        pointerInput,
        collectionInput,
    };
};
exports.getInputs = getInputs;
