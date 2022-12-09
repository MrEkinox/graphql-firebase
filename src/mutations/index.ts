import { firestore } from "firebase-admin";
import { GraphQLSchema } from "graphql";
import { arg, booleanArg, idArg, mutationField } from "nexus";
import { FirestoreTypeOptions } from "..";
import { Converter } from "../converter";
import { getCreateInput, getDeleteInput, getUpdateInput } from "../inputs";
import {
  firstLowercase,
  getParentIdLabel,
  getSchemaFields,
  isOnlyIdField,
  plural,
} from "../utils";

export const getCollection = (
  parents?: Array<{ name: string; id: string; fieldName: string }>,
  lastDoc?: firestore.DocumentReference
): firestore.CollectionReference => {
  const firstParent = parents?.[0];

  if (!firstParent) throw new Error("no parent found");

  if (firstParent.id) {
    const ref = (lastDoc || firestore())
      .collection(firstParent.fieldName)
      .doc(firstParent.id);
    const newParents = parents.slice(1);
    return getCollection(newParents, ref);
  } else {
    return (lastDoc || firestore()).collection(firstParent.fieldName);
  }
};

export type CollectionParent = { name: string; id: string; fieldName: string };

export const getParents = (
  searchType: string,
  parents: string[] = [],
  schema: GraphQLSchema,
  input?: Record<string, any>
) => {
  if (!parents.length)
    return [{ name: searchType, id: "", fieldName: plural(searchType) }];
  return parents.reduce((acc, cur, index) => {
    const nextParent = parents[index + 1];
    const fields = getSchemaFields(cur, schema);
    const search = nextParent || searchType;
    const exists = fields.find((field) => field.target === search);

    if (exists) {
      const id = input?.[firstLowercase(`${search}Id`)];
      const newParent = { name: search, id, fieldName: exists.name };
      if (acc.length) {
        return [...acc, newParent];
      }
      const parentId = input?.[firstLowercase(`${cur}Id`)];
      const firstParent = { name: cur, id: parentId, fieldName: plural(cur) };
      return [...acc, firstParent, newParent];
    }

    return acc;
  }, [] as CollectionParent[]);
};

export const getParentIds = (parents: CollectionParent[]) => {
  return parents
    .filter((cur) => cur.id)
    .reduce(
      (acc, cur) => ({ ...acc, [firstLowercase(`${cur.name}Id`)]: cur.id }),
      {}
    );
};

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
      const parents = getParents(name, options.parents, info.schema, ids);
      const parentsIds = getParentIds(parents);
      const collection = getCollection(parents);

      const ref = collection.doc();
      const batch = firestore().batch();

      const converter = new Converter(info.schema, batch);
      const newData = await converter.toFirebase(name, input, ref);
      batch.set(ref, { ...newData, ...parentsIds }, { merge: true });

      await batch.commit();

      const isOnlyId = isOnlyIdField(info);
      if (isOnlyId) return { id: ref.id };

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
      const parents = getParents(name, options.parents, info.schema, ids);
      const parentsIds = getParentIds(parents);
      const collection = getCollection(parents);

      const ref = collection.doc(id);
      const batch = firestore().batch();

      const converter = new Converter(info.schema, batch);
      const newData = await converter.toFirebase(name, fields, ref, true);

      batch.set(ref, { ...newData, ...parentsIds }, { merge: true });

      await batch.commit();

      const isOnlyId = isOnlyIdField(info);
      if (isOnlyId) return { id: ref.id };

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
    resolve: async (_, { input, ...ids }, ctx, info) => {
      const parents = getParents(name, options.parents, info.schema, ids);
      const collection = getCollection(parents);

      const targetRef = collection.doc(input.id);

      await targetRef.delete();

      return true;
    },
  });
};
