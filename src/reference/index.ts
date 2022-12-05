import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";
import { getCollection, getParents } from "../mutations";

export const referenceResolver = async (
  target: string,
  isList: boolean,
  src,
  info: GraphQLResolveInfo
) => {
  const fields = fieldsList(info);
  const isOnlyId = fields.length === 1 && fields[0] === "id";

  const parents = getParents(target, [], info.schema);
  const collection = getCollection(parents);

  if (isList) {
    const refs: firestore.DocumentReference[] = src[info.fieldName];
    if (refs?.length) {
      if (isOnlyId) {
        return refs.map((ref) => ({ id: ref.id }));
      }
      const collectionRefs = refs.map((ref) => collection.doc(ref.id));
      const snapshot = await firestore().getAll(...collectionRefs);
      return snapshot.map((doc) => doc.data());
    }
    return [];
  }

  const ref: firestore.DocumentReference = src[info.fieldName];
  if (!ref) return null;
  if (isOnlyId) return { id: ref.id };
  const snapshot = await collection.doc(ref.id).get();
  return snapshot.data();
};
