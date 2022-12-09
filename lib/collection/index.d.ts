import { firestore } from "firebase-admin";
import { GraphQLResolveInfo } from "graphql";
export declare const collectionResolver: (type: string, fieldName: string, parents: string[], src: any, { where, limit, offset, ...input }: {
    [x: string]: any;
    where: any;
    limit: any;
    offset: any;
}, info: GraphQLResolveInfo) => Promise<{
    count: number;
    edges: {
        node: Record<string, any> & {
            createdAt?: firestore.Timestamp | undefined;
        };
    }[];
}>;
