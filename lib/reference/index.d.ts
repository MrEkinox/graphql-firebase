import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
export declare const referenceResolver: (fieldName: string, isList: boolean, src: any, info: GraphQLResolveInfo) => Promise<string | firestore.DocumentData | null | undefined>;
