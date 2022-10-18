import { FieldObjectOptions, ObjectString } from "../interfaces";
import { firestore } from "firebase-admin";
import { ParsedCollectionOptions } from "../parser";
import { WhereInput } from "../where";
export declare const targetToFirestore: ({ fields }: ParsedCollectionOptions | FieldObjectOptions, data: ObjectString<any>, batch: firestore.WriteBatch, parentRef: firestore.DocumentReference, snapshot?: firestore.DocumentSnapshot) => any;
export declare const targetFromFirestore: ({ fields }: ParsedCollectionOptions | FieldObjectOptions, currentData: any, whereInput?: WhereInput, parentIds?: ObjectString) => Promise<any>;
