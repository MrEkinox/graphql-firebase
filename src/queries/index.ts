import { queryField, idArg } from "nexus";
import { FirestoreTypeOptions } from "..";
import { getCollection, getParents } from "../mutations";
import { firstLowercase, getParentIdLabel, plural } from "../utils";

export const getQuery = ({ name, ...options }: FirestoreTypeOptions) => {
  const parentIds = getParentIdLabel(options.parents);

  const parentIdArgs = parentIds?.reduce(
    (acc, id) => ({ ...acc, [id]: idArg({ required: true }) }),
    {}
  );

  return queryField(firstLowercase(name), {
    ...options,
    // @ts-ignore
    type: name,
    args: { ...parentIdArgs, id: idArg({ required: true }) },
    resolve: async (_, { id, ...input }, ctx, info) => {
      const parents = getParents(name, options.parents, info.schema, input);
      const collection = getCollection(parents);

      const ref = collection.doc(id);

      const snapshot = await ref.get();

      return snapshot.data();
    },
  });
};

export const getAllQuery = ({ name, ...options }: FirestoreTypeOptions) => {
  const parentIds = getParentIdLabel(options.parents);

  const parentIdArgs = parentIds?.reduce(
    (acc, id) => ({ ...acc, [id]: idArg({ required: true }) }),
    {}
  );

  return queryField((t) => {
    t.collection(plural(name), {
      ...options,
      // @ts-ignore
      type: name,
      parents: options.parents,
      additionalArgs: parentIdArgs,
    });
  });
};
