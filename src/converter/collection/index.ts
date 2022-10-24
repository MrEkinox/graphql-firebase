import { firestore } from "firebase-admin";
import {
  CollectionInput,
  FieldObjectOptions,
  ObjectString,
} from "../../interfaces";
import {
  getCollectionName,
  getParentIds,
  getParentLabelValues,
  getTarget,
  getTargetCollection,
  plural,
} from "../../utils";
import async from "async";
import { targetFromFirestore, targetToFirestore } from "..";
import {
  whereCollection,
  WhereFieldsInput,
  whereFilterEquality,
  WhereInput,
} from "../../where";
import { orderByCollection, OrderByEnum } from "../../orderBy";
import { ParsedCollectionOptions } from "../../parser";
import { fieldsList, fieldsMap } from "graphql-fields-list";
import { GraphQLResolveInfo } from "graphql";

export const collectionToFirestore = async (
  input: CollectionInput | null,
  targetName: string,
  batch: firestore.WriteBatch,
  parentRef: firestore.DocumentReference
) => {
  const target = getTarget(targetName);
  const collectionName = getCollectionName(targetName, target.parent);

  const collectionRef = parentRef.collection(collectionName);

  await async.map(input?.createAndAdd || [], async (data2) => {
    const docRef = collectionRef.doc();
    const data = await targetToFirestore(target, data2, batch, docRef);
    batch.set(docRef, {
      ...data,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef;
  });

  await async.map(input?.update || [], async (data2) => {
    const docRef = collectionRef.doc(data2.id);
    const snapshot = await docRef.get();
    const data = await targetToFirestore(
      target,
      data2,
      batch,
      docRef,
      snapshot
    );
    batch.update(docRef, { ...data, updatedAt: new Date() });
    return docRef;
  });

  await async.map(input?.delete || [], async (id) => {
    const docRef = collectionRef.doc(id);
    batch.delete(docRef);
    return docRef;
  });
};

export const collectionWhereFromFirestore = async (
  targetName: string,
  parentIds: ObjectString,
  whereInput: WhereInput
) => {
  const target = getTarget(targetName);
  const ids = Object.values(parentIds);

  const collection = getTargetCollection(targetName, ids);

  const ref = whereCollection(target, collection, whereInput);

  const documents = await ref.get();

  if (whereInput && !documents.size) throw new Error("no where");
};

export const collectionTargetFromFirestore = async (
  snapshot: firestore.DocumentSnapshot<firestore.DocumentData>,
  collection: ParsedCollectionOptions | FieldObjectOptions,
  whereInput?: WhereFieldsInput,
  parentIds: ObjectString = {}
) => {
  const currentData = snapshot.data();

  const convertedData = await targetFromFirestore(
    collection,
    currentData,
    whereInput,
    parentIds
  );

  if (whereInput) {
    const whereResult = await whereFilterEquality(whereInput, currentData);
    if (!whereResult) throw new Error("no where");
  }

  return { ...convertedData, ...parentIds };
};

interface PaginationOptions {
  limit: number;
  offset: number;
}

export const collectionFromFirestore = async (
  targetName: string,
  input: PaginationOptions,
  whereInput?: WhereInput,
  orderByInput?: ObjectString<OrderByEnum>,
  root?: any,
  info?: GraphQLResolveInfo
): Promise<any> => {
  const target = getTarget(targetName);
  const parentLabelIds = getParentIds(target.parent);

  const ids: string[] = parentLabelIds.reduce(
    (acc, id) =>
      input[id] || root[id] ? [input[id] || root[id], ...acc] : acc,
    root ? [root.id] : []
  );

  const parentIdsValue = getParentLabelValues(
    parentLabelIds,
    (_, index) => ids[index]
  );

  const collection = getTargetCollection(targetName, ids);

  const listDocuments = await collection.listDocuments();

  const count = listDocuments.length;

  let ref = whereCollection(target, collection, whereInput);

  if (orderByInput) {
    ref = orderByCollection(collection, orderByInput);
  }

  if (input.limit) {
    ref = ref.limit(input.limit);
  }
  if (input.offset) {
    ref = ref.offset(input.offset);
  }

  if (info) {
    const fields = fieldsList(info, { path: "edges.node" });
    ref = ref.select(...fields);
  }

  const documents = await ref.get();

  const edges: any = await async.reduce(
    documents.docs,
    [] as any[],
    async (acc, doc: typeof documents.docs[0]) => {
      try {
        const node = await collectionTargetFromFirestore(
          doc,
          target,
          whereInput,
          { id: doc.id, ...parentIdsValue }
        );
        // @ts-ignore
        return [...acc, { cursor: doc.id, node }];
      } catch (error) {
        return acc;
      }
    }
  );

  return { count, edges };
};
