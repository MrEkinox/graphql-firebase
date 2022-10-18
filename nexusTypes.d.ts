/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context as ctx } from "./context"
import type { core, connectionPluginCore } from "nexus"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Upload";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CreateMissionInput: { // input type
    name?: string | null; // String
    users?: NexusGenInputs['UserRelationInput'] | null; // UserRelationInput
  }
  CreateUserInput: { // input type
    firstname: string; // String!
    lastname: string; // String!
    missions?: NexusGenInputs['MissionRelationInput'] | null; // MissionRelationInput
    picture?: NexusGenScalars['Upload'] | null; // Upload
  }
  MissionPointerInput: { // input type
    createAndLink?: NexusGenInputs['CreateMissionInput'] | null; // CreateMissionInput
    link?: string | null; // ID
  }
  MissionRelationInput: { // input type
    add?: string[] | null; // [ID!]
    createAndAdd?: NexusGenInputs['CreateMissionInput'][] | null; // [CreateMissionInput!]
    remove?: string[] | null; // [ID!]
  }
  UpdateMissionFieldsInput: { // input type
    name?: string | null; // String
    users?: NexusGenInputs['UserRelationInput'] | null; // UserRelationInput
  }
  UpdateMissionInput: { // input type
    fields: NexusGenInputs['UpdateMissionFieldsInput']; // UpdateMissionFieldsInput!
    id: string; // ID!
  }
  UpdateUserFieldsInput: { // input type
    firstname?: string | null; // String
    lastname?: string | null; // String
    missions?: NexusGenInputs['MissionRelationInput'] | null; // MissionRelationInput
    picture?: NexusGenScalars['Upload'] | null; // Upload
  }
  UpdateUserInput: { // input type
    fields: NexusGenInputs['UpdateUserFieldsInput']; // UpdateUserFieldsInput!
    id: string; // ID!
  }
  UserPointerInput: { // input type
    createAndLink?: NexusGenInputs['CreateUserInput'] | null; // CreateUserInput
    link?: string | null; // ID
  }
  UserRelationInput: { // input type
    add?: string[] | null; // [ID!]
    createAndAdd?: NexusGenInputs['CreateUserInput'][] | null; // [CreateUserInput!]
    remove?: string[] | null; // [ID!]
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Upload: any
}

export interface NexusGenObjects {
  FileInfo: { // root type
    name?: string | null; // String
    url?: string | null; // String
  }
  Mission: { // root type
    name?: string | null; // String
    users?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  MissionConnection: { // root type
    edges?: Array<NexusGenRootTypes['MissionEdge'] | null> | null; // [MissionEdge]
    nodes?: Array<NexusGenRootTypes['Mission'] | null> | null; // [Mission]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  MissionEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Mission'] | null; // Mission
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
    firstname: string; // String!
    lastname: string; // String!
    missions?: Array<NexusGenRootTypes['Mission'] | null> | null; // [Mission]
    picture?: NexusGenRootTypes['FileInfo'] | null; // FileInfo
  }
  UserConnection: { // root type
    edges?: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    nodes?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
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

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  FileInfo: { // field return type
    name: string | null; // String
    url: string | null; // String
  }
  Mission: { // field return type
    name: string | null; // String
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  MissionConnection: { // field return type
    edges: Array<NexusGenRootTypes['MissionEdge'] | null> | null; // [MissionEdge]
    nodes: Array<NexusGenRootTypes['Mission'] | null> | null; // [Mission]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  MissionEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Mission'] | null; // Mission
  }
  Mutation: { // field return type
    createMission: NexusGenRootTypes['Mission'] | null; // Mission
    createUser: NexusGenRootTypes['User'] | null; // User
    updateMission: NexusGenRootTypes['Mission'] | null; // Mission
    updateUser: NexusGenRootTypes['User'] | null; // User
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Query: { // field return type
    mission: NexusGenRootTypes['Mission'] | null; // Mission
    missions: NexusGenRootTypes['MissionConnection'] | null; // MissionConnection
    user: NexusGenRootTypes['User'] | null; // User
    users: NexusGenRootTypes['UserConnection'] | null; // UserConnection
  }
  User: { // field return type
    firstname: string; // String!
    lastname: string; // String!
    missions: Array<NexusGenRootTypes['Mission'] | null> | null; // [Mission]
    picture: NexusGenRootTypes['FileInfo'] | null; // FileInfo
  }
  UserConnection: { // field return type
    edges: Array<NexusGenRootTypes['UserEdge'] | null> | null; // [UserEdge]
    nodes: Array<NexusGenRootTypes['User'] | null> | null; // [User]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  UserEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['User'] | null; // User
  }
}

export interface NexusGenFieldTypeNames {
  FileInfo: { // field return type name
    name: 'String'
    url: 'String'
  }
  Mission: { // field return type name
    name: 'String'
    users: 'User'
  }
  MissionConnection: { // field return type name
    edges: 'MissionEdge'
    nodes: 'Mission'
    pageInfo: 'PageInfo'
  }
  MissionEdge: { // field return type name
    cursor: 'String'
    node: 'Mission'
  }
  Mutation: { // field return type name
    createMission: 'Mission'
    createUser: 'User'
    updateMission: 'Mission'
    updateUser: 'User'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: { // field return type name
    mission: 'Mission'
    missions: 'MissionConnection'
    user: 'User'
    users: 'UserConnection'
  }
  User: { // field return type name
    firstname: 'String'
    lastname: 'String'
    missions: 'Mission'
    picture: 'FileInfo'
  }
  UserConnection: { // field return type name
    edges: 'UserEdge'
    nodes: 'User'
    pageInfo: 'PageInfo'
  }
  UserEdge: { // field return type name
    cursor: 'String'
    node: 'User'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createMission: { // args
      input: NexusGenInputs['CreateMissionInput']; // CreateMissionInput!
    }
    createUser: { // args
      input: NexusGenInputs['CreateUserInput']; // CreateUserInput!
    }
    updateMission: { // args
      input: NexusGenInputs['UpdateMissionInput']; // UpdateMissionInput!
    }
    updateUser: { // args
      input: NexusGenInputs['UpdateUserInput']; // UpdateUserInput!
    }
  }
  Query: {
    mission: { // args
      id: string; // ID!
    }
    missions: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
    user: { // args
      id: string; // ID!
    }
    users: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

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
  context: ctx;
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