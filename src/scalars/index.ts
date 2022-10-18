import { objectType, scalarType } from "nexus";
import {
  GraphQLEmailAddress,
  GraphQLPhoneNumber,
  GraphQLCountryCode,
} from "graphql-scalars";
import { GraphQLUpload } from "graphql-upload-minimal";
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export const DateScalar = scalarType({
  name: "Date",
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
export const Number = scalarType({ name: "Number" });
export const AnyScalar = scalarType({ name: "Any" });
export const Email = scalarType({ ...GraphQLEmailAddress, name: "Email" });
export const Phone = scalarType({ ...GraphQLPhoneNumber, name: "Phone" });
export const Country = scalarType({ ...GraphQLCountryCode, name: "Country" });
export const Upload = scalarType({ ...GraphQLUpload, name: "Upload" });

export const FileScalar = objectType({
  name: "File",
  definition(t) {
    t.string("url");
    t.string("name");
    t.boolean("isLinked");
  },
});
