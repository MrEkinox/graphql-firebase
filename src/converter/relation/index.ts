import { firestore } from "firebase-admin";
import { targetFromFirestore, targetToFirestore } from "..";
import { ObjectString, RelationInput } from "../../interfaces";
import async from "async";
import { getTarget, getTargetCollection } from "../../utils";
import { whereCollection, WhereFieldsInput, WhereInput } from "../../where";
import { collectionTargetFromFirestore } from "../collection";

export const relationToFirestore = async (
  input: RelationInput,
  targetName: string,
  batch: firestore.WriteBatch,
  currentData: firestore.DocumentReference[] = []
) => {
  const target = getTarget(targetName);
  const targetCollection = getTargetCollection(targetName, []);

  const created = await async.map(input.createAndAdd || [], async (data2) => {
    const targetRef = targetCollection.doc();
    const data = await targetToFirestore(target, data2, batch, targetRef);
    batch.set(targetRef, {
      ...data,
      id: targetRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return targetRef;
  });

  const addRef = (input.add || []).map((id) => targetCollection.doc(id));

  return [...currentData, ...addRef, ...created].filter(
    (newData) => !input.remove?.includes(newData.id)
  );
};

export const relationFromFirestore = async (
  refs: firestore.DocumentReference[],
  targetName: string,
  whereInput?: WhereInput
) => {
  if (!refs.length) {
    if (whereInput) throw new Error("no where");
    return [];
  }
  const target = getTarget(targetName);
  const targetCollection = getTargetCollection(targetName, []);

  if (whereInput) {
    const collection = whereCollection(
      target,
      targetCollection,
      whereInput,
      true
    ).where("__name__", "in", refs);

    const documents = await collection.limit(1).get();

    if (!documents.size) throw new Error("no where");
  }

  const collection = targetCollection.where("__name__", "in", refs);

  const documents = await collection.get();

  return async.map(documents.docs, async (doc: typeof documents.docs[0]) =>
    collectionTargetFromFirestore(doc, target)
  );
};
