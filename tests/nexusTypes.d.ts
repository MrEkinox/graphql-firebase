/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { ReferenceField, CollectionField, ObjectField } from "/Users/mrekinox/Desktop/graphql-firebase/src/plugin"
import type { core, connectionPluginCore } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
    any<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Any";
    file<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "File";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    any<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Any";
    file<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "File";
    ref<FieldName extends string>(name: FieldName, config: ReferenceField): void
    object<FieldName extends string>(name: FieldName, config: ObjectField): void
    collection<FieldName extends string>(name: FieldName, config: CollectionField): void
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName> & { count?: connectionPluginCore.ConnectionFieldResolver<TypeName, FieldName, "count"> }
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  BooleanWhereInput: { // input type
    arrayContains?: boolean | null; // Boolean
    equalTo?: boolean | null; // Boolean
    exists?: boolean | null; // Boolean
    greaterThan?: boolean | null; // Boolean
    greaterThanOrEqualTo?: boolean | null; // Boolean
    in?: Array<boolean | null> | null; // [Boolean]
    lessThan?: boolean | null; // Boolean
    lessThanOrEqualTo?: boolean | null; // Boolean
    notEqualTo?: boolean | null; // Boolean
    notIn?: Array<boolean | null> | null; // [Boolean]
  }
  CreateLikeInput: { // input type
    users: NexusGenInputs['UserReferenceListInput']; // UserReferenceListInput!
  }
  CreateUserInput: { // input type
    username: string; // String!
  }
  DateWhereInput: { // input type
    arrayContains?: NexusGenScalars['Date'] | null; // Date
    equalTo?: NexusGenScalars['Date'] | null; // Date
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenScalars['Date'] | null; // Date
    greaterThanOrEqualTo?: NexusGenScalars['Date'] | null; // Date
    in?: Array<NexusGenScalars['Date'] | null> | null; // [Date]
    lessThan?: NexusGenScalars['Date'] | null; // Date
    lessThanOrEqualTo?: NexusGenScalars['Date'] | null; // Date
    notEqualTo?: NexusGenScalars['Date'] | null; // Date
    notIn?: Array<NexusGenScalars['Date'] | null> | null; // [Date]
  }
  DeleteLikeInput: { // input type
    id: string; // ID!
  }
  DeleteUserInput: { // input type
    id: string; // ID!
  }
  FileWhereInput: { // input type
    exists?: boolean | null; // Boolean
  }
  IDWhereInput: { // input type
    arrayContains?: string | null; // ID
    equalTo?: string | null; // ID
    exists?: boolean | null; // Boolean
    greaterThan?: string | null; // ID
    greaterThanOrEqualTo?: string | null; // ID
    in?: Array<string | null> | null; // [ID]
    lessThan?: string | null; // ID
    lessThanOrEqualTo?: string | null; // ID
    notEqualTo?: string | null; // ID
    notIn?: Array<string | null> | null; // [ID]
  }
  IntWhereInput: { // input type
    arrayContains?: number | null; // Int
    equalTo?: number | null; // Int
    exists?: boolean | null; // Boolean
    greaterThan?: number | null; // Int
    greaterThanOrEqualTo?: number | null; // Int
    in?: Array<number | null> | null; // [Int]
    lessThan?: number | null; // Int
    lessThanOrEqualTo?: number | null; // Int
    notEqualTo?: number | null; // Int
    notIn?: Array<number | null> | null; // [Int]
  }
  LikeCollectionInput: { // input type
    createAndAdd?: Array<NexusGenInputs['CreateLikeInput'] | null> | null; // [CreateLikeInput]
    delete?: Array<string | null> | null; // [ID]
    update?: Array<NexusGenInputs['UpdateLikeInput'] | null> | null; // [UpdateLikeInput]
  }
  LikeOrderByInput: { // input type
    users?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
  }
  LikeReferenceInput: { // input type
    createAndLink?: NexusGenInputs['CreateLikeInput'] | null; // CreateLikeInput
    link?: string | null; // ID
  }
  LikeReferenceListInput: { // input type
    add?: Array<string | null> | null; // [ID]
    createAndAdd?: Array<NexusGenInputs['CreateLikeInput'] | null> | null; // [CreateLikeInput]
    remove?: Array<string | null> | null; // [ID]
  }
  LikeWhereInput: { // input type
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    exists?: boolean | null; // Boolean
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    users?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
  }
  StringWhereInput: { // input type
    arrayContains?: string | null; // String
    equalTo?: string | null; // String
    exists?: boolean | null; // Boolean
    greaterThan?: string | null; // String
    greaterThanOrEqualTo?: string | null; // String
    in?: Array<string | null> | null; // [String]
    lessThan?: string | null; // String
    lessThanOrEqualTo?: string | null; // String
    notEqualTo?: string | null; // String
    notIn?: Array<string | null> | null; // [String]
  }
  UpdateLikeFieldsInput: { // input type
    users?: NexusGenInputs['UserReferenceListInput'] | null; // UserReferenceListInput
  }
  UpdateLikeInput: { // input type
    fields: NexusGenInputs['UpdateLikeFieldsInput']; // UpdateLikeFieldsInput!
    id: string; // ID!
  }
  UpdateUserFieldsInput: { // input type
    username?: string | null; // String
  }
  UpdateUserInput: { // input type
    fields: NexusGenInputs['UpdateUserFieldsInput']; // UpdateUserFieldsInput!
    id: string; // ID!
  }
  UploadFileInput: { // input type
    link?: string | null; // String
    upload?: NexusGenScalars['Upload'] | null; // Upload
  }
  UploadFileListInput: { // input type
    add?: Array<NexusGenScalars['Upload'] | null> | null; // [Upload]
    link?: Array<string | null> | null; // [String]
    remove?: Array<string | null> | null; // [String]
  }
  UserCollectionInput: { // input type
    createAndAdd?: Array<NexusGenInputs['CreateUserInput'] | null> | null; // [CreateUserInput]
    delete?: Array<string | null> | null; // [ID]
    update?: Array<NexusGenInputs['UpdateUserInput'] | null> | null; // [UpdateUserInput]
  }
  UserOrderByInput: { // input type
    username?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
  }
  UserReferenceInput: { // input type
    createAndLink?: NexusGenInputs['CreateUserInput'] | null; // CreateUserInput
    link?: string | null; // ID
  }
  UserReferenceListInput: { // input type
    add?: Array<string | null> | null; // [ID]
    createAndAdd?: Array<NexusGenInputs['CreateUserInput'] | null> | null; // [CreateUserInput]
    remove?: Array<string | null> | null; // [ID]
  }
  UserWhereInput: { // input type
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    exists?: boolean | null; // Boolean
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    username?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
  }
}

