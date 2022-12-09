import { firestore } from "firebase-admin";
import { GraphQLSchema } from "graphql";
import { FirestoreTypeOptions } from "..";
export declare const getCollection: (parents?: Array<{
    name: string;
    id: string;
    fieldName: string;
}>, lastDoc?: firestore.DocumentReference) => firestore.CollectionReference;
export type CollectionParent = {
    name: string;
    id: string;
    fieldName: string;
};
export declare const getParents: (searchType: string, parents: string[] | undefined, schema: GraphQLSchema, input?: Record<string, any>) => {
    name: string;
    id: string;
    fieldName: string;
}[];
export declare const getParentIds: (parents: CollectionParent[]) => {};
export declare const getCreateMutation: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
export declare const getUpdateMutation: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
export declare const getDeleteMutation: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
