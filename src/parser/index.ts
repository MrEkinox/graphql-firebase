import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin";
import {
  CollectionOptions,
  CollectionType,
  FieldTargetOptions,
  FieldWithoutTargetOptions,
  FieldObjectOptions,
  ObjectString,
  FieldDefaultOptions,
} from "../interfaces";
import { ObjectReduce } from "../utils";

export type ParsedFieldCollectionOptions = FieldDefaultOptions & {
  type: CollectionType;
  target: string;
};

export type ParsedAllFieldOptions =
  | FieldWithoutTargetOptions
  | ParsedFieldCollectionOptions
  | FieldTargetOptions
  | FieldObjectOptions;

export type ParsedFieldOptions = ParsedAllFieldOptions;

export type ParsedFieldsOptions = ObjectString<ParsedFieldOptions>;

export type ParsedCollectionOptions = {
  beforeCreate?: (newData?: any, ids?: string[]) => void;
  beforeDelete?: (id: string, ids?: string[]) => void;
  beforeUpdate?: (id: string, newData?: any, ids?: string[]) => void;
  name: string;
  deprecation?: string;
  description?: string;
  nullable?: boolean;
  authorize?: FieldAuthorizeResolver<any, string>;
  parent?: string;
  fields: ParsedFieldsOptions;
};

export type ParsedCollectionsOptions = ObjectString<ParsedCollectionOptions>;

const defaultFields: ParsedFieldsOptions = {
  id: { type: "ID", required: true },
  createdAt: { type: "Date", required: true },
  updatedAt: { type: "Date", required: true },
};

const parseCollection = (collection: CollectionOptions, parent?: string) => {
  const parentName = parent ? parent + collection.name : collection.name;

  const fields: object = ObjectReduce(collection.fields, (acc, key, value) => {
    if (value.type === "Collection") {
      const target = parentName + value.name;

      return { ...acc, [key]: { type: "Collection", target } };
    }
    return { ...acc, [key]: value };
  });

  return {
    parent,
    ...collection,
    name: parentName,
    fields: { ...defaultFields, ...fields },
  };
};

const parseCollectionInCollection = (
  collection: CollectionOptions,
  parent?: string
) => {
  return ObjectReduce(collection.fields, (acc, key, value) => {
    if (value.type === "Collection") {
      const parentName = parent || collection.name;
      const name = parentName + value.name;
      const inCollection = parseCollectionInCollection(value, name);
      const parsedCollection = parseCollection(value, parentName);

      return { ...acc, ...inCollection, [name]: parsedCollection };
    }
    return acc;
  });
};

export const parseCollections = (collections: CollectionOptions[]) => {
  return collections.reduce((acc, collection) => {
    const { name } = collection;
    const inCollection = parseCollectionInCollection(collection);
    const parsedCollection = parseCollection(collection);

    return { ...acc, ...inCollection, [name]: parsedCollection };
  }, {});
};
