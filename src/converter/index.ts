import { FieldObjectOptions, ObjectString } from "../interfaces";
import { firestore } from "firebase-admin";
import { AsyncObjectReduce } from "../utils";
import { fileListToFireStore, fileToFirestore } from "./file/";
import { pointerToFirestore, pointerFromFirestore } from "./pointer/";
import { relationToFirestore, relationFromFirestore } from "./relation/";
import {
  collectionToFirestore,
  collectionWhereFromFirestore,
} from "./collection/";
import { ParsedCollectionOptions } from "../parser";
import { WhereInput } from "../where";
import async from "async";

export const targetToFirestore = (
  { fields }: ParsedCollectionOptions | FieldObjectOptions,
  data: ObjectString<any>,
  batch: firestore.WriteBatch,
  parentRef: firestore.DocumentReference,
  snapshot?: firestore.DocumentSnapshot
) => {
  const currentData = snapshot?.data();

  return AsyncObjectReduce(fields, async (acc, fieldName, fieldOptions) => {
    let fieldData = data?.[fieldName];
    const fieldLastData = currentData?.[fieldName];

    const { type } = fieldOptions;

    if (type === "Pointer") {
      const { target } = fieldOptions;
      fieldData = await pointerToFirestore(fieldData, target, batch);

      return { ...acc, [fieldName]: fieldData };
    }

    if (typeof fieldData === "undefined") {
      if (!currentData && typeof fieldOptions["defaultValue"] !== "undefined")
        return { ...acc, [fieldName]: fieldOptions["defaultValue"] };
      return acc;
    }

    if (type === "File") {
      if (fieldOptions.list)
        fieldData = await fileListToFireStore(fieldData, fieldLastData);
      else fieldData = await fileToFirestore(fieldData, fieldLastData);

      return { ...acc, [fieldName]: fieldData };
    }

    if (type === "Object") {
      if (fieldData instanceof Array) {
        fieldData = await async.map(fieldData, async (data) =>
          targetToFirestore(fieldOptions, data, batch, parentRef, snapshot)
        );
      } else {
        fieldData = await targetToFirestore(
          fieldOptions,
          fieldData,
          batch,
          parentRef,
          snapshot
        );
      }
    }

    if (type === "Relation") {
      const { target } = fieldOptions;
      fieldData = await relationToFirestore(
        fieldData,
        target,
        batch,
        fieldLastData
      );
    }
    if (type === "Collection") {
      const { target } = fieldOptions;
      await collectionToFirestore(fieldData, target, batch, parentRef);

      return acc;
    }

    if (type === "Boolean" || type === "String" || type === "Number") {
      return { ...acc, [fieldName]: fieldData };
    }

    return { ...acc, [fieldName]: fieldData || null };
  });
};

export const targetFromFirestore = async (
  { fields }: ParsedCollectionOptions | FieldObjectOptions,
  currentData: any,
  whereInput?: WhereInput,
  parentIds: ObjectString = {}
) => {
  return AsyncObjectReduce(
    fields,
    async (acc, fieldName, fieldOptions) => {
      const { type } = fieldOptions;
      const whereFieldsInput = whereInput?.[fieldName];

      if (type === "Collection" && whereFieldsInput) {
        const { target } = fieldOptions;
        await collectionWhereFromFirestore(target, parentIds, whereFieldsInput);
      }

      let fieldData = currentData?.[fieldName];
      if (typeof fieldData === "undefined") return acc;

      if (type === "Pointer") {
        const { target } = fieldOptions;
        fieldData = await pointerFromFirestore(
          fieldData,
          target,
          whereFieldsInput
        );
      }

      if (type === "Object") {
        if (fieldData instanceof Array) {
          fieldData = await async.map(fieldData, async (data) =>
            targetFromFirestore(fieldOptions, data, whereInput, parentIds)
          );
        } else {
          fieldData = await targetFromFirestore(
            fieldOptions,
            fieldData,
            whereInput,
            parentIds
          );
        }
      }

      if (type === "Relation") {
        const { target } = fieldOptions;
        fieldData = await relationFromFirestore(
          fieldData,
          target,
          whereFieldsInput
        );
      }

      return { ...acc, [fieldName]: fieldData };
    },
    {}
  );
};
