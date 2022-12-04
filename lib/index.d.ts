import { NexusEnumTypeConfig, NexusObjectTypeConfig, NexusScalarTypeConfig, SchemaConfig } from "nexus/dist/core";
export { GraphQLFirebasePlugin } from "./plugin";
export declare const enumType: (options: NexusEnumTypeConfig<string>) => (import("nexus/dist/core").NexusEnumTypeDef<string> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>)[];
export declare const scalarType: (options: NexusScalarTypeConfig<string>) => (import("nexus/dist/core").NexusScalarTypeDef<string> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>)[];
export declare const objectType: (options: NexusObjectTypeConfig<string>) => (import("nexus/dist/core").NexusObjectTypeDef<string> | import("nexus/dist/core").NexusInputObjectTypeDef<`Create${string}Input`> | import("nexus/dist/core").NexusInputObjectTypeDef<`Update${string}Input`> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`>)[];
export interface FirestoreTypeOptions extends NexusObjectTypeConfig<string> {
    parents?: string[];
}
export declare const firestoreType: (options: FirestoreTypeOptions) => (import("nexus/dist/core").NexusObjectTypeDef<string> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}ReferenceListInput`> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}ReferenceInput`> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}CollectionInput`> | import("nexus/dist/core").NexusInputObjectTypeDef<`${string}WhereInput`> | import("nexus/dist/core").NexusExtendTypeDef<"Mutation"> | import("nexus/dist/core").NexusExtendTypeDef<"Query">)[];
export declare const makeSchema: (config: SchemaConfig & {
    debug?: boolean;
}) => import("nexus/dist/core").NexusGraphQLSchema;
