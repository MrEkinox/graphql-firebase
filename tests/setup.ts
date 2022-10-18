import { ExpressContext, Config } from "apollo-server-express";
import express from "express";
import * as admin from "firebase-admin";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import path from "path";
import graphqlUploadExpress from "graphql-upload-minimal/public/graphqlUploadExpress.js";
import http from "http";
import { cleanUp } from "./testHelper";
import { CollectionOptions } from "../src/interfaces";
import { GraphQLFirebase } from "../src";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
process.env.GCLOUD_PROJECT = "dev";
admin.initializeApp({
  projectId: "dev",
  storageBucket: "dev",
  credential: admin.credential.applicationDefault(),
});

type ServerApolloOptions = Config<ExpressContext> & {
  collections: CollectionOptions[];
};

export const serverApollo = (options: ServerApolloOptions) => {
  const apollo = GraphQLFirebase({
    collections: options.collections,
    types: [],
    nonNullDefaults: { output: false, input: false },
    outputs: {
      schema: path.join(__dirname, "./generated/schema.graphql"),
      typegen: path.join(__dirname, "./generated/nexusTypes.d.ts"),
    },
    apolloPlugins: options?.plugins,
  });

  return apollo;
};

export const startHttpApolloServer = async (options: ServerApolloOptions) => {
  const app = express();
  const httpServer = http.createServer(app);

  const apolloServer = serverApollo({
    ...options,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(graphqlUploadExpress({ environment: "gcf" }));

  apolloServer.applyMiddleware({ app });

  httpServer.on("error", (e) => {
    if (e.message.includes("EADDRINUSE")) {
      setTimeout(() => {
        console.log("retry started");
        httpServer.listen({ port: 1337 });
      }, 1000);
    }
  });

  httpServer.listen({ port: 1337 });

  await new Promise<void>((resolve) =>
    httpServer.on("listening", () => {
      console.log("🚀 Server ready at http://localhost:1337/graphql");
      resolve();
    })
  );

  httpServer.on("close", () => {
    console.log("🚀 Server closed at http://localhost:1337/graphql");
  });

  await cleanUp();

  return apolloServer;
};
