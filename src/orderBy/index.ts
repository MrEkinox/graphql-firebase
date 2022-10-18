import { firestore } from "firebase-admin";
import { ObjectString } from "../interfaces";
import { ObjectReduce } from "../utils";

export enum OrderByEnum {
  asc = "asc",
  desc = "desc",
}

export const orderByCollection = (
  collection: firestore.CollectionReference,
  orderByInput?: ObjectString<OrderByEnum>
): firestore.CollectionReference => {
  if (!orderByInput) return collection;
  return ObjectReduce(
    orderByInput,
    (acc: typeof collection, fieldName, fieldOrder) => {
      return acc.orderBy(fieldName, fieldOrder);
    },
    collection
  );
};
