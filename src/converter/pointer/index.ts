import { ObjectString, PointerInput } from "../../interfaces";
import { firestore } from "firebase-admin";
import { getTarget, getTargetCollection } from "../../utils";
import { targetToFirestore } from "..";
import { whereCollection, WhereInput } from "../../where";
import { collectionTargetFromFirestore } from "../collection";

export const pointerToFirestore = async (
  input: PointerInput | null,
  targetName: string,
  batch: firestore.WriteBatch
) => {
  const target = getTarget(targetName);
  const targetCollection = getTargetCollection(targetName, []);

  if (input?.createAndLink) {
    const docRef = targetCollection.doc();
    const data = await targetToFirestore(
      target,
      input.createAndLink,
      batch,
      docRef
    );
    batch.set(docRef, {
      ...data,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return docRef;
  }
  if (input?.link) {
    return targetCollection.doc(input.link);
  }

  return null;
};

export const pointerFromFirestore = async (
  ref: firestore.DocumentReference,
  targetName: string,
  whereInput?: WhereInput
) => {
  const target = getTarget(targetName);
  const targetCollection = getTargetCollection(targetName, []);

  const collection = whereCollection(
    target,
    targetCollection,
    whereInput
  ).where("__name__", "==", ref);

  const documents = await collection.limit(1).get();

  const document = documents.docs[0];

  if (whereInput && !document) throw new Error("no where");

  return collectionTargetFromFirestore(document, target);
};
