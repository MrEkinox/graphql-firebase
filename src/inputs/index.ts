import { InputDefinitionBlock } from "nexus/dist/core";
import { inputObjectType } from "nexus";
import {
  FirestoreField,
  FirestoreFieldType,
  getDefinitionFields,
} from "../utils";
import { FirestoreTypeOptions } from "..";

const getFieldsDefinition = (
  t: InputDefinitionBlock<any>,
  fields: FirestoreField[],
  isUpdate?: boolean
) => {
  fields.forEach((field) => {
    const required = !isUpdate && field.required;

    switch (field.type) {
      case "File":
        // @ts-ignore
        t.field({ ...field, type: "UploadFileInput", required });
        return;
      case "FileList":
        // @ts-ignore
        t.field({ ...field, type: "UploadFileListInput", required });
        return;
      case "Collection":
        // @ts-ignore
        t.field({ ...field, type: `${field.target}CollectionInput`, required });
        return;
      case "ReferenceList":
        t.field({
          ...field,
          // @ts-ignore
          type: `${field.target}ReferenceListInput`,
          required,
        });
        return;
      case "Reference":
        // @ts-ignore
        t.field({ ...field, type: `${field.target}ReferenceInput`, required });
        return;
      case "Object":
        t.field({
          ...field,
          // @ts-ignore
          type: `${isUpdate ? "Update" : "Create"}${field.target}Input`,
          required,
        });
        return;

      default:
        // @ts-ignore
        t.field({ ...field, required });
        return;
    }
  });
};

export const getCreateInput = (options: FirestoreTypeOptions) => {
  const fields = getDefinitionFields(options.definition);

  return inputObjectType({
    name: `Create${options.name}Input`,
    definition: (t) => {
      getFieldsDefinition(t, fields);
    },
  });
};

export const getObjectUpdateInput = (options: FirestoreTypeOptions) => {
  const fields = getDefinitionFields(options.definition);

  return inputObjectType({
    name: `Update${options.name}Input`,
    definition: (t) => {
      getFieldsDefinition(t, fields, true);
    },
  });
};

export const getUpdateInput = (options: FirestoreTypeOptions) => {
  const fields = getDefinitionFields(options.definition);

  const updateFieldsInput = inputObjectType({
    name: `Update${options.name}FieldsInput`,
    definition: (t) => {
      getFieldsDefinition(t, fields, true);
    },
  });

  return inputObjectType({
    name: `Update${options.name}Input`,
    definition: (t) => {
      t.id("id", { required: true });
      t.field("fields", { type: updateFieldsInput, required: true });
    },
  });
};

export const getDeleteInput = (name: string) =>
  inputObjectType({
    name: `Delete${name}Input`,
    definition: (t) => {
      t.id("id", { required: true });
    },
  });

export const getOrderByInput = (options: FirestoreTypeOptions) => {
  const fields = getDefinitionFields(options.definition);

  return inputObjectType({
    name: `${options.name}OrderByInput`,
    definition(t) {
      fields.forEach((field) => {
        // @ts-ignore
        t.field(field.name, { type: "OrderByEnum" });
      });
    },
  });
};

export const getReferenceListInput = (name: string) =>
  inputObjectType({
    name: `${name}ReferenceListInput`,
    definition(t) {
      t.id("add", { list: true });
      t.id("remove", { list: true });
      // @ts-ignore
      t.field("createAndAdd", { type: `Create${name}Input`, list: true });
    },
  });

export const getReferenceInput = (name: string) =>
  inputObjectType({
    name: `${name}ReferenceInput`,
    definition(t) {
      t.id("link");
      // @ts-ignore
      t.field("createAndLink", { type: `Create${name}Input` });
    },
  });

export const getCollectionInput = (name: string) =>
  inputObjectType({
    name: `${name}CollectionInput`,
    definition(t) {
      t.id("delete", { list: true });
      // @ts-ignore
      t.field("createAndAdd", { type: `Create${name}Input`, list: true });
      // @ts-ignore
      t.field("update", { type: `Update${name}Input`, list: true });
    },
  });

export const getFieldWhereInput = (type: FirestoreFieldType | string) =>
  inputObjectType({
    name: `${type}WhereInput`,
    definition: (t) => {
      t.boolean("exists");

      if (type === "File") return;
      if (type === "FileList") return;
      if (type === "Reference") return;
      if (type === "ReferenceList") return;
      if (type === "Any") return;
      if (type === "Object") return;

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

export const createDefaultWhereInputs = () => {
  const stringWhereInput = getFieldWhereInput("String");
  const booleanWhereInput = getFieldWhereInput("Boolean");
  const idWhereInput = getFieldWhereInput("ID");
  const dateWhereInput = getFieldWhereInput("Date");
  const fileWhereInput = getFieldWhereInput("File");
  const intWhereInput = getFieldWhereInput("Int");

  return {
    intWhereInput,
    stringWhereInput,
    booleanWhereInput,
    idWhereInput,
    dateWhereInput,
    fileWhereInput,
  };
};

export const getWhereInput = (options: FirestoreTypeOptions) => {
  const fields = getDefinitionFields(options.definition);

  return inputObjectType({
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
