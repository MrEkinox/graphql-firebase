import { firestore } from "firebase-admin";
import { GraphQLSchema } from "graphql";
interface CollectionWhereInput {
    name: string;
    fieldName: string;
    parentFieldName?: string;
    input: Record<string, any>;
}
export declare type WhereInputOperator = {
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
export declare const orderByCreatedAt: (edges: any[]) => any[];
export declare class WhereCollection {
    private schema;
    private parentsIds;
    constructor(schema: GraphQLSchema, parentsIds: Record<string, string>);
    private chunkQuery;
    private getData;
    get(whereInput: CollectionWhereInput[], collection: firestore.Query): Promise<{
        count: number;
        edges: any[];
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
