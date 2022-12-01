import { objectType, scalarType } from "nexus";
import { GraphQLUpload } from "graphql-upload-minimal";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export const DateScalar = scalarType({
  name: "Date",
  asNexusMethod: "date",
  parseValue: (value: any) => {
    if (value instanceof Timestamp) return value;
    if (value) return admin.firestore.Timestamp.fromDate(new Date(value));
    return value;
  },
  serialize: (value) => {
    if (value instanceof Timestamp) return value.toDate();
    return value;
  },
});
export const AnyScalar = scalarType({ name: "Any", asNexusMethod: "any" });
export const Upload = scalarType({ ...GraphQLUpload, name: "Upload" });

export const FileScalar = objectType({
  name: "File",
  asNexusMethod: "file",
  definition(t) {
    t.string("url");
    t.string("name");
    t.boolean("isLinked");
  },
});
