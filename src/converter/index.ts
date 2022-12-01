import { firestore } from "firebase-admin";
import { GraphQLSchema } from "graphql";
import { fileListToFirestore, fileToFirestore } from "../file";
import async from "async";
import { getSchemaFields, plural } from "../utils";
import { getCollection } from "../mutations";

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
    snapshot?: firestore.DocumentSnapshot
  ) {
    const lastData = snapshot?.data();
    const fields = getSchemaFields(name, this.schema);

    const resultArray = await Promise.all(
      fields.map(async (field) => {
        let fieldData = newData[field.name];
        const lastFieldData = lastData?.[field.name];

        if (typeof fieldData === "undefined") return {};

        if (field.type === "Reference" && field.target) {
          fieldData = await this.convertReference(field.target, fieldData);
        } else if (field.type === "ReferenceList" && field.target) {
          fieldData = await this.convertReferenceList(field.target, fieldData);
        } else if (field.type === "Collection" && field.target) {
          await this.convertCollection(field.target, fieldData, parentRef);
          return {};
        } else if (field.type === "File") {
          fieldData = await fileToFirestore(fieldData, lastFieldData);
        } else if (field.type === "FileList") {
          fieldData = await fileListToFirestore(fieldData, lastFieldData);
        }

        return { [field.name]: fieldData };
      })
    );

    return resultArray.reduce((acc, cur) => ({ ...acc, ...cur }), {
      id: parentRef.id,
      updatedAt: new Date(),
      ...(!lastData && { createdAt: new Date() }),
    });
  }

  private async convertCollection(
    name: string,
    input: CollectionInput,
    parentRef: firestore.DocumentReference
  ) {
    const ref = parentRef.collection(plural(name));

    await async.map(input?.createAndAdd || [], async (data2) => {
      const docRef = ref.doc();
      const data = await this.toFirebase(name, data2, docRef);
      this.batch.set(docRef, data);
      return docRef;
    });

    await async.map(input?.update || [], async (data2) => {
      const docRef = ref.doc(data2.id);
      const snapshot = await docRef.get();
      const data = await this.toFirebase(name, data2.fields, docRef, snapshot);
      this.batch.update(docRef, data);
      return docRef;
    });

    await async.map(input?.delete || [], async (id) => {
      const docRef = ref.doc(id);
      this.batch.delete(docRef);
      return docRef;
    });
  }

  private async convertReference(name: string, input: ReferenceInput | null) {
    const collection = getCollection(name);

    if (input?.createAndLink) {
      const docRef = collection.doc();
      const data = await this.toFirebase(name, input.createAndLink, docRef);
      this.batch.set(docRef, data);
      return docRef;
    }
    if (input?.link) {
      return collection.doc(input.link);
    }
    return null;
  }

  private async convertReferenceList(
    name: string,
    input: ReferenceListInput,
    lastData: firestore.DocumentReference[] = []
  ) {
    const collection = getCollection(name);

    const created = await async.map(input.createAndAdd || [], async (data2) => {
      const ref = collection.doc();
      const data = await this.toFirebase(name, data2, ref);
      this.batch.set(ref, data);

      return ref;
    });

    const addRef = (input.add || []).map((id) => collection.doc(id));

    const newCurrentData = lastData
      .filter((data) => !input.remove?.includes(data.id))
      .concat(created)
      .concat(addRef);

    return newCurrentData.reduce((acc, cur) => {
      if (acc.find((c) => c.id === cur.id)) return acc;
      return [...acc, cur];
    }, [] as typeof lastData);
  }
}
