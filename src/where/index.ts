import { firestore } from "firebase-admin";
import { WhereFilterOp } from "firebase-admin/firestore";
import { GraphQLSchema } from "graphql";
import { getCollection, getParents } from "../mutations";
import chunk from "lodash/chunk";
import { FirestoreField, getSchemaFields, plural } from "../utils";

interface CollectionWhereInput {
  name: string;
  fieldName: string;
  parentFieldName?: string;
  input: Record<string, any>;
}

export type WhereInputOperator = {
  exists?: boolean;
  equalTo?: any;
  notEqualTo?: any;
  lessThan?: any;
  lessThanOrEqualTo?: any;
  greaterThan?: any;
  greaterThanOrEqualTo?: any;
  arrayContains?: any;
  in?: any[];
  notIn?: any[];
};

const getWhereType = (
  type?: keyof WhereInputOperator | string
): WhereFilterOp | undefined => {
  switch (type) {
    case "equalTo":
      return "==";
    case "notEqualTo":
      return "!=";
    case "lessThan":
      return "<";
    case "lessThanOrEqualTo":
      return "<=";
    case "greaterThan":
      return ">";
    case "greaterThanOrEqualTo":
      return ">=";
    case "in":
      return "in";
    case "notIn":
      return "not-in";
    case "arrayContains":
      return "array-contains";
  }
  return undefined;
};

export class WhereCollection {
  private schema: GraphQLSchema;
  private parentsIds: Record<string, string>;

  constructor(schema: GraphQLSchema, parentsIds: Record<string, string>) {
    this.schema = schema;
    this.parentsIds = parentsIds;
  }

  private async chunkQuery(collection: firestore.Query, ids: string[]) {
    const chunkIds = chunk(ids, 10);

    const allData = await Promise.all(
      chunkIds.map(async (id) => {
        const newCollection = collection.where("id", "in", id);
        return this.getData(newCollection);
      })
    );

    return allData.reduce(
      (acc, cur) => {
        const newCount = acc.count + cur.count;
        const newEdges = [...cur.edges, ...acc.edges];
        return { count: newCount, edges: newEdges };
      },
      { count: 0, edges: [] }
    );
  }

  private async getData(collection: firestore.Query) {
    const count = (await collection.count().get()).data().count;

    const data = await collection.get();

    const edges = data.docs.map((doc) => ({
      node: { id: doc.id, ...this.parentsIds, ...doc.data() },
    }));

    return { count, edges };
  }

  async get(whereInput: CollectionWhereInput[], collection: firestore.Query) {
    const ids = await this.getCollectionWhere(whereInput);

    if (ids.length) {
      if (ids.length <= 10) {
        const newCollection = collection.where("id", "in", ids);
        return this.getData(newCollection);
      }

      return this.chunkQuery(collection, ids);
    }
    return { count: 0, edges: [] };
  }

  getWhereInput = (
    type: string,
    input?: Record<string, any>,
    parentFieldName?: string,
    fieldName?: string
  ): CollectionWhereInput[] => {
    const fields = getSchemaFields(type, this.schema);
    const newInput = this.removeCollectionFields(
      type,
      input,
      fieldName,
      parentFieldName
    );

    return fields.reduce(
      (acc, field) => {
        const fieldInput = input?.[field.name];
        if (field.type === "Collection" && field.target && fieldInput) {
          const newParent = newInput ? fieldName : parentFieldName;
          const inField = this.getWhereInput(
            field.target,
            fieldInput,
            newParent,
            field.name
          );
          return [...acc, ...inField];
        }
        return acc;
      },
      newInput ? [newInput] : []
    );
  };

  private removeCollectionFields(
    name: string,
    input?: Record<string, any>,
    fieldName?: string,
    parentFieldName?: string
  ): CollectionWhereInput | undefined {
    const fields = getSchemaFields(name, this.schema);

    const newFields = fields.reduce((acc, field) => {
      const fieldInput = input?.[field.name];
      if (!fieldInput) return acc;

      if (field.type === "Collection" && field.target) {
        return acc;
      }
      return { ...acc, [field.name]: fieldInput };
    }, {});

    if (Object.keys(newFields).length) {
      return {
        name,
        input: newFields,
        parentFieldName,
        fieldName: fieldName || plural(name),
      };
    }
    return undefined;
  }

