import * as admin from "firebase-admin";
import async from "async";
import { ObjectString } from "../interfaces";
import { parsedCollections } from "..";
import { NexusInputObjectTypeDef } from "nexus/dist/core";

export const hasType = (
  typeName: string,
  values: ObjectString<NexusInputObjectTypeDef<any>>
) => {
  return !!Object.keys(values).find((key) => {
    const value = values[key];
    return value.name === typeName;
  });
};

export const ObjectReduce = <T, U>(
  object: ObjectString<T>,
  callback: (acc: any, key: string, value: T, index: number) => any,
  initialValue: any = {}
): U =>
  Object.keys(object).reduce(
    (acc, key, index) => callback(acc, key, object[key], index),
    initialValue
  );

export const ObjectMap = <T>(
  object: ObjectString<T>,
  callback: (key: string, value: T, index: number) => any
) => Object.keys(object).map((key, index) => callback(key, object[key], index));

export const ObjectSome = <T>(
  object: ObjectString<T>,
  callback: (key: string, value: T, index: number) => boolean
) =>
  Object.keys(object).some((key, index) => callback(key, object[key], index));

export const ObjectEach = <T>(
  object: ObjectString<T>,
  callback: (key: string, value: T, index: number) => any
) =>
  Object.keys(object).forEach((key, index) =>
    callback(key, object[key], index)
  );

export const AsyncObjectReduce = <T>(
  object: ObjectString<T>,
  callback: (acc: any, key: string, value: T) => any,
  initialValue?: any
): any =>
  async.reduce(Object.keys(object), initialValue, async (acc, key) =>
    callback(acc, key, object[key])
  );

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const firstLowercase = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const plural = (str: string) => {
  if (str.endsWith("y"))
    return str.charAt(0).toLowerCase() + str.substring(1, -1) + "ies";
  return str.charAt(0).toLowerCase() + str.slice(1) + "s";
};

export const getTarget = (name: string) => {
  return parsedCollections[name];
};

const getTargetName = (name: string, parent = "") => {
  return name.replace(parent, "");
};

export const getCollectionName = (name: string, parent?: string) => {
  const targetName = getTargetName(name, parent);

  return plural(targetName);
};

export const getTargetCollection = (
  name: string,
  ids: string[]
): admin.firestore.CollectionReference => {
  const target = getTarget(name);
  const collectionName = getCollectionName(name, target.parent);

  const ref = admin.firestore().collection(collectionName);

  if (target.parent) {
    const rightId = ids.pop();
    if (!rightId) {
      throw new Error(`no id found for ${target.parent}`);
    }

    const parentCollection = getTargetCollection(target.parent, ids);

    return parentCollection.doc(rightId).collection(collectionName);
  }

  return ref;
};

export const getParentIds = (
  name?: string,
  currentIds: string[] = []
): string[] => {
  if (!name) return [];

  const target = getTarget(name);
  const targetName = getTargetName(name, target.parent);
  const newId = `${firstLowercase(targetName)}Id`;

  currentIds = [...currentIds, newId];

  const inParent = getParentIds(target.parent, currentIds);

  return [...inParent, newId];
};

export const getParentLabelValues = (
  labels: string[],
  callback: (label: string, index: number) => any,
  initialValue?: ObjectString
) => {
  return labels.reduce((acc, label, index) => {
    const value = callback(label, index);
    if (value) return { ...acc, [label]: callback(label, index) };
    return acc;
  }, initialValue);
};
