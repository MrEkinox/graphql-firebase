import { GraphQLSchema } from "graphql";
import { UploadFileInputType, UploadFileListInputType } from "../file";
import { FirestoreField } from "../utils";
import { firestore } from "firebase-admin";
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
    toFirebase(name: string, newData: Record<string, any>, parentRef: firestore.DocumentReference, created?: boolean): Promise<{
        [x: string]: any;
    }>;
    private convertCollection;
    private convertReference;
    private convertReferenceList;
    fileListToFirestore: (field: FirestoreField, input: UploadFileListInputType, ref: firestore.DocumentReference) => Promise<void>;
    fileToFirestore: (input: UploadFileInputType | null) => Promise<string | null>;
}
