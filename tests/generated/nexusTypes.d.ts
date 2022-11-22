/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { core, connectionPluginCore } from "nexus"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"

declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
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
  CountryWhereInput: { // input type
    arrayContains?: NexusGenScalars['Country'] | null; // Country
    equalTo?: NexusGenScalars['Country'] | null; // Country
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenScalars['Country'] | null; // Country
    greaterThanOrEqualTo?: NexusGenScalars['Country'] | null; // Country
    in?: Array<NexusGenScalars['Country'] | null> | null; // [Country]
    lessThan?: NexusGenScalars['Country'] | null; // Country
    lessThanOrEqualTo?: NexusGenScalars['Country'] | null; // Country
    notEqualTo?: NexusGenScalars['Country'] | null; // Country
    notIn?: Array<NexusGenScalars['Country'] | null> | null; // [Country]
  }
  CreatePostInput: { // input type
    createdBy?: NexusGenInputs['UserPointerInput'] | null; // UserPointerInput
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
  DeletePostInput: { // input type
    id: string; // ID!
  }
  DeleteUserInput: { // input type
    id: string; // ID!
  }
  EmailWhereInput: { // input type
    arrayContains?: NexusGenScalars['Email'] | null; // Email
    equalTo?: NexusGenScalars['Email'] | null; // Email
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenScalars['Email'] | null; // Email
    greaterThanOrEqualTo?: NexusGenScalars['Email'] | null; // Email
    in?: Array<NexusGenScalars['Email'] | null> | null; // [Email]
    lessThan?: NexusGenScalars['Email'] | null; // Email
    lessThanOrEqualTo?: NexusGenScalars['Email'] | null; // Email
    notEqualTo?: NexusGenScalars['Email'] | null; // Email
    notIn?: Array<NexusGenScalars['Email'] | null> | null; // [Email]
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
  NumberWhereInput: { // input type
    arrayContains?: NexusGenScalars['Number'] | null; // Number
    equalTo?: NexusGenScalars['Number'] | null; // Number
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenScalars['Number'] | null; // Number
    greaterThanOrEqualTo?: NexusGenScalars['Number'] | null; // Number
    in?: Array<NexusGenScalars['Number'] | null> | null; // [Number]
    lessThan?: NexusGenScalars['Number'] | null; // Number
    lessThanOrEqualTo?: NexusGenScalars['Number'] | null; // Number
    notEqualTo?: NexusGenScalars['Number'] | null; // Number
    notIn?: Array<NexusGenScalars['Number'] | null> | null; // [Number]
  }
  PhoneWhereInput: { // input type
    arrayContains?: NexusGenScalars['Phone'] | null; // Phone
    equalTo?: NexusGenScalars['Phone'] | null; // Phone
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenScalars['Phone'] | null; // Phone
    greaterThanOrEqualTo?: NexusGenScalars['Phone'] | null; // Phone
    in?: Array<NexusGenScalars['Phone'] | null> | null; // [Phone]
    lessThan?: NexusGenScalars['Phone'] | null; // Phone
    lessThanOrEqualTo?: NexusGenScalars['Phone'] | null; // Phone
    notEqualTo?: NexusGenScalars['Phone'] | null; // Phone
    notIn?: Array<NexusGenScalars['Phone'] | null> | null; // [Phone]
  }
  PostCollectionInput: { // input type
    createAndAdd?: Array<NexusGenInputs['CreatePostInput'] | null> | null; // [CreatePostInput]
    delete?: Array<string | null> | null; // [ID]
    update?: Array<NexusGenInputs['UpdatePostInput'] | null> | null; // [UpdatePostInput]
  }
  PostOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    createdBy?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    id?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    updatedAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
  }
  PostPointerInput: { // input type
    createAndLink?: NexusGenInputs['CreatePostInput'] | null; // CreatePostInput
    link?: string | null; // ID
  }
  PostRelationInput: { // input type
    add?: Array<string | null> | null; // [ID]
    createAndAdd?: Array<NexusGenInputs['CreatePostInput'] | null> | null; // [CreatePostInput]
    remove?: Array<string | null> | null; // [ID]
  }
  PostWhereInput: { // input type
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    createdBy?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    exists?: boolean | null; // Boolean
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
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
  UpdatePostFieldsInput: { // input type
    createdBy?: NexusGenInputs['UserPointerInput'] | null; // UserPointerInput
  }
  UpdatePostInput: { // input type
    fields: NexusGenInputs['UpdatePostFieldsInput']; // UpdatePostFieldsInput!
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
  UserOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    id?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    updatedAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    username?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
  }
  UserPointerInput: { // input type
    createAndLink?: NexusGenInputs['CreateUserInput'] | null; // CreateUserInput
    link?: string | null; // ID
  }
  UserRelationInput: { // input type
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
  Country: any
  Date: any
  Email: any
  Number: any
  Phone: any
  Upload: any
}

export interface NexusGenObjects {
  File: { // root type
    isLinked?: boolean | null; // Boolean
    name?: string | null; // String
    url?: string | null; // String
  }
  Mutation: {};
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  }
  Post: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    createdBy?: NexusGenRootTypes['User'] | null; // User
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  PostEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Post'] | null; // Post
  }
  PostsCollection: { // root type
    count?: number | null; // Int
    edges?: Array<NexusGenRootTypes['PostEdge'] | null> | null; // [PostEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  Query: {};
  User: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
    username: string; // String!
  }
  UserEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['User'] | null; // User
  }
  UsersCollection: { // root type
    count?: number | null; // Int
    edges?: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  File: { // field return type
    isLinked: boolean | null; // Boolean
    name: string | null; // String
    url: string | null; // String
  }
  Mutation: { // field return type
    createPost: NexusGenRootTypes['Post'] | null; // Post
    createUser: NexusGenRootTypes['User'] | null; // User
    deletePost: boolean | null; // Boolean
    deleteUser: boolean | null; // Boolean
    updatePost: NexusGenRootTypes['Post'] | null; // Post
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Post: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    createdBy: NexusGenRootTypes['User'] | null; // User
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  PostEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Post'] | null; // Post
  }
  PostsCollection: { // field return type
    count: number | null; // Int
    edges: Array<NexusGenRootTypes['PostEdge'] | null> | null; // [PostEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  Query: { // field return type
    post: NexusGenRootTypes['Post'] | null; // Post
    posts: NexusGenRootTypes['PostsCollection'] | null; // PostsCollection
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['UsersCollection'] | null; // UsersCollection
  }
  User: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
    username: string; // String!
  }
  UserEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['User'] | null; // User
  }
  UsersCollection: { // field return type
    count: number | null; // Int
    edges: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
}

