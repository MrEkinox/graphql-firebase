import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";
import { getCollection, getParentIds } from "../mutations";
import { firstLowercase } from "../utils";
import { WhereCollection } from "../where";

export const collectionResolver = async (
  type: string,
  parents: string[],
  src,
  { where, limit, offset, ...input },
  info: GraphQLResolveInfo
) => {
  const parentId = src && {
    ...src,
    [`${firstLowercase(info.parentType.name)}Id`]: src.id,
  };
  const parentIds = getParentIds(parents, { ...input, ...parentId });

  let collection: firestore.Query = getCollection(type, parentIds);

  const fields = fieldsList(info, { path: "edges.node" });
  if (fields.length) collection = collection.select(...fields);

  if (where) {
    const whereCollection = new WhereCollection(info.schema);
    const whereInput = whereCollection.getWhereInput(type, where, type);

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

  const count = (await collection.count().get()).data().count;

  const data = await collection.get();

  const edges = data.docs.map((doc) => ({
    node: { id: doc.id, ...parentId, ...doc.data() },
  }));

  return { count, edges };
};
