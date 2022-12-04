import { FirestoreFieldType } from "../utils";
import { FirestoreTypeOptions } from "..";
export declare const getCreateInput: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusInputObjectTypeDef<`Create${string}Input`>;
export declare const getObjectUpdateInput: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusInputObjectTypeDef<`Update${string}Input`>;
export declare const getUpdateInput: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusInputObjectTypeDef<`Update${string}Input`>;
export declare const getDeleteInput: (name: string) => import("nexus/dist/core").NexusInputObjectTypeDef<`Delete${string}Input`>;
export declare const getReferenceListInput: (name: string) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}ReferenceListInput`>;
export declare const getReferenceInput: (name: string) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}ReferenceInput`>;
export declare const getCollectionInput: (name: string) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}CollectionInput`>;
export declare const getFieldWhereInput: (type: FirestoreFieldType | string) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
export declare const createDefaultWhereInputs: () => {
    intWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    stringWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    booleanWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    idWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    dateWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
    fileWhereInput: import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
};
export declare const getWhereInput: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>;
