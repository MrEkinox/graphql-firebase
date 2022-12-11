import { firestore } from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { GraphQLResolveInfo, GraphQLSchema } from "graphql";
import { getCollection, getParents } from "../mutations";
import { isOnlyIdField } from "../utils";

const getRefCollection = (
  type: string,
  ref: DocumentReference | Record<string, any>,
  schema: GraphQLSchema
): DocumentReference => {
  if (ref instanceof DocumentReference) return ref;

  const parents = getParents(type, [], schema);
  const collection = getCollection(parents);

  return collection.doc(ref.id);
};

export const referenceResolver = async (
  type: string,
  isList: boolean,
  src,
  info: GraphQLResolveInfo
) => {
  const isOnlyId = isOnlyIdField(info);

  if (isList) {
    const refs: DocumentReference[] = src[info.fieldName];
    if (refs?.length) {
      if (isOnlyId) {
        return refs.map((ref) => ({ id: ref.id }));
      }
      const collectionRefs = refs.map((ref) =>
        getRefCollection(type, ref, info.schema)
      );
      const snapshot = await firestore().getAll(...collectionRefs);
      return snapshot.map((doc) => doc.data());
    }
    return [];
  }

  const ref: DocumentReference = src[info.fieldName];
  if (!ref) return null;
  if (isOnlyId) return { id: ref.id };

  const snapshot = await getRefCollection(type, ref, info.schema).get();
  return snapshot.data();
};