export interface NexusGenEnums {
  OrderByEnum: "asc" | "desc"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Any: any
  Date: any
  File: any
  Upload: any
}

export interface NexusGenObjects {
  Like: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  LikeCollection: { // root type
    count?: number | null; // Int
    edges?: Array<NexusGenRootTypes['LikeEdge'] | null> | null; // [LikeEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  LikeEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Like'] | null; // Like
  }
  Mutation: {};
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  }
  Query: {};
  User: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
    username: string; // String!
  }
  UserCollection: { // root type
    count?: number | null; // Int
    edges?: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  UserEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Like: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  LikeCollection: { // field return type
    count: number | null; // Int
    edges: Array<NexusGenRootTypes['LikeEdge'] | null> | null; // [LikeEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  LikeEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Like'] | null; // Like
  }
  Mutation: { // field return type
    createLike: NexusGenRootTypes['Like'] | null; // Like
    createUser: NexusGenRootTypes['User'] | null; // User
    deleteLike: boolean | null; // Boolean
    deleteUser: boolean | null; // Boolean
    updateLike: NexusGenRootTypes['Like'] | null; // Like
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Query: { // field return type
    like: NexusGenRootTypes['Like'] | null; // Like
    likes: NexusGenRootTypes['LikeCollection'] | null; // LikeCollection
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['UserCollection'] | null; // UserCollection
  }
  User: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
    username: string; // String!
  }
  UserCollection: { // field return type
    count: number | null; // Int
    edges: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  UserEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenFieldTypeNames {
  Like: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
    users: 'User'
  }
  LikeCollection: { // field return type name
    count: 'Int'
    edges: 'LikeEdge'
    pageInfo: 'PageInfo'
  }
  LikeEdge: { // field return type name
    cursor: 'String'
    node: 'Like'
  }
  Mutation: { // field return type name
    createLike: 'Like'
    createUser: 'User'
    deleteLike: 'Boolean'
    deleteUser: 'Boolean'
    updateLike: 'Like'
    updateUser: 'User'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: { // field return type name
    like: 'Like'
    likes: 'LikeCollection'
    user: 'User'
    users: 'UserCollection'
  }
  User: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
    username: 'String'
  }
  UserCollection: { // field return type name
    count: 'Int'
    edges: 'UserEdge'
    pageInfo: 'PageInfo'
  }
  UserEdge: { // field return type name
    cursor: 'String'
    node: 'User'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createLike: { // args
      input: NexusGenInputs['CreateLikeInput']; // CreateLikeInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    deleteLike: { // args
      input: NexusGenInputs['DeleteLikeInput']; // DeleteLikeInput!
    }
    deleteUser: { // args
      input: NexusGenInputs['DeleteUserInput']; // DeleteUserInput!
    }
    updateLike: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['UpdateLikeInput']; // UpdateLikeInput!
    }
    updateUser: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Query: {
    like: { // args
      id: string; // ID!
    }
    likes: { // args
      limit: number | null; // Int
      offset?: number | null; // Int
      orderBy?: NexusGenInputs['LikeOrderByInput'] | null; // LikeOrderByInput
      where?: NexusGenInputs['LikeWhereInput'] | null; // LikeWhereInput
    }
    user: { // args
      id: string; // ID!
    }
    users: { // args
      limit: number | null; // Int
      offset?: number | null; // Int
      orderBy?: NexusGenInputs['UserOrderByInput'] | null; // UserOrderByInput
      where?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
    /**
     * Whether the type can be null
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    nullable?: boolean
    /**
     * Whether the type is list of values, or just a single value.
     * If list is true, we assume the type is a list. If list is an array,
     * we'll assume that it's a list with the depth. The boolean indicates whether
     * the type is required (non-null), where true = nonNull, false = nullable.
     * @see declarativeWrappingPlugin
     */
    list?: true | boolean[]
    /**
     * Whether the type should be non null, `required: true` = `nullable: false`
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    required?: boolean
    
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Whether the type can be null
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    nullable?: boolean
    /**
     * Whether the type is list of values, or just a single value.
     * If list is true, we assume the type is a list. If list is an array,
     * we'll assume that it's a list with the depth. The boolean indicates whether
     * the type is required (non-null), where true = nonNull, false = nullable.
     * @see declarativeWrappingPlugin
     */
    list?: true | boolean[]
    /**
     * Whether the type should be non null, `required: true` = `nullable: false`
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    required?: boolean
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
    /**
     * Whether the type can be null
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    nullable?: boolean
    /**
     * Whether the type is list of values, or just a single value.
     * If list is true, we assume the type is a list. If list is an array,
     * we'll assume that it's a list with the depth. The boolean indicates whether
     * the type is required (non-null), where true = nonNull, false = nullable.
     * @see declarativeWrappingPlugin
     */
    list?: true | boolean[]
    /**
     * Whether the type should be non null, `required: true` = `nullable: false`
     * @default (depends on whether nullability is configured in type or schema)
     * @see declarativeWrappingPlugin
     */
    required?: boolean
  }
}