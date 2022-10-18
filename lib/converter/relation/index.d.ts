import { firestore } from "firebase-admin";
import { RelationInput } from "../../interfaces";
import { WhereInput } from "../../where";
export declare const relationToFirestore: (input: RelationInput, targetName: string, batch: firestore.WriteBatch, currentData?: firestore.DocumentReference[]) => Promise<firestore.DocumentReference<firestore.DocumentData>[]>;
export declare const relationFromFirestore: (refs: firestore.DocumentReference[], targetName: string, whereInput?: WhereInput) => Promise<any[]>;
