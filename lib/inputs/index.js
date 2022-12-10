"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWhereInput = exports.createDefaultWhereInputs = exports.getFieldWhereInput = exports.getCollectionInput = exports.getReferenceInput = exports.getReferenceListInput = exports.getOrderByInput = exports.getDeleteInput = exports.getUpdateInput = exports.getObjectUpdateInput = exports.getCreateInput = void 0;
const nexus_1 = require("nexus");
const utils_1 = require("../utils");
const getFieldsDefinition = (t, fields, isUpdate) => {
    fields.forEach((field) => {
        const required = !isUpdate && field.required;
        switch (field.type) {
            case "File":
                // @ts-ignore
                t.field(Object.assign(Object.assign({}, field), { type: "UploadFileInput", required }));
                return;
            case "FileList":
                // @ts-ignore
                t.field(Object.assign(Object.assign({}, field), { type: "UploadFileListInput", required }));
                return;
            case "Collection":
                // @ts-ignore
                t.field(Object.assign(Object.assign({}, field), { type: `${field.target}CollectionInput`, required }));
                return;
            case "ReferenceList":
                t.field(Object.assign(Object.assign({}, field), { 
                    // @ts-ignore
                    type: `${field.target}ReferenceListInput`, required }));
                return;
            case "Reference":
                // @ts-ignore
                t.field(Object.assign(Object.assign({}, field), { type: `${field.target}ReferenceInput`, required }));
                return;
            case "Object":
                t.field(Object.assign(Object.assign({}, field), { 
                    // @ts-ignore
                    type: `${isUpdate ? "Update" : "Create"}${field.target}Input`, required }));
                return;
            default:
                // @ts-ignore
                t.field(Object.assign(Object.assign({}, field), { required }));
                return;
        }
    });
};
const getCreateInput = (options) => {
    const fields = (0, utils_1.getDefinitionFields)(options.definition);
    return (0, nexus_1.inputObjectType)({
        name: `Create${options.name}Input`,
        definition: (t) => {
            getFieldsDefinition(t, fields);
        },
    });
};
exports.getCreateInput = getCreateInput;
const getObjectUpdateInput = (options) => {
    const fields = (0, utils_1.getDefinitionFields)(options.definition);
    return (0, nexus_1.inputObjectType)({
        name: `Update${options.name}Input`,
        definition: (t) => {
            getFieldsDefinition(t, fields, true);
        },
    });
};
exports.getObjectUpdateInput = getObjectUpdateInput;
const getUpdateInput = (options) => {
    const fields = (0, utils_1.getDefinitionFields)(options.definition);
    const updateFieldsInput = (0, nexus_1.inputObjectType)({
        name: `Update${options.name}FieldsInput`,
        definition: (t) => {
            getFieldsDefinition(t, fields, true);
        },
    });
    return (0, nexus_1.inputObjectType)({
        name: `Update${options.name}Input`,
        definition: (t) => {
            t.id("id", { required: true });
            t.field("fields", { type: updateFieldsInput, required: true });
        },
    });
};
exports.getUpdateInput = getUpdateInput;
const getDeleteInput = (name) => (0, nexus_1.inputObjectType)({
    name: `Delete${name}Input`,
    definition: (t) => {
        t.id("id", { required: true });
    },
});
exports.getDeleteInput = getDeleteInput;
const getOrderByInput = (options) => {
    const fields = (0, utils_1.getDefinitionFields)(options.definition);
    return (0, nexus_1.inputObjectType)({
        name: `${options.name}OrderByInput`,
        definition(t) {
            fields.forEach((field) => {
                // @ts-ignore
                t.field(field.name, { type: "OrderByEnum" });
            });
        },
    });
};
exports.getOrderByInput = getOrderByInput;
const getReferenceListInput = (name) => (0, nexus_1.inputObjectType)({
    name: `${name}ReferenceListInput`,
    definition(t) {
        t.id("add", { list: true });
        t.id("remove", { list: true });
        // @ts-ignore
        t.field("createAndAdd", { type: `Create${name}Input`, list: true });
    },
});
exports.getReferenceListInput = getReferenceListInput;
const getReferenceInput = (name) => (0, nexus_1.inputObjectType)({
    name: `${name}ReferenceInput`,
    definition(t) {
        t.id("link");
        // @ts-ignore
        t.field("createAndLink", { type: `Create${name}Input` });
    },
});
exports.getReferenceInput = getReferenceInput;
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
exports.getCollectionInput = getCollectionInput;
const getFieldWhereInput = (type) => (0, nexus_1.inputObjectType)({
    name: `${type}WhereInput`,
    definition: (t) => {
        t.boolean("exists");
        if (type === "File")
            return;
        if (type === "FileList")
            return;
        if (type === "Reference")
            return;
        if (type === "ReferenceList")
            return;
        if (type === "Any")
            return;
        if (type === "Object")
            return;
        // @ts-ignore
        t.field("equalTo", { type });
        // @ts-ignore
        t.field("notEqualTo", { type });
        // @ts-ignore
        t.field("arrayContains", { type });
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
    const intWhereInput = (0, exports.getFieldWhereInput)("Int");
    return {
        intWhereInput,
        stringWhereInput,
        booleanWhereInput,
        idWhereInput,
        dateWhereInput,
        fileWhereInput,
    };
};
exports.createDefaultWhereInputs = createDefaultWhereInputs;
const getWhereInput = (options) => {
    const fields = (0, utils_1.getDefinitionFields)(options.definition);
    return (0, nexus_1.inputObjectType)({
        name: `${options.name}WhereInput`,
        definition(t) {
            t.boolean("exists");
            fields.map((field) => {
                switch (field.type) {
                    case "File":
                    case "FileList":
                        return;
                    case "Reference":
                    case "ReferenceList":
                    case "Collection":
                    case "Object":
                        // @ts-ignore
                        t.field(field.name, { type: `${field.target}WhereInput` });
                        return;
                    case "Any":
                        t.field(field.name, { type: "Any" });
                        return;
                    default:
                        // @ts-ignore
                        t.field(field.name, { type: `${field.type}WhereInput` });
                }
            });
        },
    });
};
exports.getWhereInput = getWhereInput;
