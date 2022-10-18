import { PointerInput } from "../../interfaces";
import { firestore } from "firebase-admin";
import { WhereInput } from "../../where";
export declare const pointerToFirestore: (input: PointerInput | null, targetName: string, batch: firestore.WriteBatch) => Promise<firestore.DocumentReference<firestore.DocumentData> | null>;
export declare const pointerFromFirestore: (ref: firestore.DocumentReference, targetName: string, whereInput?: WhereInput) => Promise<any>;
