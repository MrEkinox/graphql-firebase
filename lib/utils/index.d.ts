import { GraphQLResolveInfo } from "graphql";
import { GraphQLSchema } from "graphql";
import { AllOutputTypes, NexusInputFieldConfigWithName, ObjectDefinitionBlock } from "nexus/dist/core";
export type FirestoreFieldType = AllOutputTypes | "File" | "FileList" | "Collection" | "Reference" | "ReferenceList" | "Object";
export type FirestoreField = Omit<NexusInputFieldConfigWithName<any, string>, "type"> & {
    type: FirestoreFieldType;
    target?: string;
};
export declare const getDefinitionFields: (definition: (t: ObjectDefinitionBlock<string>) => void) => FirestoreField[];
export declare const capitalize: (str: string) => string;
export declare const firstLowercase: (str: string) => string;
export declare const getParentIdLabel: (parentIds?: string[]) => string[] | undefined;
export declare const plural: (str: string) => string;
export declare const getSchemaFields: (name: string, schema: GraphQLSchema) => FirestoreField[];
export declare const isOnlyIdField: (info: GraphQLResolveInfo) => boolean;
export declare const hasCountField: (info: GraphQLResolveInfo) => boolean;
export declare const hasEdgeField: (info: GraphQLResolveInfo) => boolean;
