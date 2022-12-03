import { firestore } from "firebase-admin";
import { FirestoreTypeOptions } from "..";
export declare const getCollection: (name: string, parentIds?: {
    name: string;
    id: string;
}[] | undefined) => firestore.CollectionReference;
export declare const getParentIds: (parents?: string[], input?: Record<string, any>) => {
    name: string;
    id: any;
}[] | undefined;
export declare const getCreateMutation: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
export declare const getUpdateMutation: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
export declare const getDeleteMutation: (options: FirestoreTypeOptions) => import("nexus/dist/core").NexusExtendTypeDef<"Mutation">;
