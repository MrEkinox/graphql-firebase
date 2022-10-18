import { firestore } from "firebase-admin";
import { ObjectString } from "../interfaces";
export declare enum OrderByEnum {
    asc = "asc",
    desc = "desc"
}
export declare const orderByCollection: (collection: firestore.CollectionReference, orderByInput?: ObjectString<OrderByEnum>) => firestore.CollectionReference;
