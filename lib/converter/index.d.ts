import { firestore } from "firebase-admin";
import { GraphQLSchema } from "graphql";
export interface ReferenceInput {
    link?: string | null;
    createAndLink?: Record<string, any> | null;
}
export interface ReferenceListInput {
    add?: string[] | null;
    createAndAdd?: Record<string, any>[] | null;
    remove?: string[] | null;
}
export interface CollectionInput {
    createAndAdd?: Record<string, any>[] | null;
    update?: Record<string, any>[] | null;
    delete?: string[] | null;
}
export declare class Converter {
    private schema;
    private batch;
    constructor(schema: GraphQLSchema, batch: firestore.WriteBatch);
    toFirebase(name: string, newData: Record<string, any>, parentRef: firestore.DocumentReference, snapshot?: firestore.DocumentSnapshot): Promise<{
        [x: string]: any;
    }>;
    private convertCollection;
    private convertReference;
    private convertReferenceList;
}
