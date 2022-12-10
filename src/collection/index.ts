import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { getCollection, getParentIds, getParents } from "../mutations";
import { OrderByEnum } from "../scalars";
import { firstLowercase, hasCountField, hasEdgeField } from "../utils";
import { sortOrderBy, WhereCollection } from "../where";

interface CollectionInput {
  where?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: Record<string, OrderByEnum>;
}

export const collectionResolver = async (
  type: string,
  fieldName: string,
  parents: string[],
  src,
  { where, limit, offset, orderBy, ...input }: CollectionInput,
  info: GraphQLResolveInfo
) => {
  const allInputs = {
    ...input,
    ...(src && {
      ...src,
      [`${firstLowercase(info.parentType.name)}Id`]: src.id,
    }),
  };
  const parentFields = getParents(type, parents, info.schema, allInputs);

  const parentsIds = getParentIds(parentFields);

  let collection: firestore.Query = getCollection(parentFields);

  if (where) {
    const whereCollection = new WhereCollection(
      info.schema,
      parentsIds,
      orderBy
    );
    const whereInput = whereCollection.getWhereInput(
      type,
      where,
      parentFields[0].fieldName || fieldName,
      parentFields.pop()?.fieldName
    );

    const firstWhere = whereInput[0];
    if (firstWhere?.name === type) {
      collection = whereCollection.whereCollection(firstWhere, collection);
      whereInput.shift();
    }
    if (whereInput.length) {
      return whereCollection.get(whereInput, collection);
    }
  }

  if (typeof limit === "number") {
    collection = collection.limit(limit);
  }
  if (typeof offset === "number") {
    collection = collection.offset(offset);
  }

  const count = hasCountField(info)
    ? (await collection.count().get()).data().count
    : 0;

  const documents = hasEdgeField(info) ? (await collection.get()).docs : [];

  const edges = sortOrderBy(
    documents.map((doc) => ({
      node: { id: doc.id, ...parentsIds, ...doc.data() },
    })),
    orderBy
  );

  return { count, edges };
};
