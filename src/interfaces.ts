import { PluginDefinition } from "apollo-server-core";
import { Config, ExpressContext } from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";
import { SchemaConfig } from "nexus/dist/builder";
import {
  ArgsRecord,
  NexusEnumTypeDef,
  NexusScalarTypeDef,
} from "nexus/dist/core";
import {} from "graphql-scalars";
import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin";
import { FileUpload, Upload } from "graphql-upload-minimal";

export type ObjectString<T = string> = {
  [key: string]: T;
};

export type RelationType = "Relation";
export type PointerType = "Pointer";
export type CollectionType = "Collection";
export type ObjectType = "Object";
export type FileType = "File";
export type StringType = "String";
export type AnyType = "Any";
export type DateType = "Date";
export type PhoneType = "Phone";
export type CountryType = "Country";
export type EmailType = "Email";
export type BooleanType = "Boolean";
export type IDType = "ID";
export type NumberType = "Number";

export type TargetType = RelationType | PointerType;
export type DefaultType =
  | DateType
  | BooleanType
  | PhoneType
  | EmailType
  | IDType
  | NumberType
  | CountryType
  | StringType
  | AnyType
  | FileType
  | NexusScalarTypeDef<any>
  | NexusEnumTypeDef<any>;

export type FieldsType = DefaultType | TargetType | CollectionType | ObjectType;

export type FieldDefaultOptions = {
  required?: boolean;
  deprecation?: string;
  description?: string;
  authorize?: FieldAuthorizeResolver<any, string>;
};

export type FieldWithoutTargetOptions = FieldDefaultOptions & {
  type: DefaultType;
  list?: true | [true];
  nullable?: boolean;
  args?: ArgsRecord;
  defaultValue?: any;
  resolve?: (
    source: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => void;
};

export type FieldTargetOptions = FieldDefaultOptions & {
  type: TargetType;
  target: string;
};

export type FieldObjectOptions = FieldDefaultOptions &
  Omit<FieldWithoutTargetOptions, "type"> & {
    type: ObjectType;
    fields: ObjectString<AllFieldWithoutCollectionOptions>;
  };

export type FieldCollectionOptions = FieldDefaultOptions & {
  type: CollectionType;
} & CollectionOptions;

type AllFieldWithoutCollectionOptions =
  | FieldWithoutTargetOptions
  | FieldTargetOptions
  | FieldObjectOptions;

export type AllFieldOptions =
  | AllFieldWithoutCollectionOptions
  | FieldCollectionOptions;

export type FieldsOptions = ObjectString<AllFieldOptions>;

export type CollectionOptions = {
  beforeCreate?: (newData?: any, ids?: string[]) => void;
  beforeDelete?: (id: string, ids?: string[]) => void;
  beforeUpdate?: (id: string, newData?: any, ids?: string[]) => void;
  name: string;
  deprecation?: string;
  description?: string;
  authorize?: FieldAuthorizeResolver<any, string>;
  fields: FieldsOptions;
};

export type GraphQLFirebaseOptions = {
  collections: CollectionOptions[];
} & Partial<SchemaConfig> &
  Config<ExpressContext> & { apolloPlugins?: PluginDefinition[] };

export interface FileInfoType {
  url: string;
  name: string;
  isLinked?: boolean;
}

export interface UploadFileInput {
  upload?: Promise<FileUpload>;
  link?: FileInfoType;
}

export interface UploadFileListInput {
  add?: Promise<FileUpload>[];
  link?: FileInfoType[];
  remove?: string[];
}

export interface PointerInput {
  link?: string | null;
  createAndLink?: ObjectString | null;
}

export interface RelationInput {
  add?: string[] | null;
  createAndAdd?: ObjectString[] | null;
  remove?: string[] | null;
}

export interface CollectionInput {
  createAndAdd?: ObjectString[] | null;
  update?: ObjectString[] | null;
  delete?: string[] | null;
}
