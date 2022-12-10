import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
import { OrderByEnum } from "../scalars";
interface CollectionInput {
    where?: Record<string, any>;
    limit?: number;
    offset?: number;
    orderBy?: Record<string, OrderByEnum>;
}
export declare const collectionResolver: (type: string, fieldName: string, parents: string[], src: any, { where, limit, offset, orderBy, ...input }: CollectionInput, info: GraphQLResolveInfo) => Promise<{
    count: number;
    edges: {
        node: Record<string, any> & {
            createdAt?: firestore.Timestamp | undefined;
        };
    }[];
}>;
export {};
