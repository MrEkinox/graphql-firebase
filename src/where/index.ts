import { firestore } from "firebase-admin";
import { WhereFilterOp } from "firebase-admin/firestore";
import { GraphQLSchema } from "graphql";
import { inputObjectType } from "nexus";
import { FirestoreTypeOptions } from "..";
import {
  FirestoreField,
  FirestoreFieldType,
  getDefinitionFields,
  getSchemaFields,
  plural,
} from "../utils";

interface CollectionWhereInput {
  name: string;
  parent?: string;
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

  constructor(schema: GraphQLSchema) {
    this.schema = schema;
  }

  async get(name: string, input: Record<string, any>) {
    const whereInput = this.getWhereInput(name, input);
    console.log(name, whereInput, input);
    const ids = await this.getCollectionWhere(whereInput);
    return ids;
  }

  private removeCollectionFields(name: string, input?: Record<string, any>) {
    const fields = getSchemaFields(name, this.schema);

    const newFields = fields.reduce((acc, field) => {
      const fieldInput = input?.[field.name];
      if (!fieldInput) return acc;

      if (field.type === "Collection" && field.target) {
        return acc;
      }
      return { ...acc, [field.name]: fieldInput };
    }, {});

    if (Object.keys(newFields).length) return newFields;
    return undefined;
  }

  private getWhereInput = (
    name: string,
    input?: Record<string, any>,
    parent?: string
  ): CollectionWhereInput[] => {
    const fields = getSchemaFields(name, this.schema);

    return fields.reduce((acc, field) => {
      const fieldInput = input?.[field.name];
      if (field.type === "Collection" && field.target && fieldInput) {
        const newInput = this.removeCollectionFields(field.target, fieldInput);
        if (newInput) {
          const newFieldInput = { name: field.target, input: newInput, parent };
          const inField = this.getWhereInput(
            field.target,
            fieldInput,
            field.target
          );
          return [...acc, ...inField, newFieldInput];
        }
        const inField = this.getWhereInput(field.target, fieldInput, name);
        return [...acc, ...inField];
      }
      return acc;
    }, [] as CollectionWhereInput[]);
  };

  private whereFieldCollection = (
    field: FirestoreField,
    collection: firestore.Query,
    input: Record<string, WhereInputOperator>
  ): firestore.Query => {
    return Object.keys(input).reduce((acc, operator) => {
      const inputValue = input[operator];
      if (!inputValue) return acc;

      if (field.type === "Reference" && operator === "id") {
        console.log("where reference id", inputValue);
      }

      if (operator === "exists") {
        return acc.where(field.name, inputValue ? "!=" : "==", null);
      }
      const whereOperator = getWhereType(operator);
      if (!whereOperator) return acc;

      return acc.where(field.name, whereOperator, inputValue);
    }, collection);
  };

  private whereCollection = (
    name: string,
    collection: firestore.CollectionReference | firestore.CollectionGroup,
    input?: Record<string, any>
  ) => {
    const fields = getSchemaFields(name, this.schema);

    return fields.reduce((acc, field) => {
      const fieldInput = input?.[field.name];
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

    const collectionGroup = firestore().collectionGroup(plural(where.name));
    let collection = this.whereCollection(
      where.name,
      collectionGroup,
      where.input
    );

    if (ids.length) {
      collection = collection.where("id", "in", ids);
    }
    const snapshot = await collection.get();

    const snapIds = snapshot.docs.map((doc) => {
      const path = doc.ref.path.split("/");
      const index = where.parent ? path.indexOf(plural(where.parent)) : 0;
      return path.at(index + 1) || "";
    });

    if (snapIds.length) {
      const newIds = [...ids, ...snapIds];
      return this.getCollectionWhere(whereInput, newIds);
    }
    return ids;
  }
}

export const getFieldWhereInput = (type: FirestoreFieldType | string) =>
  inputObjectType({
    name: `${type}WhereInput`,
    definition: (t) => {
      t.boolean("exists");

      if (type === "File") return;
      if (type === "FileList") return;
      if (type === "Reference") return;
      if (type === "ReferenceList") return;
      if (type === "Any") return;
      if (type === "Object") return;

      // @ts-ignore
      t.field("equalTo", { type });
      // @ts-ignore
      t.field("notEqualTo", { type });
      // @ts-ignore
      t.field("arrayContains", { type });
      // @ts-ignore
      t.field("lessThan", { type });
      // @ts-ignore
      t.field("lessThanOrEqualTo", { type });
      // @ts-ignore
      t.field("greaterThan", { type });
      // @ts-ignore
      t.field("greaterThanOrEqualTo", { type });
      // @ts-ignore
      t.field("in", { type, list: true });
      // @ts-ignore
      t.field("notIn", { type, list: true });
    },
  });

export const createDefaultWhereInputs = () => {
  const stringWhereInput = getFieldWhereInput("String");
  const booleanWhereInput = getFieldWhereInput("Boolean");
  const idWhereInput = getFieldWhereInput("ID");
  const dateWhereInput = getFieldWhereInput("Date");
  const fileWhereInput = getFieldWhereInput("File");
  const intWhereInput = getFieldWhereInput("Int");

  return {
    intWhereInput,
    stringWhereInput,
    booleanWhereInput,
    idWhereInput,
    dateWhereInput,
    fileWhereInput,
  };
};

export const getWhereInput = (options: FirestoreTypeOptions) => {
  const fields = getDefinitionFields(options.definition);

  return inputObjectType({
    name: `${options.name}WhereInput`,
    definition(t) {
      t.boolean("exists");
      fields.map((field) => {
        switch (field.type) {
          case "File":
          case "FileList":
            return;
          case "Reference":
          case "ReferenceList":
          case "Collection":
          case "Object":
            // @ts-ignore
            t.field(field.name, { type: `${field.target}WhereInput` });
            return;
          case "Any":
            t.field(field.name, { type: "Any" });
            return;

          default:
            // @ts-ignore
            t.field(field.name, { type: `${field.type}WhereInput` });
        }
      });
    },
  });
};
