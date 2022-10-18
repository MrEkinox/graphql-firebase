import { queryField, idArg, arg } from "nexus";
import {
  firstLowercase,
  getParentIds,
  getParentLabelValues,
  getTarget,
  getTargetCollection,
  plural,
} from "../utils";
import {
  collectionFromFirestore,
  collectionTargetFromFirestore,
} from "../converter/collection";
import { ParsedCollectionOptions } from "../parser";

const getQuery = (collection: ParsedCollectionOptions) => {
  const parentLabelIds = getParentIds(collection.parent);

  const parentIdArgs = getParentLabelValues(parentLabelIds, () =>
    idArg({ required: true })
  );

  return queryField(firstLowercase(collection.name), {
    deprecation: collection.deprecation,
    authorize: collection.authorize,
    description: collection.description,
    // @ts-ignore
    type: collection.name,
    args: { ...parentIdArgs, id: idArg({ required: true }) },
    resolve: async (_, { id, ...input }) => {
      const ids: string[] = parentLabelIds.map((label) => input[label]);

      const parentIdsValue = getParentLabelValues(
        parentLabelIds,
        (_, index) => ids[index]
      );

      const target = getTarget(collection.name);
      const targetCollection = getTargetCollection(collection.name, ids);

      const targetRef = targetCollection.doc(id);

      const document = await targetRef.get();

      if (!document.exists) {
        throw new Error(`${collection.name} not found`);
      }

      return collectionTargetFromFirestore(
        document,
        target,
        undefined,
        parentIdsValue
      );
    },
  });
};

const getAllQuery = (collection: ParsedCollectionOptions) => {
  const { parent } = getTarget(collection.name);
  const parentLabelIds = getParentIds(parent);

  const parentIdArgs = getParentLabelValues(parentLabelIds, () =>
    idArg({ required: true })
  );

  return queryField((t) => {
    t.connectionField(plural(collection.name), {
      deprecation: collection.deprecation,
      authorize: collection.authorize,
      description: collection.description,
      // @ts-ignore
      type: collection.name,
      additionalArgs: {
        ...parentIdArgs,
        limit: arg({ type: "Int" }),
        offset: arg({ type: "Int" }),
        where: arg({ type: `${collection.name}WhereInput` }),
        orderBy: arg({ type: `${collection.name}OrderByInput` }),
      },
      resolve: async (root, { where, orderBy, ...input }, ctx, info) =>
        collectionFromFirestore(
          collection.name,
          input,
          where,
          orderBy,
          root,
          info
        ),
    });
  });
};

export const getQueries = (collection: ParsedCollectionOptions) => {
  const query = getQuery(collection);
  const allQuery = getAllQuery(collection);

  return { query, allQuery };
};
