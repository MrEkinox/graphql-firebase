import { GraphQLObjectType } from "graphql";
import { GraphQLSchema, isListType, isTypeSubTypeOf } from "graphql";
import {
  AllOutputTypes,
  isNexusEnumTypeDef,
  isNexusInputObjectTypeDef,
  isNexusObjectTypeDef,
  isNexusScalarTypeDef,
  NexusInputFieldConfigWithName,
  ObjectDefinitionBlock,
} from "nexus/dist/core";
import { UploadFileInput, UploadFileListInput } from "../file";

export type FirestoreFieldType =
  | AllOutputTypes
  | "File"
  | "FileList"
  | "Collection"
  | "Reference"
  | "ReferenceList"
  | "Object";

export type FirestoreField = Omit<
  NexusInputFieldConfigWithName<any, string>,
  "type"
> & {
  type: FirestoreFieldType;
  target?: string;
};

type NexusField = NexusInputFieldConfigWithName<any, string>;

const getTargetName = (type: NexusField["type"] = "Any"): string => {
  if (
    isNexusObjectTypeDef(type) ||
    isNexusInputObjectTypeDef(type) ||
    isNexusScalarTypeDef(type) ||
    isNexusEnumTypeDef(type)
  ) {
    return type.name;
  }
  return type.toString();
};

export const getDefinitionFields = (
  definition: (t: ObjectDefinitionBlock<string>) => void
) => {
  let fields: FirestoreField[] = [];

  definition({
    collection: (name: string, opts?: NexusField | undefined) => {
      const target = getTargetName(opts?.type);
      fields.push({
        ...opts,
        name,
        type: "Collection",
        target,
        list: undefined,
      });
    },
    ref: (name: string, opts?: NexusField | undefined) => {
      const target = getTargetName(opts?.type);
      if (!opts?.list) {
        fields.push({ ...opts, name, type: "Reference", target });
        return;
      }
      fields.push({
        ...opts,
        name,
        type: "ReferenceList",
        target,
        list: undefined,
      });
    },
    object: (name: string, opts?: NexusField | undefined) => {
      const target = getTargetName(opts?.type);
      fields.push({ name, ...opts, type: "Object", target });
    },
    boolean: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "Boolean" });
    },
    string: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "String" });
    },
    int: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "Int" });
    },
    id: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "ID" });
    },
    file: (name: string, opts?: NexusField | undefined) => {
      if (!opts?.list) {
        fields.push({ ...opts, name, type: "File", list: undefined });
        return;
      }
      fields.push({ ...opts, name, type: "FileList", list: undefined });
    },
    float: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "Float" });
    },
    field: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: opts?.type as any });
    },
    date: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "Date" });
    },
    any: (name: string, opts?: NexusField | undefined) => {
      fields.push({ name, ...opts, type: "Any" });
    },
  } as any);

  return fields.filter(({ type }) => type);
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const firstLowercase = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const getParentIdLabel = (parentIds?: string[]) =>
  parentIds?.map((parent) => firstLowercase(`${parent}Id`));

export const plural = (str: string) => {
  if (str.endsWith("y"))
    return str.charAt(0).toLowerCase() + str.substring(1, -1) + "ies";
  return str.charAt(0).toLowerCase() + str.slice(1) + "s";
};

export const getSchemaFields = (
  name: string,
  schema: GraphQLSchema
): FirestoreField[] => {
  const schemaObject = schema.getType(name);
  const schemaInput = schema.getType(`Create${name}Input`);
  if (!schemaObject || !schemaInput)
    throw new Error(`can't found type ${name}`);

  const objectFields = schemaObject?.["_fields"];
  const inputFields = schemaInput?.["_fields"];

  const fields = Object.keys(objectFields).map((key): FirestoreField => {
    const field = objectFields[key];
    const input = inputFields[key];

    const isList = isListType(field?.type) as true;

    const typeName = input?.type?.ofType?.name || input?.type?.name;

    if (typeName === UploadFileInput.name) {
      return { name: key, type: "File" };
    }
    if (typeName === UploadFileListInput.name) {
      return { name: key, type: "FileList" };
    }
    if (typeName?.includes("CollectionInput")) {
      const target = typeName.replace("CollectionInput", "");
      return { name: key, type: "Collection", target };
    }
    if (typeName?.includes("ReferenceInput")) {
      const target = typeName.replace("ReferenceInput", "");
      return { name: key, type: "Reference", target };
    }
    if (typeName?.includes("ReferenceListInput")) {
      const target = typeName.replace("ReferenceListInput", "");
      return { name: key, type: "ReferenceList", target };
    }

    const objectName =
      field?.type?.ofType?.name ||
      field?.type?.ofType?.ofType?.name ||
      field?.type?.ofType?.ofType?.ofType?.name ||
      field?.type?.name;

    if (field?.type instanceof GraphQLObjectType) {
      return { name: key, type: "Object", target: objectName, list: isList };
    }

    if (!objectName) {
      throw new Error(`type not found for field ${key}`);
    }

    return { name: key, type: objectName, list: isList };
  });

  return fields;
};
