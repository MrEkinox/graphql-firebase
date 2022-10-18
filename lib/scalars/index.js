"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileScalar = exports.Upload = exports.Country = exports.Phone = exports.Email = exports.AnyScalar = exports.Number = exports.DateScalar = void 0;
const nexus_1 = require("nexus");
const graphql_scalars_1 = require("graphql-scalars");
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
exports.DateScalar = (0, nexus_1.scalarType)({
    name: "Date",
    parseValue: (value) => {
        if (value instanceof firestore_1.Timestamp)
            return value;
        if (value)
            return firebase_admin_1.default.firestore.Timestamp.fromDate(new Date(value));
        return value;
    },
    serialize: (value) => {
        if (value instanceof firestore_1.Timestamp)
            return value.toDate();
        return value;
    },
});
exports.Number = (0, nexus_1.scalarType)({ name: "Number" });
exports.AnyScalar = (0, nexus_1.scalarType)({ name: "Any" });
exports.Email = (0, nexus_1.scalarType)(Object.assign(Object.assign({}, graphql_scalars_1.GraphQLEmailAddress), { name: "Email" }));
exports.Phone = (0, nexus_1.scalarType)(Object.assign(Object.assign({}, graphql_scalars_1.GraphQLPhoneNumber), { name: "Phone" }));
exports.Country = (0, nexus_1.scalarType)(Object.assign(Object.assign({}, graphql_scalars_1.GraphQLCountryCode), { name: "Country" }));
exports.Upload = (0, nexus_1.scalarType)(Object.assign(Object.assign({}, graphql_upload_minimal_1.GraphQLUpload), { name: "Upload" }));
exports.FileScalar = (0, nexus_1.objectType)({
    name: "File",
    definition(t) {
        t.string("url");
        t.string("name");
        t.boolean("isLinked");
    },
});
