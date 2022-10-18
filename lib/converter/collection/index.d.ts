import { firestore } from "firebase-admin";
import { CollectionInput, FieldObjectOptions, ObjectString } from "../../interfaces";
import { WhereFieldsInput, WhereInput } from "../../where";
import { OrderByEnum } from "../../orderBy";
import { ParsedCollectionOptions } from "../../parser";
import { GraphQLResolveInfo } from "graphql";
export declare const collectionToFirestore: (input: CollectionInput | null, targetName: string, batch: firestore.WriteBatch, parentRef: firestore.DocumentReference) => Promise<void>;
export declare const collectionWhereFromFirestore: (targetName: string, parentIds: ObjectString, whereInput: WhereInput) => Promise<void>;
export declare const collectionTargetFromFirestore: (snapshot: firestore.DocumentSnapshot<firestore.DocumentData>, collection: ParsedCollectionOptions | FieldObjectOptions, whereInput?: WhereFieldsInput, parentIds?: ObjectString) => Promise<any>;
interface PaginationOptions {
    limit: number;
    offset: number;
}
export declare const collectionFromFirestore: (targetName: string, input: PaginationOptions, whereInput?: WhereInput, orderByInput?: ObjectString<OrderByEnum>, root?: any, info?: GraphQLResolveInfo) => Promise<any>;
export {};
