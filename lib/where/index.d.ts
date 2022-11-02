import { CollectionReference } from "firebase-admin/firestore";
import { ObjectString } from "../interfaces";
import { ParsedCollectionOptions } from "../parser";
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
export declare type WhereFieldsInput = ObjectString<ObjectString<any>> | ObjectString<any>;
export declare type WhereInput = WhereFieldsInput;
export declare const whereFilterEquality: (whereInput: WhereInput, data: any) => any;
export declare const whereCollection: (target: ParsedCollectionOptions, collection: CollectionReference | FirebaseFirestore.Query, whereInput?: WhereInput, withoutID?: boolean) => FirebaseFirestore.Query;
