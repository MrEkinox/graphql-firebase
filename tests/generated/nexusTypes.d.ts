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
  CreateGroupInput: { // input type
    messages?: NexusGenInputs['GroupMessageCollectionInput'] | null; // GroupMessageCollectionInput
    name?: string | null; // String
    users: NexusGenInputs['UserRelationInput']; // UserRelationInput!
  }
  CreateGroupMessageInput: { // input type
    createdBy?: NexusGenInputs['UserPointerInput'] | null; // UserPointerInput
    image?: NexusGenInputs['UploadFileInput'] | null; // UploadFileInput
    text?: string | null; // String
  }
  CreateUserInput: { // input type
    avatar?: NexusGenInputs['UploadFileInput'] | null; // UploadFileInput
    birthDate?: NexusGenScalars['Date'] | null; // Date
    customEnum?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    customScalar?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    customType?: NexusGenInputs['UserCustomTypeInput'] | null; // UserCustomTypeInput
    email: string; // String!
    number?: NexusGenScalars['Number'] | null; // Number
    username: string; // String!
  }
  CustomEnumWhereInput: { // input type
    equalTo?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    greaterThanOrEqualTo?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    in?: Array<NexusGenEnums['CustomEnum'] | null> | null; // [CustomEnum]
    lessThan?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    lessThanOrEqualTo?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    notEqualTo?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    notIn?: Array<NexusGenEnums['CustomEnum'] | null> | null; // [CustomEnum]
  }
  CustomScalarWhereInput: { // input type
    equalTo?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    exists?: boolean | null; // Boolean
    greaterThan?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    greaterThanOrEqualTo?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    in?: Array<NexusGenScalars['CustomScalar'] | null> | null; // [CustomScalar]
    lessThan?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    lessThanOrEqualTo?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    notEqualTo?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    notIn?: Array<NexusGenScalars['CustomScalar'] | null> | null; // [CustomScalar]
  }
  DateWhereInput: { // input type
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
  DeleteGroupInput: { // input type
    id: string; // ID!
  }
  DeleteGroupMessageInput: { // input type
    id: string; // ID!
  }
  DeleteUserInput: { // input type
    id: string; // ID!
  }
  EmailWhereInput: { // input type
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
  GroupCollectionInput: { // input type
    createAndAdd?: Array<NexusGenInputs['CreateGroupInput'] | null> | null; // [CreateGroupInput]
    delete?: Array<string | null> | null; // [ID]
  }
  GroupMessageCollectionInput: { // input type
    createAndAdd?: Array<NexusGenInputs['CreateGroupMessageInput'] | null> | null; // [CreateGroupMessageInput]
    delete?: Array<string | null> | null; // [ID]
  }
  GroupMessageOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    createdBy?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    id?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    image?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    text?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    updatedAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
  }
  GroupMessagePointerInput: { // input type
    createAndLink?: NexusGenInputs['CreateGroupMessageInput'] | null; // CreateGroupMessageInput
    link?: string | null; // ID
  }
  GroupMessageRelationInput: { // input type
    add?: Array<string | null> | null; // [ID]
    createAndAdd?: Array<NexusGenInputs['CreateGroupMessageInput'] | null> | null; // [CreateGroupMessageInput]
    remove?: Array<string | null> | null; // [ID]
  }
  GroupMessageWhereInput: { // input type
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    createdBy?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    image?: NexusGenInputs['FileWhereInput'] | null; // FileWhereInput
    text?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
  }
  GroupOrderByInput: { // input type
    createdAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    id?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    messages?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    name?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    updatedAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    users?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
  }
  GroupPointerInput: { // input type
    createAndLink?: NexusGenInputs['CreateGroupInput'] | null; // CreateGroupInput
    link?: string | null; // ID
  }
  GroupRelationInput: { // input type
    add?: Array<string | null> | null; // [ID]
    createAndAdd?: Array<NexusGenInputs['CreateGroupInput'] | null> | null; // [CreateGroupInput]
    remove?: Array<string | null> | null; // [ID]
  }
  GroupWhereInput: { // input type
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    messages?: NexusGenInputs['GroupMessageWhereInput'] | null; // GroupMessageWhereInput
    name?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    users?: NexusGenInputs['UserWhereInput'] | null; // UserWhereInput
  }
  IDWhereInput: { // input type
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
  StringWhereInput: { // input type
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
  UpdateGroupFieldsInput: { // input type
    messages?: NexusGenInputs['GroupMessageCollectionInput'] | null; // GroupMessageCollectionInput
    name?: string | null; // String
    users?: NexusGenInputs['UserRelationInput'] | null; // UserRelationInput
  }
  UpdateGroupInput: { // input type
    fields: NexusGenInputs['UpdateGroupFieldsInput']; // UpdateGroupFieldsInput!
    id: string; // ID!
  }
  UpdateGroupMessageFieldsInput: { // input type
    createdBy?: NexusGenInputs['UserPointerInput'] | null; // UserPointerInput
    image?: NexusGenInputs['UploadFileInput'] | null; // UploadFileInput
    text?: string | null; // String
  }
  UpdateGroupMessageInput: { // input type
    fields: NexusGenInputs['UpdateGroupMessageFieldsInput']; // UpdateGroupMessageFieldsInput!
    id: string; // ID!
  }
  UpdateUserFieldsInput: { // input type
    avatar?: NexusGenInputs['UploadFileInput'] | null; // UploadFileInput
    birthDate?: NexusGenScalars['Date'] | null; // Date
    customEnum?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    customScalar?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    customType?: NexusGenInputs['UserCustomTypeInput'] | null; // UserCustomTypeInput
    email?: string | null; // String
    number?: NexusGenScalars['Number'] | null; // Number
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
  }
  UserCustomTypeCustomType2Input: { // input type
    test?: string | null; // String
  }
  UserCustomTypeCustomType2WhereInput: { // input type
    test?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
  }
  UserCustomTypeInput: { // input type
    customType2?: NexusGenInputs['UserCustomTypeCustomType2Input'] | null; // UserCustomTypeCustomType2Input
    test: string; // String!
  }
  UserCustomTypeWhereInput: { // input type
    customType2?: NexusGenInputs['UserCustomTypeCustomType2WhereInput'] | null; // UserCustomTypeCustomType2WhereInput
    test?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
  }
  UserOrderByInput: { // input type
    avatar?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    birthDate?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    createdAt?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    customEnum?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    customScalar?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    customType?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    email?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    id?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
    number?: NexusGenEnums['OrderByEnum'] | null; // OrderByEnum
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
    avatar?: NexusGenInputs['FileWhereInput'] | null; // FileWhereInput
    birthDate?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    createdAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    customEnum?: NexusGenInputs['CustomEnumWhereInput'] | null; // CustomEnumWhereInput
    customScalar?: NexusGenInputs['CustomScalarWhereInput'] | null; // CustomScalarWhereInput
    customType?: NexusGenInputs['UserCustomTypeWhereInput'] | null; // UserCustomTypeWhereInput
    email?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
    id?: NexusGenInputs['IDWhereInput'] | null; // IDWhereInput
    number?: NexusGenInputs['NumberWhereInput'] | null; // NumberWhereInput
    updatedAt?: NexusGenInputs['DateWhereInput'] | null; // DateWhereInput
    username?: NexusGenInputs['StringWhereInput'] | null; // StringWhereInput
  }
}

export interface NexusGenEnums {
  CustomEnum: "Member1" | "Member2"
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
  CustomScalar: any
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
  Group: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    name?: string | null; // String
    updatedAt: NexusGenScalars['Date']; // Date!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  GroupEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Group'] | null; // Group
  }
  GroupMessage: { // root type
    createdAt: NexusGenScalars['Date']; // Date!
    createdBy?: NexusGenRootTypes['User'] | null; // User
    groupId: string; // ID!
    id: string; // ID!
    image?: NexusGenRootTypes['File'] | null; // File
    text?: string | null; // String
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  GroupMessageEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['GroupMessage'] | null; // GroupMessage
  }
  GroupMessagesCollection: { // root type
    count?: number | null; // Int
    edges?: Array<NexusGenRootTypes['GroupMessageEdge'] | null> | null; // [GroupMessageEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  GroupsCollection: { // root type
    count?: number | null; // Int
    edges?: Array<NexusGenRootTypes['GroupEdge'] | null> | null; // [GroupEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
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
    avatar?: NexusGenRootTypes['File'] | null; // File
    birthDate?: NexusGenScalars['Date'] | null; // Date
    createdAt: NexusGenScalars['Date']; // Date!
    customEnum?: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    customScalar?: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    customType?: NexusGenRootTypes['UserCustomType'] | null; // UserCustomType
    email: string; // String!
    id: string; // ID!
    updatedAt: NexusGenScalars['Date']; // Date!
    username: string; // String!
  }
  UserCustomType: { // root type
    customType2?: NexusGenRootTypes['UserCustomTypeCustomType2'] | null; // UserCustomTypeCustomType2
    test: string; // String!
  }
  UserCustomTypeCustomType2: { // root type
    test?: string | null; // String
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
  Group: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    id: string; // ID!
    messages: NexusGenRootTypes['GroupMessagesCollection'] | null; // GroupMessagesCollection
    name: string | null; // String
    updatedAt: NexusGenScalars['Date']; // Date!
    users: NexusGenRootTypes['User'][]; // [User!]!
  }
  GroupEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Group'] | null; // Group
  }
  GroupMessage: { // field return type
    createdAt: NexusGenScalars['Date']; // Date!
    createdBy: NexusGenRootTypes['User'] | null; // User
    groupId: string; // ID!
    id: string; // ID!
    image: NexusGenRootTypes['File'] | null; // File
    text: string | null; // String
    updatedAt: NexusGenScalars['Date']; // Date!
  }
  GroupMessageEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['GroupMessage'] | null; // GroupMessage
  }
  GroupMessagesCollection: { // field return type
    count: number | null; // Int
    edges: Array<NexusGenRootTypes['GroupMessageEdge'] | null> | null; // [GroupMessageEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  GroupsCollection: { // field return type
    count: number | null; // Int
    edges: Array<NexusGenRootTypes['GroupEdge'] | null> | null; // [GroupEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  Mutation: { // field return type
    createGroup: NexusGenRootTypes['Group'] | null; // Group
    createGroupMessage: NexusGenRootTypes['GroupMessage'] | null; // GroupMessage
    createUser: NexusGenRootTypes['User'] | null; // User
    deleteGroup: boolean | null; // Boolean
    deleteGroupMessage: boolean | null; // Boolean
    deleteUser: boolean | null; // Boolean
    updateGroup: NexusGenRootTypes['Group'] | null; // Group
    updateGroupMessage: NexusGenRootTypes['GroupMessage'] | null; // GroupMessage
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Query: { // field return type
    group: NexusGenRootTypes['Group'] | null; // Group
    groupMessage: NexusGenRootTypes['GroupMessage'] | null; // GroupMessage
    groupMessages: NexusGenRootTypes['GroupMessagesCollection'] | null; // GroupMessagesCollection
    groups: NexusGenRootTypes['GroupsCollection'] | null; // GroupsCollection
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['UsersCollection'] | null; // UsersCollection
  }
  User: { // field return type
    avatar: NexusGenRootTypes['File'] | null; // File
    birthDate: NexusGenScalars['Date'] | null; // Date
    createdAt: NexusGenScalars['Date']; // Date!
    customEnum: NexusGenEnums['CustomEnum'] | null; // CustomEnum
    customScalar: NexusGenScalars['CustomScalar'] | null; // CustomScalar
    customType: NexusGenRootTypes['UserCustomType'] | null; // UserCustomType
    email: string; // String!
    id: string; // ID!
    number: NexusGenScalars['Number'] | null; // Number
    updatedAt: NexusGenScalars['Date']; // Date!
    username: string; // String!
  }
  UserCustomType: { // field return type
    customType2: NexusGenRootTypes['UserCustomTypeCustomType2'] | null; // UserCustomTypeCustomType2
    test: string; // String!
  }
  UserCustomTypeCustomType2: { // field return type
    test: string | null; // String
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
  Group: { // field return type name
    createdAt: 'Date'
    id: 'ID'
    messages: 'GroupMessagesCollection'
    name: 'String'
    updatedAt: 'Date'
    users: 'User'
  }
  GroupEdge: { // field return type name
    cursor: 'String'
    node: 'Group'
  }
  GroupMessage: { // field return type name
    createdAt: 'Date'
    createdBy: 'User'
    groupId: 'ID'
    id: 'ID'
    image: 'File'
    text: 'String'
    updatedAt: 'Date'
  }
  GroupMessageEdge: { // field return type name
    cursor: 'String'
    node: 'GroupMessage'
  }
  GroupMessagesCollection: { // field return type name
    count: 'Int'
    edges: 'GroupMessageEdge'
    pageInfo: 'PageInfo'
  }
  GroupsCollection: { // field return type name
    count: 'Int'
    edges: 'GroupEdge'
    pageInfo: 'PageInfo'
  }
  Mutation: { // field return type name
    createGroup: 'Group'
    createGroupMessage: 'GroupMessage'
    createUser: 'User'
    deleteGroup: 'Boolean'
    deleteGroupMessage: 'Boolean'
    deleteUser: 'Boolean'
    updateGroup: 'Group'
    updateGroupMessage: 'GroupMessage'
    updateUser: 'User'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: { // field return type name
    group: 'Group'
    groupMessage: 'GroupMessage'
    groupMessages: 'GroupMessagesCollection'
    groups: 'GroupsCollection'
    user: 'User'
    users: 'UsersCollection'
  }
  User: { // field return type name
    avatar: 'File'
    birthDate: 'Date'
    createdAt: 'Date'
    customEnum: 'CustomEnum'
    customScalar: 'CustomScalar'
    customType: 'UserCustomType'
    email: 'String'
    id: 'ID'
    number: 'Number'
    updatedAt: 'Date'
    username: 'String'
  }
  UserCustomType: { // field return type name
    customType2: 'UserCustomTypeCustomType2'
    test: 'String'
  }
  UserCustomTypeCustomType2: { // field return type name
    test: 'String'
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
  Group: {
    messages: { // args
      limit: number | null; // Int
      offset?: number | null; // Int
      orderBy?: NexusGenInputs['GroupMessageOrderByInput'] | null; // GroupMessageOrderByInput
      where?: NexusGenInputs['GroupMessageWhereInput'] | null; // GroupMessageWhereInput
    }
  }
  Mutation: {
    createGroup: { // args
      input: NexusGenInputs['CreateGroupInput']; // CreateGroupInput!
    }
    createGroupMessage: { // args
      groupId: string; // ID!
      input: NexusGenInputs['CreateGroupMessageInput']; // CreateGroupMessageInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    deleteGroup: { // args
      input: NexusGenInputs['DeleteGroupInput']; // DeleteGroupInput!
    }
    deleteGroupMessage: { // args
      groupId: string; // ID!
      input: NexusGenInputs['DeleteGroupMessageInput']; // DeleteGroupMessageInput!
    }
    deleteUser: { // args
      input: NexusGenInputs['DeleteUserInput']; // DeleteUserInput!
    }
    updateGroup: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['UpdateGroupInput']; // UpdateGroupInput!
    }
    updateGroupMessage: { // args
      force?: boolean | null; // Boolean
      groupId: string; // ID!
      input: NexusGenInputs['UpdateGroupMessageInput']; // UpdateGroupMessageInput!
    }
    updateUser: { // args
      force?: boolean | null; // Boolean
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Query: {
    group: { // args
      id: string; // ID!
    }
    groupMessage: { // args
      groupId: string; // ID!
      id: string; // ID!
    }
    groupMessages: { // args
      groupId: string; // ID!
      limit?: number | null; // Int
      offset?: number | null; // Int
      orderBy?: NexusGenInputs['GroupMessageOrderByInput'] | null; // GroupMessageOrderByInput
      where?: NexusGenInputs['GroupMessageWhereInput'] | null; // GroupMessageWhereInput
    }
    groups: { // args
      limit?: number | null; // Int
      offset?: number | null; // Int
      orderBy?: NexusGenInputs['GroupOrderByInput'] | null; // GroupOrderByInput
      where?: NexusGenInputs['GroupWhereInput'] | null; // GroupWhereInput
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