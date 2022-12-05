import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";

export const referenceResolver = async (
  fieldName: string,
  isList: boolean,
  src,
  info: GraphQLResolveInfo
) => {
  const fields = fieldsList(info);
  const isOnlyId = fields.length === 1 && fields[0] === "id";

  if (isList) {
    const refs: firestore.DocumentReference[] = src[fieldName];
    if (refs?.length) {
      if (isOnlyId) {
        return refs.map((ref) => ref.id);
      }
      const snapshot = await firestore().getAll(...refs);
      return snapshot.map((doc) => doc.data());
    }
    return [];
  }

  const ref: firestore.DocumentReference = src[fieldName];
  if (!ref) return null;
  if (isOnlyId) return ref.id;
  const snapshot = await ref.get();
  return snapshot.data();
};
