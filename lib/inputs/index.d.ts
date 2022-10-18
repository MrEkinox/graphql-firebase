import { ParsedFieldsOptions } from "../parser";
export declare const getFieldWhereInput: (type: string) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
export declare const createDefaultWhereInputs: () => {
    phoneWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    countryWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    emailWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    stringWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    booleanWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    idWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    dateWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    fileWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    numberWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
};
export declare const getWhereInput: (name: string, fields: ParsedFieldsOptions) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
export declare const getObjectInput: (name: string, fields: ParsedFieldsOptions) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}Input`>;
export declare const getInputs: (name: string, fields: ParsedFieldsOptions) => {
    whereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    orderByInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}OrderByInput`>;
    updateInput: import("nexus/dist/core").NexusInputObjectTypeDef<`Update${string}Input`>;
    createInput: import("nexus/dist/core").NexusInputObjectTypeDef<`Create${string}Input`>;
    deleteInput: import("nexus/dist/core").NexusInputObjectTypeDef<`Delete${string}Input`>;
    relationInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}RelationInput`>;
    pointerInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}PointerInput`>;
    collectionInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}CollectionInput`>;
};
