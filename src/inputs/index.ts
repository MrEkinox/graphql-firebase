import { inputObjectType, enumType } from "nexus";
import {
  InputDefinitionBlock,
  isNexusEnumTypeDef,
  isNexusScalarTypeDef,
} from "nexus/dist/core";
import { OrderByEnum } from "../orderBy";
import { ParsedFieldOptions, ParsedFieldsOptions } from "../parser";
import { capitalize, ObjectEach } from "../utils";

const getFieldDefinition = (
  t: InputDefinitionBlock<any>,
  collectionName: string,
  name: string,
  options: ParsedFieldOptions,
  isUpdate?: boolean
) => {
  const { type } = options;
  const required = !isUpdate && options.required;

  if (name === "id" || name === "createdAt" || name === "updatedAt") return;

  switch (type) {
    case "File":
      t.field(name, {
        ...options,
        // @ts-ignore
        type: options.list ? "UploadFileListInput" : "UploadFileInput",
        required,
        list: undefined,
      });
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
        type: `${collectionName}${capitalize(name)}Input`,
        required,
        list: options.list,
      });
      break;

    default:
      if (isNexusEnumTypeDef(type) || isNexusScalarTypeDef(type)) {
        // @ts-ignore
        t.field(name, { ...options, type: type.name, required });
      } else if (type) {
        // @ts-ignore
        t.field(name, { ...options, required });
      }
      break;
  }
};

const getFieldsDefinition = (
  t: InputDefinitionBlock<any>,
  collectionName: string,
  fields: ParsedFieldsOptions,
  isUpdate?: boolean
) => {
  ObjectEach(fields, (fieldName, fieldOptions) => {
    getFieldDefinition(t, collectionName, fieldName, fieldOptions, isUpdate);
  });
};

export const getFieldWhereInput = (type: string) =>
  inputObjectType({
    name: `${type}WhereInput`,
    definition: (t) => {
      t.boolean("exists");

      if (type === "Pointer") return;
      if (type === "File") return;
      if (type === "Collection") return;
      if (type === "Relation") return;
      if (type === "Any") return;

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
  const emailWhereInput = getFieldWhereInput("Email");
  const numberWhereInput = getFieldWhereInput("Number");
  const countryWhereInput = getFieldWhereInput("Country");
  const phoneWhereInput = getFieldWhereInput("Phone");

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

export const getWhereInput = (name: string, fields: ParsedFieldsOptions) =>
  inputObjectType({
    name: `${name}WhereInput`,
    definition(t) {
      // @ts-ignore
      ObjectEach(fields, (fieldName, options) => {
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
          case "Any":
            // @ts-ignore
            t.field(fieldName, { type: "Any" });
            break;
          case "Object":
            const target = name + capitalize(fieldName);
            // @ts-ignore
            t.field(fieldName, { type: `${target}WhereInput` });
            break;

          default:
            if (
              isNexusEnumTypeDef(options.type) ||
              isNexusScalarTypeDef(options.type)
            ) {
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

const orderBy = enumType({
  name: `OrderByEnum`,
  members: OrderByEnum,
});

const getOrderByInput = (name: string, fields: ParsedFieldsOptions) =>
  inputObjectType({
    name: `${name}OrderByInput`,
    definition(t) {
      ObjectEach(fields, (fieldName) => {
        t.field(fieldName, { type: orderBy });
      });
    },
  });

const getUpdateInput = (name: string, fields: ParsedFieldsOptions) =>
  inputObjectType({
    name: `Update${name}Input`,
    definition: (t) => {
      t.id("id", { required: true });
      t.field("fields", {
        type: inputObjectType({
          name: `Update${name}FieldsInput`,
          definition: (t) => {
            getFieldsDefinition(t, name, fields, true);
          },
        }),
        required: true,
      });
    },
  });

export const getObjectInput = (name: string, fields: ParsedFieldsOptions) =>
  inputObjectType({
    name: `${name}Input`,
    definition: (t) => {
      getFieldsDefinition(t, name, fields);
    },
  });

const getCreateInput = (name: string, fields: ParsedFieldsOptions) =>
  inputObjectType({
    name: `Create${name}Input`,
    definition: (t) => {
      getFieldsDefinition(t, name, fields);
    },
  });

const getDeleteInput = (name: string) =>
  inputObjectType({
    name: `Delete${name}Input`,
    definition: (t) => {
      t.id("id", { required: true });
    },
  });

const getRelationInput = (name: string) =>
  inputObjectType({
    name: `${name}RelationInput`,
    definition(t) {
      t.id("add", { list: true });
      t.id("remove", { list: true });
      // @ts-ignore
      t.field("createAndAdd", { type: `Create${name}Input`, list: true });
    },
  });

const getPointerInput = (name: string) =>
  inputObjectType({
    name: `${name}PointerInput`,
    definition(t) {
      t.id("link");
      // @ts-ignore
      t.field("createAndLink", { type: `Create${name}Input` });
    },
  });

const getCollectionInput = (name: string) =>
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

export const getInputs = (name: string, fields: ParsedFieldsOptions) => {
  const whereInput = getWhereInput(name, fields);
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
