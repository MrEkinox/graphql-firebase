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
  CreateCustomObject2Input: { // input type
    customObject3?: NexusGenInputs['CreateCustomObject3Input'] | null; // CreateCustomObject3Input
    test?: string | null; // String
    test2?: string | null; // String
  }
  CreateCustomObject3Input: { // input type
    test?: string | null; // String
  }
  CreateCustomObjectInput: { // input type
    customObject2?: NexusGenInputs['CreateCustomObject2Input'] | null; // CreateCustomObject2Input
    test: string; // String!
    test8?: string | null; // String
    viewNumber?: number | null; // Int
    viewNumber2?: number | null; // Int
  }
  CreateLikeInput: { // input type
    any?: NexusGenScalars['Any'] | null; // Any
    array?: Array<string | null> | null; // [String]
    boolean?: boolean | null; // Boolean
    createdBy?: NexusGenInputs['UserReferenceInput'] | null; // UserReferenceInput
    customObject?: NexusGenInputs['CreateCustomObjectInput'] | null; // CreateCustomObjectInput
    endDate?: NexusGenScalars['Date'] | null; // Date
    meetDate?: NexusGenScalars['Date'] | null; // Date
    testEnm2?: NexusGenEnums['TestEnum'] | null; // TestEnum
    testEnum?: NexusGenEnums['TestEnum'] | null; // TestEnum
    users: NexusGenInputs['UserReferenceListInput']; // UserReferenceListInput!
    viewNumber?: number | null; // Int
    viewNumber2?: number | null; // Int
  }
  CreateUserInput: { // input type
    username: string; // String!
  }
  CustomObject2WhereInput: { // input type
    customObject3?: NexusGenInputs['CustomObject3WhereInput'] | null; // CustomObject3WhereInput
    exists?: boolean | null; // Boolean
    test?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    test2?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
  }
  CustomObject3WhereInput: { // input type
    exists?: boolean | null; // Boolean
    test?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
  }
  CustomObjectWhereInput: { // input type
    customObject2?: NexusGenInputs['CustomObject2WhereInput'] | null; // CustomObject2WhereInput
    exists?: boolean | null; // Boolean
    test?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    test8?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    viewNumber?: NexusGenInputs['IntWhereInput'] | null; // IntWhereInput
    viewNumber2?: NexusGenInputs['IntWhereInput'] | null; // IntWhereInput
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
    any?: NexusGenScalars['Any'] | null; // Any
    array?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    boolean?: NexusGenInputs['BooleanWhereInput'] | null; // BooleanWhereInput
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    createdBy?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    customObject?: NexusGenInputs['CustomObjectWhereInput'] | null; // CustomObjectWhereInput
    endDate?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    exists?: boolean | null; // Boolean
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    meetDate?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    testEnm2?: NexusGenInputs['TestEnumWhereInput'] | null; // TestEnumWhereInput
    testEnum?: NexusGenInputs['TestEnumWhereInput'] | null; // TestEnumWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    users?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    viewNumber?: NexusGenInputs['IntWhereInput'] | null; // IntWhereInput
    viewNumber2?: NexusGenInputs['IntWhereInput'] | null; // IntWhereInput
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
  TestEnumWhereInput: { // input type
    arrayContains?: NexusGenEnums['TestEnum'] | null; // TestEnum
    equalTo?: NexusGenEnums['TestEnum'] | null; // TestEnum
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenEnums['TestEnum'] | null; // TestEnum
    greaterThanOrEqualTo?: NexusGenEnums['TestEnum'] | null; // TestEnum
    in?: Array<NexusGenEnums['TestEnum'] | null> | null; // [TestEnum]
    lessThan?: NexusGenEnums['TestEnum'] | null; // TestEnum
    lessThanOrEqualTo?: NexusGenEnums['TestEnum'] | null; // TestEnum
    notEqualTo?: NexusGenEnums['TestEnum'] | null; // TestEnum
    notIn?: Array<NexusGenEnums['TestEnum'] | null> | null; // [TestEnum]
  }
  UpdateCustomObject2Input: { // input type
    customObject3?: NexusGenInputs['UpdateCustomObject3Input'] | null; // UpdateCustomObject3Input
    test?: string | null; // String
    test2?: string | null; // String
  }
  UpdateCustomObject3Input: { // input type
    test?: string | null; // String
  }
  UpdateCustomObjectInput: { // input type
    customObject2?: NexusGenInputs['UpdateCustomObject2Input'] | null; // UpdateCustomObject2Input
    test?: string | null; // String
    test8?: string | null; // String
    viewNumber?: number | null; // Int
    viewNumber2?: number | null; // Int
  }
  UpdateLikeFieldsInput: { // input type
    any?: NexusGenScalars['Any'] | null; // Any
    array?: Array<string | null> | null; // [String]
    boolean?: boolean | null; // Boolean
    createdBy?: NexusGenInputs['UserReferenceInput'] | null; // UserReferenceInput
    customObject?: NexusGenInputs['UpdateCustomObjectInput'] | null; // UpdateCustomObjectInput
    endDate?: NexusGenScalars['Date'] | null; // Date
    meetDate?: NexusGenScalars['Date'] | null; // Date
    testEnm2?: NexusGenEnums['TestEnum'] | null; // TestEnum
    testEnum?: NexusGenEnums['TestEnum'] | null; // TestEnum
    users?: NexusGenInputs['UserReferenceListInput'] | null; // UserReferenceListInput
    viewNumber?: number | null; // Int
    viewNumber2?: number | null; // Int
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
    link?: NexusGenInputs['UploadFileLinkInput'] | null; // UploadFileLinkInput
    upload?: NexusGenScalars['Upload'] | null; // Upload
  }
  UploadFileLinkInput: { // input type
    name: string; // String!
    url: string; // String!
  }
  UploadFileListInput: { // input type
    add?: Array<NexusGenScalars['Upload'] | null> | null; // [Upload]
    link?: Array<NexusGenInputs['UploadFileLinkInput'] | null> | null; // [UploadFileLinkInput]
    remove?: Array<string | null> | null; // [String]
  }
  UserCollectionInput: { // input type
    createAndAdd?: Array<NexusGenInputs['CreateUserInput'] | null> | null; // [CreateUserInput]
    delete?: Array<string | null> | null; // [ID]
    update?: Array<NexusGenInputs['UpdateUserInput'] | null> | null; // [UpdateUserInput]
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
  TestEnum: "other"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Any: any
  Date: any
  Upload: any
}

export interface NexusGenObjects {
  CustomObject: { // root type
    customObject2?: NexusGenRootTypes['CustomObject2'] | null; // CustomObject2
    test: string; // String!
    test8?: string | null; // String
    viewNumber?: number | null; // Int
    viewNumber2?: number | null; // Int
  }
  CustomObject2: { // root type
    customObject3?: NexusGenRootTypes['CustomObject3'] | null; // CustomObject3
    test?: string | null; // String
    test2?: string | null; // String
  }
  CustomObject3: { // root type
    test?: string | null; // String
  }
  File: { // root type
    isLinked?: boolean | null; // Boolean
    name?: string | null; // String
    url?: string | null; // String
  }
  Like: { // root type
    any?: NexusGenScalars['Any'] | null; // Any
    array?: Array<string | null> | null; // [String]
    boolean?: boolean | null; // Boolean
    createdAt: NexusGenScalars['Date']; // Date!
    customObject?: NexusGenRootTypes['CustomObject'] | null; // CustomObject
    endDate?: NexusGenScalars['Date'] | null; // Date
    id: string; // ID!
    meetDate?: NexusGenScalars['Date'] | null; // Date
    testEnm2?: NexusGenEnums['TestEnum'] | null; // TestEnum
    testEnum?: NexusGenEnums['TestEnum'] | null; // TestEnum
    updatedAt: NexusGenScalars['Date']; // Date!
    viewNumber?: number | null; // Int
    viewNumber2?: number | null; // Int
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
  CustomObject: { // field return type
    customObject2: NexusGenRootTypes['CustomObject2'] | null; // CustomObject2
    test: string; // String!
    test8: string | null; // String
    viewNumber: number | null; // Int
    viewNumber2: number | null; // Int
  }
  CustomObject2: { // field return type
    customObject3: NexusGenRootTypes['CustomObject3'] | null; // CustomObject3
    test: string | null; // String
    test2: string | null; // String
  }
  CustomObject3: { // field return type
    test: string | null; // String
  }
  File: { // field return type
    isLinked: boolean | null; // Boolean
    name: string | null; // String
    url: string | null; // String
  }
  Like: { // field return type
    any: NexusGenScalars['Any'] | null; // Any
    array: Array<string | null> | null; // [String]
    boolean: boolean | null; // Boolean
    createdAt: NexusGenScalars['Date']; // Date!
    createdBy: NexusGenRootTypes['User'] | null; // User
    customObject: NexusGenRootTypes['CustomObject'] | null; // CustomObject
    endDate: NexusGenScalars['Date'] | null; // Date
    id: string; // ID!
    meetDate: NexusGenScalars['Date'] | null; // Date
    testEnm2: NexusGenEnums['TestEnum'] | null; // TestEnum
    testEnum: NexusGenEnums['TestEnum'] | null; // TestEnum
    updatedAt: NexusGenScalars['Date']; // Date!
    users: NexusGenRootTypes['User'][]; // [User!]!
    viewNumber: number | null; // Int
    viewNumber2: number | null; // Int
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
  CustomObject: { // field return type name
    customObject2: 'CustomObject2'
    test: 'String'
    test8: 'String'
    viewNumber: 'Int'
    viewNumber2: 'Int'
  }
  CustomObject2: { // field return type name
    customObject3: 'CustomObject3'
    test: 'String'
    test2: 'String'
  }
  CustomObject3: { // field return type name
    test: 'String'
  }
  File: { // field return type name
    isLinked: 'Boolean'
    name: 'String'
    url: 'String'
  }
  Like: { // field return type name
    any: 'Any'
    array: 'String'
    boolean: 'Boolean'
    createdAt: 'Date'
    createdBy: 'User'
    customObject: 'CustomObject'
    endDate: 'Date'
    id: 'ID'
    meetDate: 'Date'
    testEnm2: 'TestEnum'
    testEnum: 'TestEnum'
    updatedAt: 'Date'
    users: 'User'
    viewNumber: 'Int'
    viewNumber2: 'Int'
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
      where?: NexusGenInputs['LikeWhereInput'] | null; // LikeWhereInput
    }
    user: { // args
      id: string; // ID!
    }
    users: { // args
      limit: number | null; // Int
      offset?: number | null; // Int
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