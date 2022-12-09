import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { fieldsList } from "graphql-fields-list";
import { getCollection, getParentIds, getParents } from "../mutations";
import { firstLowercase } from "../utils";
import { orderByCreatedAt, WhereCollection } from "../where";

export const collectionResolver = async (
  type: string,
  fieldName: string,
  parents: string[],
  src,
  { where, limit, offset, ...input },
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

  const fields = fieldsList(info, { path: "edges.node" });
  if (fields.length) collection = collection.select(...fields);

  if (where) {
    const whereCollection = new WhereCollection(info.schema, parentsIds);
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

  const count = (await collection.count().get()).data().count;

  const data = await collection.get();

  const edges = orderByCreatedAt(
    data.docs.map((doc) => ({
      node: { id: doc.id, ...parentsIds, ...doc.data() },
    }))
  );

  return { count, edges };
};
