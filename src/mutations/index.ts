import { mutationField, arg, idArg, booleanArg } from "nexus";
import { firestore } from "firebase-admin";
import { targetToFirestore } from "../converter";
import { getParentLabelValues, getTarget, getTargetCollection } from "../utils";
import { ParsedCollectionOptions } from "../parser";
import { collectionTargetFromFirestore } from "../converter/collection";

const getCreateMutation = (
  collection: ParsedCollectionOptions,
  parentLabelIds: string[] = []
) => {
  const parentIdArgs = getParentLabelValues(parentLabelIds, () =>
    idArg({ required: true })
  );

  return mutationField(`create${collection.name}`, {
    deprecation: collection.deprecation,
    authorize: collection.authorize,
    description: collection.description,
    // @ts-ignore
    type: collection.name,
    args: {
      ...parentIdArgs,
      input: arg({ type: `Create${collection.name}Input`, required: true }),
    },
    resolve: async (_, { input, ...idsValue }) => {
      const ids: string[] = parentLabelIds.map((label) => idsValue[label]);
      await collection.beforeCreate?.(input, ids);

      const parentIdsValue = getParentLabelValues(
        parentLabelIds,
        (_, index) => ids[index]
      );

      const target = getTarget(collection.name);
      const targetCollection = getTargetCollection(collection.name, ids);
      const targetRef = targetCollection.doc();

      const batch = firestore().batch();

      const convertedData = await targetToFirestore(
        target,
        input,
        batch,
        targetRef
      );

      batch.set(targetRef, {
        id: targetRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...convertedData,
      });

      await batch.commit();

      const snapshot = await targetRef.get();

      return collectionTargetFromFirestore(
        snapshot,
        target,
        undefined,
        parentIdsValue
      );
    },
  });
};

const getUpdateMutation = (
  collection: ParsedCollectionOptions,
  parentLabelIds: string[] = []
) => {
  const parentIdArgs = getParentLabelValues(parentLabelIds, () =>
    idArg({ required: true })
  );

  return mutationField(`update${collection.name}`, {
    deprecation: collection.deprecation,
    authorize: collection.authorize,
    description: collection.description,
    // @ts-ignore
    type: collection.name,
    args: {
      ...parentIdArgs,
      input: arg({ type: `Update${collection.name}Input`, required: true }),
      force: booleanArg(),
    },
    resolve: async (_, { input, force, ...idsValue }) => {
      const ids: string[] = parentLabelIds.map((label) => idsValue[label]);
      await collection.beforeUpdate?.(input.id, input.fields, ids);

      const parentIdsValue = getParentLabelValues(
        parentLabelIds,
        (_, index) => ids[index]
      );

      const target = getTarget(collection.name);
      const targetCollection = getTargetCollection(collection.name, ids);
      const targetRef = targetCollection.doc(input.id);

      const firstSnapshot = await targetRef.get();

      if (!firstSnapshot.exists && !force) {
        throw new Error("Object not found");
      }

      const batch = firestore().batch();

      const convertedData = await targetToFirestore(
        target,
        input.fields,
        batch,
        targetRef,
        firstSnapshot
      );

      batch.set(
        targetRef,
        {
          id: targetRef.id,
          createdAt: new Date(),
          ...convertedData,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      await batch.commit();

      const lastSnapshot = await targetRef.get();

      return collectionTargetFromFirestore(
        lastSnapshot,
        target,
        undefined,
        parentIdsValue
      );
    },
  });
};

const getDeleteMutation = (
  collection: ParsedCollectionOptions,
  parentLabelIds: string[] = []
) => {
  const parentIdArgs = getParentLabelValues(parentLabelIds, () =>
    idArg({ required: true })
  );

  return mutationField(`delete${collection.name}`, {
    deprecation: collection.deprecation,
    authorize: collection.authorize,
    description: collection.description,
    type: "Boolean",
    args: {
      ...parentIdArgs,
      input: arg({ type: `Delete${collection.name}Input`, required: true }),
    },
    resolve: async (_, { input, ...idsValue }) => {
      const ids: string[] = parentLabelIds.map((label) => idsValue[label]);
      await collection.beforeDelete?.(input.id, ids);

      const targetCollection = getTargetCollection(collection.name, ids);
      const targetRef = targetCollection.doc(input.id);

      await targetRef.delete();

      return true;
    },
  });
};

export const getMutations = (
  collection: ParsedCollectionOptions,
  parentIds: string[] = []
) => {
  const createMutation = getCreateMutation(collection, parentIds);
  const updateMutation = getUpdateMutation(collection, parentIds);
  const deleteMutation = getDeleteMutation(collection, parentIds);

  return { createMutation, updateMutation, deleteMutation };
};
