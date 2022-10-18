import { ApolloServer } from "apollo-server-express";
import { GraphQLFirebaseOptions } from "./interfaces";
import { ParsedCollectionsOptions } from "./parser";
export declare let parsedCollections: ParsedCollectionsOptions;
export declare const GraphQLFirebase: (options: GraphQLFirebaseOptions) => ApolloServer<import("apollo-server-express").ExpressContext>;
