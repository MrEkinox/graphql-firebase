import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
export declare const referenceResolver: (type: string, isList: boolean, src: any, info: GraphQLResolveInfo) => Promise<firestore.DocumentData | null | undefined>;
