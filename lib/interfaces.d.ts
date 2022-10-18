import { PluginDefinition } from "apollo-server-core";
import { Config, ExpressContext } from "apollo-server-express";
import { GraphQLResolveInfo } from "graphql";
import { SchemaConfig } from "nexus/dist/builder";
import { ArgsRecord, NexusEnumTypeDef, NexusScalarTypeDef } from "nexus/dist/core";
import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin";
import { FileUpload } from "graphql-upload-minimal";
export declare type ObjectString<T = string> = {
    [key: string]: T;
};
export declare type RelationType = "Relation";
export declare type PointerType = "Pointer";
export declare type CollectionType = "Collection";
export declare type ObjectType = "Object";
export declare type FileType = "File";
export declare type StringType = "String";
export declare type AnyType = "Any";
export declare type DateType = "Date";
export declare type PhoneType = "Phone";
export declare type CountryType = "Country";
export declare type EmailType = "Email";
export declare type BooleanType = "Boolean";
export declare type IDType = "ID";
export declare type NumberType = "Number";
export declare type TargetType = RelationType | PointerType;
export declare type DefaultType = DateType | BooleanType | PhoneType | EmailType | IDType | NumberType | CountryType | StringType | AnyType | FileType | NexusScalarTypeDef<any> | NexusEnumTypeDef<any>;
export declare type FieldsType = DefaultType | TargetType | CollectionType | ObjectType;
export declare type FieldDefaultOptions = {
    required?: boolean;
    deprecation?: string;
    description?: string;
    authorize?: FieldAuthorizeResolver<any, string>;
};
export declare type FieldWithoutTargetOptions = FieldDefaultOptions & {
    type: DefaultType;
    list?: true | [true];
    nullable?: boolean;
    args?: ArgsRecord;
    defaultValue?: any;
    resolve?: (source: any, args: any, context: any, info: GraphQLResolveInfo) => void;
};
export declare type FieldTargetOptions = FieldDefaultOptions & {
    type: TargetType;
    target: string;
};
export declare type FieldObjectOptions = FieldDefaultOptions & Omit<FieldWithoutTargetOptions, "type"> & {
    type: ObjectType;
    fields: ObjectString<AllFieldWithoutCollectionOptions>;
};
export declare type FieldCollectionOptions = FieldDefaultOptions & {
    type: CollectionType;
} & CollectionOptions;
declare type AllFieldWithoutCollectionOptions = FieldWithoutTargetOptions | FieldTargetOptions | FieldObjectOptions;
export declare type AllFieldOptions = AllFieldWithoutCollectionOptions | FieldCollectionOptions;
export declare type FieldsOptions = ObjectString<AllFieldOptions>;
export declare type CollectionOptions = {
    beforeCreate?: (newData?: any, ids?: string[]) => void;
    beforeDelete?: (id: string, ids?: string[]) => void;
    beforeUpdate?: (id: string, newData?: any, ids?: string[]) => void;
    name: string;
    deprecation?: string;
    description?: string;
    authorize?: FieldAuthorizeResolver<any, string>;
    fields: FieldsOptions;
};
export declare type GraphQLFirebaseOptions = {
    collections: CollectionOptions[];
} & Partial<SchemaConfig> & Config<ExpressContext> & {
    apolloPlugins?: PluginDefinition[];
};
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
    delete?: string[] | null;
}
export {};
