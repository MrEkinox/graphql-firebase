import { ApolloServer, ExpressContext, Config } from "apollo-server-express";
import express from "express";
import * as admin from "firebase-admin";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import path from "path";
import graphqlUploadExpress from "graphql-upload-minimal/public/graphqlUploadExpress.js";
import http from "http";
import { cleanUp } from "./testHelper";
import { makeSchema } from "../src";
import { SchemaConfig } from "nexus/dist/builder";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
process.env.GCLOUD_PROJECT = "dev";
admin.initializeApp({
  projectId: "dev",
  storageBucket: "dev",
  credential: admin.credential.applicationDefault(),
});

type ServerApolloOptions = Config<ExpressContext> &
  Omit<SchemaConfig, "plugins">;

export const serverApollo = (options: ServerApolloOptions) => {
  const schema = makeSchema({
    types: options.types,
    outputs: {
      schema: path.join(__dirname, "./generated/schema.graphql"),
      typegen: path.join(__dirname, "./nexusTypes.d.ts"),
    },
  });

  const server = new ApolloServer({
    debug: true,
    csrfPrevention: true,
    cache: "bounded",
    introspection: true,
    // @ts-ignore
    schema: schema,
    plugins: options?.plugins,
  });

  return server;
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
