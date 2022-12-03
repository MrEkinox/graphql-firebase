"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileScalar = exports.Upload = exports.AnyScalar = exports.DateScalar = void 0;
const nexus_1 = require("nexus");
const graphql_upload_minimal_1 = require("graphql-upload-minimal");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = require("firebase-admin/firestore");
exports.DateScalar = (0, nexus_1.scalarType)({
    name: "Date",
    asNexusMethod: "date",
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
exports.AnyScalar = (0, nexus_1.scalarType)({ name: "Any", asNexusMethod: "any" });
exports.Upload = (0, nexus_1.scalarType)(Object.assign(Object.assign({}, graphql_upload_minimal_1.GraphQLUpload), { name: "Upload" }));
exports.FileScalar = (0, nexus_1.objectType)({
    name: "File",
    asNexusMethod: "file",
    definition(t) {
        t.string("url");
        t.string("name");
        t.boolean("isLinked");
    },
});
