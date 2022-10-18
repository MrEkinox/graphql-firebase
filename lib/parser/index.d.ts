import { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin";
import { CollectionOptions, CollectionType, FieldTargetOptions, FieldWithoutTargetOptions, FieldObjectOptions, ObjectString, FieldDefaultOptions } from "../interfaces";
export declare type ParsedFieldCollectionOptions = FieldDefaultOptions & {
    type: CollectionType;
    target: string;
};
export declare type ParsedAllFieldOptions = FieldWithoutTargetOptions | ParsedFieldCollectionOptions | FieldTargetOptions | FieldObjectOptions;
export declare type ParsedFieldOptions = ParsedAllFieldOptions;
export declare type ParsedFieldsOptions = ObjectString<ParsedFieldOptions>;
export declare type ParsedCollectionOptions = {
    beforeCreate?: (newData?: any, ids?: string[]) => void;
    beforeDelete?: (id: string, ids?: string[]) => void;
    beforeUpdate?: (id: string, newData?: any, ids?: string[]) => void;
    name: string;
    deprecation?: string;
    description?: string;
    nullable?: boolean;
    authorize?: FieldAuthorizeResolver<any, string>;
    parent?: string;
    fields: ParsedFieldsOptions;
};
export declare type ParsedCollectionsOptions = ObjectString<ParsedCollectionOptions>;
export declare const parseCollections: (collections: CollectionOptions[]) => {};
