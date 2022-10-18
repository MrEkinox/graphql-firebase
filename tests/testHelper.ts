import { GraphQLClient } from "graphql-request";
import * as admin from "firebase-admin";
import async from "async";
import { getSdk } from "./generated/graphql-gen";
import { Upload } from "graphql-upload-minimal";
import { v4 as uuid } from "uuid";
import fs from "fs";

export const cleanUp = async () => {
  await admin.storage().bucket().deleteFiles();

  const collections = await admin.firestore().listCollections();
  await async.map(
    collections,
    async (collection) => await admin.firestore().recursiveDelete(collection)
  );
};

export const graphQLClient = new GraphQLClient("http://localhost:1337/graphql");

export const client = getSdk(graphQLClient);

export const createFile = () => {
  const upload = new Upload();
  upload.promise = new Promise((resolve) =>
    resolve({
      fieldName: "test",
      createReadStream: () =>
        // @ts-ignore
        fs.createReadStream(require.resolve("./avatar.jpg")),
      filename: `${uuid()}.jpg`,
      mimetype: "",
      encoding: "",
    })
  );

  return upload;
};
