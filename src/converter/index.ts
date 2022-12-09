import { firestore } from "firebase-admin";
import { GraphQLSchema } from "graphql";
import {
  uploadFile,
  UploadFileInputType,
  UploadFileListInputType,
} from "../file";
import async from "async";
import { FirestoreField, getSchemaFields } from "../utils";
import { getCollection, getParents } from "../mutations";

export interface ReferenceInput {
  link?: string | null;
  createAndLink?: Record<string, any> | null;
}

export interface ReferenceListInput {
  add?: string[] | null;
  createAndAdd?: Record<string, any>[] | null;
  remove?: string[] | null;
}

export interface CollectionInput {
  createAndAdd?: Record<string, any>[] | null;
  update?: Record<string, any>[] | null;
  delete?: string[] | null;
}

export class Converter {
  private schema: GraphQLSchema;
  private batch: firestore.WriteBatch;

  constructor(schema: GraphQLSchema, batch: firestore.WriteBatch) {
    this.schema = schema;
    this.batch = batch;
  }

  async toFirebase(
    name: string,
    newData: Record<string, any>,
    parentRef: firestore.DocumentReference,
    created?: boolean
  ) {
    const fields = getSchemaFields(name, this.schema);

    const resultArray = await Promise.all(
      fields.map(async (field) => {
        let fieldData = newData[field.name];

        if (typeof fieldData === "undefined") return {};

        if (field.type === "Reference") {
          fieldData = await this.convertReference(field, fieldData);
        } else if (field.type === "ReferenceList") {
          await this.convertReferenceList(field, fieldData, parentRef);
          return {};
        } else if (field.type === "Collection") {
          await this.convertCollection(field, fieldData, parentRef);
          return {};
        } else if (field.type === "File") {
          fieldData = await this.fileToFirestore(fieldData);
        } else if (field.type === "FileList") {
          await this.fileListToFirestore(field, fieldData, parentRef);
          return {};
        }

        return { [field.name]: fieldData };
      })
    );

    return resultArray.reduce((acc, cur) => ({ ...acc, ...cur }), {
      id: parentRef.id,
      updatedAt: new Date(),
      ...(created && { createdAt: new Date() }),
    });
  }

  private async convertCollection(
    { name, target }: FirestoreField,
    input: CollectionInput,
    parentRef: firestore.DocumentReference
  ) {
    const ref = parentRef.collection(name);

    await async.map(input?.createAndAdd || [], async (data2) => {
      if (!target) throw new Error(`·no target found for field ${name}`);
      const docRef = ref.doc();
      const data = await this.toFirebase(target, data2, docRef, true);
      this.batch.set(docRef, data);
      return docRef;
    });

    await async.map(input?.update || [], async (data2) => {
      if (!target) throw new Error(`·no target found for field ${name}`);
      const docRef = ref.doc(data2.id);
      const data = await this.toFirebase(target, data2.fields, docRef);
      this.batch.update(docRef, data);
      return docRef;
    });

    await async.map(input?.delete || [], async (id) => {
      const docRef = ref.doc(id);
      this.batch.delete(docRef);
      return docRef;
    });
  }

  private async convertReference(
    { target }: FirestoreField,
    input: ReferenceInput | null
  ) {
    if (!target) return null;
    const createAndLink = input?.createAndLink;
    const parents = getParents(target, [], this.schema);
    const collection = getCollection(parents);

    if (createAndLink) {
      const docRef = collection.doc();
      const data = await this.toFirebase(target, createAndLink, docRef, true);
      this.batch.set(docRef, data);
      return docRef;
    }
    if (input?.link) {
      return collection.doc(input.link);
    }
    return null;
  }

  private async convertReferenceList(
    field: FirestoreField,
    input: ReferenceListInput,
    ref: firestore.DocumentReference
  ) {
    if (!field.target)
      throw new Error(`·no target found for field ${field.name}`);
    const parents = getParents(field.target, [], this.schema);
    const collection = getCollection(parents);

    const created = await async.map(input.createAndAdd || [], async (data2) => {
      if (!field.target)
        throw new Error(`·no target found for field ${field.name}`);
      const ref = collection.doc();
      const data = await this.toFirebase(field.target, data2, ref, true);
      this.batch.set(ref, data);

      return ref;
    });

    if (created.length) {
      this.batch.set(
        ref,
        { [field.name]: firestore.FieldValue.arrayUnion(...created) },
        { merge: true }
      );
    }

    const addRef = (input.add || []).map((id) => collection.doc(id));

    if (addRef.length)
      this.batch.set(
        ref,
        { [field.name]: firestore.FieldValue.arrayUnion(...addRef) },
        { merge: true }
      );

    const removeRef = (input.remove || []).map((id) => collection.doc(id));

    if (removeRef.length) {
      this.batch.update(ref, {
        [field.name]: firestore.FieldValue.arrayRemove(...removeRef),
      });
    }
  }

  fileListToFirestore = async (
    field: FirestoreField,
    input: UploadFileListInputType,
    ref: firestore.DocumentReference
  ) => {
    const { link = [], add = [], remove = [] } = input;
    const addedFiles = await async.map(add || [], uploadFile);

    if (addedFiles.length)
      this.batch.set(
        ref,
        { [field.name]: firestore.FieldValue.arrayUnion(...addedFiles) },
        { merge: true }
      );

    if (link.length)
      this.batch.set(
        ref,
        { [field.name]: firestore.FieldValue.arrayUnion(...link) },
        { merge: true }
      );

    if (remove.length)
      this.batch.update(ref, {
        [field.name]: firestore.FieldValue.arrayRemove(...remove),
      });
  };

  fileToFirestore = async (
    input: UploadFileInputType | null
  ): Promise<string | null> => {
    if (input?.upload) {
      return uploadFile(input.upload);
    }
    if (input?.link) {
      return input.link;
    }
    return null;
  };
}