export interface NexusGenFieldTypeNames {
  File: { // field return type name
    isLinked: 'Boolean'
    name: 'String'
    url: 'String'
  }
  Mutation: { // field return type name
    createPost: 'Post'
    createUser: 'User'
    deletePost: 'Boolean'
    deleteUser: 'Boolean'
    updatePost: 'Post'
    updateUser: 'User'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Post: { // field return type name
    createdAt: 'Date'
    createdBy: 'User'
    id: 'ID'
    updatedAt: 'Date'
  }
  PostEdge: { // field return type name
    cursor: 'String'
    node: 'Post'
  }
  PostsCollection: { // field return type name
    count: 'Int'
    edges: 'PostEdge'
    pageInfo: 'PageInfo'
  }
  Query: { // field return type name
    post: 'Post'
    posts: 'PostsCollection'
    user: 'User'
    users: 'UsersCollection'
  }
  User: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    updatedAt: 'Date'
    username: 'String'
  }
  UserEdge: { // field return type name
    cursor: 'String'
    node: 'User'
  }
  UsersCollection: { // field return type name
    count: 'Int'
    edges: 'UserEdge'
    pageInfo: 'PageInfo'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createPost: { // args
      input: NexusGenInputs['CreatePostInput']; // CreatePostInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    deletePost: { // args
      input: NexusGenInputs['DeletePostInput']; // DeletePostInput!
    }
    deleteUser: { // args
      input: NexusGenInputs['DeleteUserInput']; // DeleteUserInput!
    }
    updatePost: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['UpdatePostInput']; // UpdatePostInput!
    }
    updateUser: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Query: {
    post: { // args
      id: string; // ID!
    }
    posts: { // args
      limit?: number | null; // Int
      offset?: number | null; // Int
      orderBy?: NexusGenInputs['PostOrderByInput'] | null; // PostOrderByInput
      where?: NexusGenInputs['PostWhereInput'] | null; // PostWhereInput
    }
    user: { // args
      id: string; // ID!
    }
    users: { // args
      limit?: number | null; // Int
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
    
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
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