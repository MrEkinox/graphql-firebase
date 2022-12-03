import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { arg, booleanArg, idArg, mutationField } from "nexus";
import { FirestoreTypeOptions } from "..";
import { Converter } from "../converter";
import { getCreateInput, getDeleteInput, getUpdateInput } from "../inputs";
import { firstLowercase, getParentIdLabel, plural } from "../utils";

export const getCollection = (
  name: string,
  parentIds?: Array<{ name: string; id: string }>
): firestore.CollectionReference => {
  const pluralName = plural(name);
  const ref = firestore().collection(pluralName);

  if (!parentIds?.length) return ref;

  const lastParent = parentIds.pop();
  if (!lastParent) {
    throw new Error(`no id found for ${name}`);
  }

  const parentCollection = getCollection(lastParent.name, parentIds);

  return parentCollection.doc(lastParent.id).collection(pluralName);
};

export const getParentIds = (parents?: string[], input?: Record<string, any>) =>
  parents?.map((parent) => ({
    name: parent,
    id: input?.[firstLowercase(`${parent}Id`)],
  }));

export const getCreateMutation = (options: FirestoreTypeOptions) => {
  const { name, ...field } = options;
  const createInput = getCreateInput(options);
  const parentIds = getParentIdLabel(options.parents);
  const idsArgs = parentIds?.reduce(
    (acc, cur) => ({ ...acc, [cur]: idArg({ required: true }) }),
    {}
  );

  return mutationField(`create${name}`, {
    ...field,
    // @ts-ignore
    type: name,
    args: { ...idsArgs, input: arg({ type: createInput, required: true }) },
    resolve: async (src, { input, ...ids }, ctx, info) => {
      const parentIds = getParentIds(options.parents, ids);
      const collection = getCollection(name, parentIds);

      const ref = collection.doc();
      const batch = firestore().batch();

      const converter = new Converter(info.schema, batch);
      const newData = await converter.toFirebase(name, input, ref);
      batch.set(ref, newData);

      await batch.commit();
      const snapshot = await ref.get();

      return snapshot.data();
    },
  });
};

export const getUpdateMutation = (options: FirestoreTypeOptions) => {
  const { name, ...field } = options;
  const updateInput = getUpdateInput(options);
  const parentIds = getParentIdLabel(options.parents);
  const idsArgs = parentIds?.reduce(
    (acc, cur) => ({ ...acc, [cur]: idArg({ required: true }) }),
    {}
  );

  return mutationField(`update${name}`, {
    ...field,
    // @ts-ignore
    type: name,
    args: {
      ...idsArgs,
      input: arg({ type: updateInput, required: true }),
      force: booleanArg(),
    },
    resolve: async (
      src,
      { force, input: { id, fields }, ...ids },
      ctx,
      info
    ) => {
      const parentIds = getParentIds(options.parents, ids);
      const collection = getCollection(name, parentIds);

      const ref = collection.doc(id);
      const batch = firestore().batch();
      const snapshot = await ref.get();

      if (!snapshot.exists && !force) {
        throw new Error("Object not found");
      }

      const converter = new Converter(info.schema, batch);
      const newData = await converter.toFirebase(name, fields, ref, snapshot);

      batch.set(ref, newData, { merge: true });

      await batch.commit();

      const newSnapshot = await ref.get();
      return newSnapshot.data();
    },
  });
};

export const getDeleteMutation = (options: FirestoreTypeOptions) => {
  const { name, ...field } = options;
  const parentIds = getParentIdLabel(options.parents);
  const idsArgs = parentIds?.reduce(
    (acc, cur) => ({ ...acc, [cur]: idArg({ required: true }) }),
    {}
  );

  const deleteInput = getDeleteInput(name);

  return mutationField(`delete${name}`, {
    ...field,
    type: "Boolean",
    args: {
      ...idsArgs,
      input: arg({ type: deleteInput, required: true }),
    },
    resolve: async (_, { input, ...ids }) => {
      const parentIds = getParentIds(options.parents, ids);
      const collection = getCollection(name, parentIds);

      const targetRef = collection.doc(input.id);

      await targetRef.delete();

      return true;
    },
  });
};