  private whereReferenceId = (
    field: FirestoreField,
    input: any,
    collection: firestore.Query
  ) => {
    const whereField = Object.keys(input).at(0);
    const whereOperator = getWhereType(whereField);

    const whereID = whereField && input[whereField];

    if (!whereField || !whereOperator || !field.target || !whereID)
      return collection;

    const parents = getParents(field.target, [], this.schema);
    const targetCollection = getCollection(parents);

    if (whereField === "in" && whereID instanceof Array) {
      const targetDocs = whereID.map((id) => targetCollection.doc(id));
      return collection.where(field.name, "in", targetDocs);
    }

    const targetDoc = targetCollection.doc(whereID);

    return collection.where(field.name, whereOperator, targetDoc);
  };

  private whereReferenceListId = (
    field: FirestoreField,
    input: any,
    collection: firestore.Query
  ) => {
    const whereField = Object.keys(input).at(0);
    const whereOperator = getWhereType(whereField);

    const whereID = whereField && input[whereField];

    if (!whereField || !whereOperator || !field.target || !whereID)
      return collection;

    const parents = getParents(field.target, [], this.schema);
    const targetCollection = getCollection(parents);

    if (whereField === "in" && whereID instanceof Array) {
      const targetDocs = whereID.map((id) => targetCollection.doc(id));
      const isIn = Array.from(targetDocs).reverse();
      return collection.where(field.name, "in", [targetDocs, isIn]);
    }

    const targetDoc = targetCollection.doc(whereID);

    if (whereField === "equalTo") {
      return collection.where(field.name, "array-contains", targetDoc);
    }
    return collection;
  };

  private whereObject = (
    parentName: string,
    fieldName: string,
    input: Record<string, any>,
    collection: firestore.Query
  ) => {
    return Object.keys(input).reduce((acc, operator) => {
      const inputValue = input[operator];
      const field = `${parentName}.${fieldName}`;
      if (typeof inputValue === "undefined") return acc;

      if (inputValue instanceof Array) {
        if (!inputValue.length) return acc;
      } else if (inputValue && typeof inputValue === "object") {
        return this.whereObject(field, operator, inputValue, acc);
      }

      if (operator === "exists") {
        return acc.where(field, inputValue ? "!=" : "==", null);
      }
      const whereOperator = getWhereType(operator);
      if (!whereOperator) return acc;
      return acc.where(field, whereOperator, inputValue);
    }, collection);
  };

  private whereFieldCollection = (
    field: FirestoreField,
    collection: firestore.Query,
    input: Record<string, WhereInputOperator>
  ): firestore.Query => {
    return Object.keys(input).reduce((acc, operator) => {
      const inputValue = input[operator];
      if (typeof inputValue === "undefined") return acc;

      if (operator === "exists") {
        return acc.where(field.name, inputValue ? "!=" : "==", null);
      }
      if (field.type === "Object" || field.type === "Any") {
        return this.whereObject(field.name, operator, inputValue, acc);
      }
      if (field.type === "Reference" && operator === "id") {
        return this.whereReferenceId(field, inputValue, acc);
      }
      if (field.type === "ReferenceList" && operator === "id") {
        return this.whereReferenceListId(field, inputValue, acc);
      }
      const whereOperator = getWhereType(operator);
      if (!whereOperator) return acc;

      return acc.where(field.name, whereOperator, inputValue);
    }, collection);
  };

  whereCollection = (
    whereInput: CollectionWhereInput,
    collection:
      | firestore.CollectionReference
      | firestore.CollectionGroup
      | firestore.Query
  ) => {
    const fields = getSchemaFields(whereInput.name, this.schema);

    return fields.reduce((acc, field) => {
      const fieldInput = whereInput.input?.[field.name];
      if (!fieldInput) return acc;
      if (field.type === "Collection") return acc;

      return this.whereFieldCollection(field, acc, fieldInput);
    }, collection as firestore.Query);
  };

  private async getCollectionWhere(
    whereInput: CollectionWhereInput[],
    ids: string[] = []
  ): Promise<string[]> {
    const where = whereInput.shift();
    if (!where) return ids;

    const collectionGroup = firestore().collectionGroup(where.fieldName);
    let collection = this.whereCollection(where, collectionGroup);

    if (ids.length) {
      collection = collection.where("id", "in", ids);
    }
    const snapshot = await collection.get();

    const snapIds = snapshot.docs.map((doc) => {
      const path = doc.ref.path.split("/");
      const index = where.parentFieldName
        ? path.indexOf(where.parentFieldName)
        : path.indexOf(where.fieldName);
      return path.at(index + 1) || "";
    });

    if (snapIds.length) {
      const newIds = [...ids, ...snapIds].reduce((acc, id) => {
        if (acc.find((id2) => id2 === id)) return acc;
        return [...acc, id];
      }, [] as string[]);
      return this.getCollectionWhere(whereInput, newIds);
    }
    return ids;
  }
}
