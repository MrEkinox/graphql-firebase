import { firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { GraphQLSchema } from "graphql";
import { OrderByEnum } from "../scalars";
interface CollectionWhereInput {
    name: string;
    fieldName: string;
    parentFieldName?: string;
    input: Record<string, any>;
}
export type WhereInputOperator = {
    exists?: boolean;
    equalTo?: any;
    notEqualTo?: any;
    lessThan?: any;
    lessThanOrEqualTo?: any;
    greaterThan?: any;
    greaterThanOrEqualTo?: any;
    arrayContains?: any;
    in?: any[];
    notIn?: any[];
};
export declare const computeDate: (value?: Timestamp | any) => any;
export declare const sortOrderBy: (edges: Array<{
    node: Record<string, any> & {
        createdAt?: Timestamp;
    };
}>, orderBy?: Record<string, OrderByEnum>) => {
    node: Record<string, any> & {
        createdAt?: Timestamp;
    };
}[];
export declare class WhereCollection {
    private schema;
    private parentsIds;
    private orderBy?;
    constructor(schema: GraphQLSchema, parentsIds: Record<string, string>, orderBy?: Record<string, OrderByEnum>);
    private chunkQuery;
    private getData;
    get(whereInput: CollectionWhereInput[], collection: firestore.Query): Promise<{
        count: number;
        edges: {
            node: Record<string, any> & {
                createdAt?: firestore.Timestamp | undefined;
            };
        }[];
    }>;
    getWhereInput: (type: string, input?: Record<string, any>, parentFieldName?: string, fieldName?: string) => CollectionWhereInput[];
    private removeCollectionFields;
    private whereReferenceId;
    private whereReferenceListId;
    private whereObject;
    private whereFieldCollection;
    whereCollection: (whereInput: CollectionWhereInput, collection: firestore.CollectionReference | firestore.CollectionGroup | firestore.Query) => firestore.Query<firestore.DocumentData>;
    private getCollectionWhere;
}
export {};
