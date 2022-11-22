import {
  Timestamp,
  WhereFilterOp,
  CollectionReference,
} from "firebase-admin/firestore";
import { ObjectString } from "../interfaces";
import { ParsedCollectionOptions } from "../parser";
import { getTargetCollection, ObjectReduce } from "../utils";

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

export type WhereFieldsInput =
  | ObjectString<ObjectString<any>>
  | ObjectString<any>;

export type WhereInput = WhereFieldsInput;

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

const isEqualityFilter = (type?: keyof WhereInputOperator | string) => {
  return (
    !!type &&
    [
      "lessThanOrEqualTo",
      "greaterThanOrEqualTo",
      "greaterThan",
      "lessThan",
    ].includes(type)
  );
};

export const whereFilterEquality = (whereInput: WhereInput, data: any) => {
  return ObjectReduce(
    whereInput,
    (acc, fieldName, value) => {
      if (acc === false) return false;
      const parsedData = data instanceof Timestamp ? data.toMillis() : data;
      const parsedValue = value instanceof Timestamp ? value.toMillis() : value;
      if (typeof parsedValue === "object" && !(parsedValue instanceof Array)) {
        const curData = data?.[fieldName];
        return whereFilterEquality(value, curData);
      }
      if (fieldName === "greaterThanOrEqualTo") {
        return parsedData >= parsedValue;
      }
      if (fieldName === "lessThanOrEqualTo") {
        return parsedData <= parsedValue;
      }
      if (fieldName === "lessThan") {
        return parsedData < parsedValue;
      }
      if (fieldName === "greaterThan") {
        return parsedData > parsedValue;
      }
      return acc;
    },
    true
  );
};

const whereObjectCollection = (
  parentName: string,
  fieldName: string,
  whereInput: WhereInput,
  collection: CollectionReference | FirebaseFirestore.Query
) => {
  return ObjectReduce(
    whereInput,
    (acc, operator, whereFieldInput) => {
      if (isEqualityFilter(operator)) return acc;
      if (whereFieldInput instanceof Array) {
        if (!whereFieldInput.length) return acc;
      } else if (whereFieldInput && typeof whereFieldInput === "object") {
        return whereObjectCollection(
          `${parentName}.${fieldName}`,
          operator,
          whereFieldInput,
          acc
        );
      }

      const whereOperator = getWhereType(operator);
      return acc.where(
        `${parentName}.${fieldName}`,
        whereOperator,
        whereFieldInput
      );
    },
    collection
  );
};

export const whereCollection = (
  target: ParsedCollectionOptions,
  collection: CollectionReference | FirebaseFirestore.Query,
  whereInput?: WhereInput,
  withoutID = false
): FirebaseFirestore.Query => {
  if (!whereInput) return collection;
  let curCollection = collection;

  return ObjectReduce(
    whereInput,
    (acc, fieldName, whereFieldInput) => {
      if (!whereFieldInput) return acc;

      const field = target.fields[fieldName];

      return ObjectReduce(
        whereFieldInput,
        (acc2, operator, value) => {
          if (typeof value === "undefined" || value === null) return acc2;
          if (value instanceof Array && !value.length) return acc2;
          if (isEqualityFilter(operator)) return acc2;

          if (field.type === "Object" && typeof value === "object") {
            return whereObjectCollection(fieldName, operator, value, acc2);
          }
          if (field.type === "Any" && typeof value === "object") {
            return whereObjectCollection(fieldName, operator, value, acc2);
          }
          if (typeof value === "object" && operator === "id") {
            const whereField = Object.keys(value).at(0);
            const whereID = Object.values(value).at(0);
            const whereOperator = getWhereType(whereField);
            if (!whereID) return acc2;

            if (field.type === "Pointer" && whereOperator) {
              const targetCollection = getTargetCollection(field.target, []);
              const targetDoc = targetCollection.doc(whereID);

              return acc2.where(fieldName, whereOperator, targetDoc);
            }
            if (field.type === "Relation") {
              const targetCollection = getTargetCollection(field.target, []);

              if (whereField === "equalTo") {
                const targetDoc = targetCollection.doc(whereID);
                return acc2.where(fieldName, "array-contains", targetDoc);
              }
              if (whereField === "in" && whereID instanceof Array) {
                const targetDocs = whereID.map((id) =>
                  targetCollection.doc(id)
                );
                return acc2.where(fieldName, "in", [
                  targetDocs,
                  Array.from(targetDocs).reverse(),
                ]);
              }
            }
          }
          if (operator === "exists") {
            console.log({ fieldName, operator, value });
            return acc2.where(fieldName, value ? "!=" : "==", undefined);
          }

          const whereOperator = getWhereType(operator);
          if (!whereOperator) return acc2;

          if (fieldName === "id") {
            if (withoutID) return acc2;
            return acc2.where("__name__", whereOperator, value);
          }
          return acc2.where(fieldName, whereOperator, value);
        },
        acc
      );
    },
    curCollection
  );
};
