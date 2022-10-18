import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Any: any;
  /** A country code as defined by ISO 3166-1 alpha-2 */
  Country: string;
  CustomScalar: any;
  Date: Date;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  Email: string;
  Number: number;
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  Phone: string;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type BooleanWhereInput = {
  equalTo?: InputMaybe<Scalars['Boolean']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['Boolean']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  lessThan?: InputMaybe<Scalars['Boolean']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
};

export type CountryWhereInput = {
  equalTo?: InputMaybe<Scalars['Country']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['Country']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Country']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Country']>>>;
  lessThan?: InputMaybe<Scalars['Country']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Country']>;
  notEqualTo?: InputMaybe<Scalars['Country']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Country']>>>;
};

export type CreateGroupInput = {
  messages?: InputMaybe<GroupMessageCollectionInput>;
  name?: InputMaybe<Scalars['String']>;
  users: UserRelationInput;
};

export type CreateGroupMessageInput = {
  createdBy?: InputMaybe<UserPointerInput>;
  image?: InputMaybe<Scalars['Upload']>;
  text?: InputMaybe<Scalars['String']>;
};

export type CreateUserInput = {
  avatar?: InputMaybe<Scalars['Upload']>;
  birthDate?: InputMaybe<Scalars['Date']>;
  customEnum?: InputMaybe<CustomEnum>;
  customScalar?: InputMaybe<Scalars['CustomScalar']>;
  customType?: InputMaybe<UserCustomTypeInput>;
  email: Scalars['String'];
  likedBy?: InputMaybe<UserRelationInput>;
  number?: InputMaybe<Scalars['Number']>;
  username: Scalars['String'];
};

export type CustomEnum =
  | 'Member1'
  | 'Member2';

export type CustomEnumWhereInput = {
  equalTo?: InputMaybe<CustomEnum>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<CustomEnum>;
  greaterThanOrEqualTo?: InputMaybe<CustomEnum>;
  in?: InputMaybe<Array<InputMaybe<CustomEnum>>>;
  lessThan?: InputMaybe<CustomEnum>;
  lessThanOrEqualTo?: InputMaybe<CustomEnum>;
  notEqualTo?: InputMaybe<CustomEnum>;
  notIn?: InputMaybe<Array<InputMaybe<CustomEnum>>>;
};

export type CustomScalarWhereInput = {
  equalTo?: InputMaybe<Scalars['CustomScalar']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['CustomScalar']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['CustomScalar']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['CustomScalar']>>>;
  lessThan?: InputMaybe<Scalars['CustomScalar']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['CustomScalar']>;
  notEqualTo?: InputMaybe<Scalars['CustomScalar']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['CustomScalar']>>>;
};

export type DateWhereInput = {
  equalTo?: InputMaybe<Scalars['Date']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['Date']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Date']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  lessThan?: InputMaybe<Scalars['Date']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Date']>;
  notEqualTo?: InputMaybe<Scalars['Date']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
};

export type DeleteGroupInput = {
  id: Scalars['ID'];
};

export type DeleteGroupMessageInput = {
  id: Scalars['ID'];
};

export type DeleteUserInput = {
  id: Scalars['ID'];
};

export type EmailWhereInput = {
  equalTo?: InputMaybe<Scalars['Email']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['Email']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Email']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Email']>>>;
  lessThan?: InputMaybe<Scalars['Email']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Email']>;
  notEqualTo?: InputMaybe<Scalars['Email']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Email']>>>;
};

export type File = {
  __typename?: 'File';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type FileWhereInput = {
  exists?: InputMaybe<Scalars['Boolean']>;
};

export type Group = {
  __typename?: 'Group';
  createdAt: Scalars['Date'];
  id: Scalars['ID'];
  messages?: Maybe<MessagesCollection>;
  name?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
  users: Array<User>;
};


export type GroupMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GroupMessageOrderByInput>;
  where?: InputMaybe<GroupMessageWhereInput>;
};

export type GroupCollectionInput = {
  createAndAdd?: InputMaybe<Array<InputMaybe<CreateGroupInput>>>;
  delete?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type GroupEdge = {
  __typename?: 'GroupEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<Group>;
};

export type GroupMessage = {
  __typename?: 'GroupMessage';
  createdAt: Scalars['Date'];
  createdBy?: Maybe<User>;
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  image?: Maybe<File>;
  text?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
};

export type GroupMessageCollectionInput = {
  createAndAdd?: InputMaybe<Array<InputMaybe<CreateGroupMessageInput>>>;
  delete?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type GroupMessageEdge = {
  __typename?: 'GroupMessageEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<GroupMessage>;
};

export type GroupMessageOrderByInput = {
  createdAt?: InputMaybe<OrderByEnum>;
  createdBy?: InputMaybe<OrderByEnum>;
  id?: InputMaybe<OrderByEnum>;
  image?: InputMaybe<OrderByEnum>;
  text?: InputMaybe<OrderByEnum>;
  updatedAt?: InputMaybe<OrderByEnum>;
};

export type GroupMessagePointerInput = {
  createAndLink?: InputMaybe<CreateGroupMessageInput>;
  link?: InputMaybe<Scalars['ID']>;
};

export type GroupMessageRelationInput = {
  add?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createAndAdd?: InputMaybe<Array<InputMaybe<CreateGroupMessageInput>>>;
  remove?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type GroupMessageWhereInput = {
  createdAt?: InputMaybe<DateWhereInput>;
  createdBy?: InputMaybe<UserWhereInput>;
  id?: InputMaybe<IdWhereInput>;
  image?: InputMaybe<FileWhereInput>;
  text?: InputMaybe<StringWhereInput>;
  updatedAt?: InputMaybe<DateWhereInput>;
};

export type GroupMessagesCollection = {
  __typename?: 'GroupMessagesCollection';
  count?: Maybe<Scalars['Int']>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<GroupMessageEdge>>>;
  /** Flattened list of GroupMessage type */
  nodes?: Maybe<Array<Maybe<GroupMessage>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type GroupOrderByInput = {
  createdAt?: InputMaybe<OrderByEnum>;
  id?: InputMaybe<OrderByEnum>;
  messages?: InputMaybe<OrderByEnum>;
  name?: InputMaybe<OrderByEnum>;
  updatedAt?: InputMaybe<OrderByEnum>;
  users?: InputMaybe<OrderByEnum>;
};

export type GroupPointerInput = {
  createAndLink?: InputMaybe<CreateGroupInput>;
  link?: InputMaybe<Scalars['ID']>;
};

export type GroupRelationInput = {
  add?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createAndAdd?: InputMaybe<Array<InputMaybe<CreateGroupInput>>>;
  remove?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type GroupWhereInput = {
  createdAt?: InputMaybe<DateWhereInput>;
  id?: InputMaybe<IdWhereInput>;
  messages?: InputMaybe<GroupMessageWhereInput>;
  name?: InputMaybe<StringWhereInput>;
  updatedAt?: InputMaybe<DateWhereInput>;
  users?: InputMaybe<UserWhereInput>;
};

export type GroupsCollection = {
  __typename?: 'GroupsCollection';
  count?: Maybe<Scalars['Int']>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<GroupEdge>>>;
  /** Flattened list of Group type */
  nodes?: Maybe<Array<Maybe<Group>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type IdWhereInput = {
  equalTo?: InputMaybe<Scalars['ID']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['ID']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  lessThan?: InputMaybe<Scalars['ID']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['ID']>;
  notEqualTo?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type MessagesCollection = {
  __typename?: 'MessagesCollection';
  count?: Maybe<Scalars['Int']>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<GroupMessageEdge>>>;
  /** Flattened list of GroupMessage type */
  nodes?: Maybe<Array<Maybe<GroupMessage>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type Mutation = {
  __typename?: 'Mutation';
  createGroup?: Maybe<Group>;
  createGroupMessage?: Maybe<GroupMessage>;
  createUser?: Maybe<User>;
  deleteGroup?: Maybe<Scalars['Boolean']>;
  deleteGroupMessage?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  updateGroup?: Maybe<Group>;
  updateGroupMessage?: Maybe<GroupMessage>;
  updateUser?: Maybe<User>;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateGroupMessageArgs = {
  groupId: Scalars['ID'];
  input: CreateGroupMessageInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteGroupArgs = {
  input: DeleteGroupInput;
};


export type MutationDeleteGroupMessageArgs = {
  groupId: Scalars['ID'];
  input: DeleteGroupMessageInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationUpdateGroupArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  input: UpdateGroupInput;
};


export type MutationUpdateGroupMessageArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  groupId: Scalars['ID'];
  input: UpdateGroupMessageInput;
};


export type MutationUpdateUserArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  input: UpdateUserInput;
};

export type NumberWhereInput = {
  equalTo?: InputMaybe<Scalars['Number']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['Number']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Number']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Number']>>>;
  lessThan?: InputMaybe<Scalars['Number']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Number']>;
  notEqualTo?: InputMaybe<Scalars['Number']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Number']>>>;
};

export type OrderByEnum =
  | 'asc'
  | 'desc';

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor?: Maybe<Scalars['String']>;
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PhoneWhereInput = {
  equalTo?: InputMaybe<Scalars['Phone']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['Phone']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Phone']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Phone']>>>;
  lessThan?: InputMaybe<Scalars['Phone']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Phone']>;
  notEqualTo?: InputMaybe<Scalars['Phone']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Phone']>>>;
};

export type Query = {
  __typename?: 'Query';
  group?: Maybe<Group>;
  groupMessage?: Maybe<GroupMessage>;
  groupMessages?: Maybe<GroupMessagesCollection>;
  groups?: Maybe<GroupsCollection>;
  user?: Maybe<User>;
  users?: Maybe<UsersCollection>;
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGroupMessageArgs = {
  groupId: Scalars['ID'];
  id: Scalars['ID'];
};


export type QueryGroupMessagesArgs = {
  groupId: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GroupMessageOrderByInput>;
  where?: InputMaybe<GroupMessageWhereInput>;
};


export type QueryGroupsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GroupOrderByInput>;
  where?: InputMaybe<GroupWhereInput>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserOrderByInput>;
  where?: InputMaybe<UserWhereInput>;
};

export type StringWhereInput = {
  equalTo?: InputMaybe<Scalars['String']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  greaterThan?: InputMaybe<Scalars['String']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lessThan?: InputMaybe<Scalars['String']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  notEqualTo?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type UpdateGroupFieldsInput = {
  messages?: InputMaybe<GroupMessageCollectionInput>;
  name?: InputMaybe<Scalars['String']>;
  users?: InputMaybe<UserRelationInput>;
};

export type UpdateGroupInput = {
  fields: UpdateGroupFieldsInput;
  id: Scalars['ID'];
};

export type UpdateGroupMessageFieldsInput = {
  createdBy?: InputMaybe<UserPointerInput>;
  image?: InputMaybe<Scalars['Upload']>;
  text?: InputMaybe<Scalars['String']>;
};

export type UpdateGroupMessageInput = {
  fields: UpdateGroupMessageFieldsInput;
  id: Scalars['ID'];
};

export type UpdateUserFieldsInput = {
  avatar?: InputMaybe<Scalars['Upload']>;
  birthDate?: InputMaybe<Scalars['Date']>;
  customEnum?: InputMaybe<CustomEnum>;
  customScalar?: InputMaybe<Scalars['CustomScalar']>;
  customType?: InputMaybe<UserCustomTypeInput>;
  email?: InputMaybe<Scalars['String']>;
  likedBy?: InputMaybe<UserRelationInput>;
  number?: InputMaybe<Scalars['Number']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateUserInput = {
  fields: UpdateUserFieldsInput;
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<File>;
  birthDate?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  customEnum?: Maybe<CustomEnum>;
  customScalar?: Maybe<Scalars['CustomScalar']>;
  customType?: Maybe<UserCustomType>;
  email: Scalars['String'];
  id: Scalars['ID'];
  likedBy?: Maybe<Array<Maybe<User>>>;
  number?: Maybe<Scalars['Number']>;
  updatedAt: Scalars['Date'];
  username: Scalars['String'];
};

export type UserCollectionInput = {
  createAndAdd?: InputMaybe<Array<InputMaybe<CreateUserInput>>>;
  delete?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type UserCustomType = {
  __typename?: 'UserCustomType';
  customType2?: Maybe<UserCustomTypeCustomType2>;
  test: Scalars['String'];
};

export type UserCustomTypeCustomType2 = {
  __typename?: 'UserCustomTypeCustomType2';
  test?: Maybe<Scalars['String']>;
};

export type UserCustomTypeCustomType2Input = {
  test?: InputMaybe<Scalars['String']>;
};

export type UserCustomTypeCustomType2InputWhereInput = {
  test?: InputMaybe<StringWhereInput>;
};

export type UserCustomTypeInput = {
  customType2?: InputMaybe<UserCustomTypeCustomType2Input>;
  test: Scalars['String'];
};

export type UserCustomTypeInputWhereInput = {
  customType2?: InputMaybe<UserCustomTypeCustomType2InputWhereInput>;
  test?: InputMaybe<StringWhereInput>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<User>;
};

export type UserOrderByInput = {
  avatar?: InputMaybe<OrderByEnum>;
  birthDate?: InputMaybe<OrderByEnum>;
  createdAt?: InputMaybe<OrderByEnum>;
  customEnum?: InputMaybe<OrderByEnum>;
  customScalar?: InputMaybe<OrderByEnum>;
  customType?: InputMaybe<OrderByEnum>;
  email?: InputMaybe<OrderByEnum>;
  id?: InputMaybe<OrderByEnum>;
  likedBy?: InputMaybe<OrderByEnum>;
  number?: InputMaybe<OrderByEnum>;
  updatedAt?: InputMaybe<OrderByEnum>;
  username?: InputMaybe<OrderByEnum>;
};

export type UserPointerInput = {
  createAndLink?: InputMaybe<CreateUserInput>;
  link?: InputMaybe<Scalars['ID']>;
};

export type UserRelationInput = {
  add?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  createAndAdd?: InputMaybe<Array<InputMaybe<CreateUserInput>>>;
  remove?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type UserWhereInput = {
  avatar?: InputMaybe<FileWhereInput>;
  birthDate?: InputMaybe<DateWhereInput>;
  createdAt?: InputMaybe<DateWhereInput>;
  customEnum?: InputMaybe<CustomEnumWhereInput>;
  customScalar?: InputMaybe<CustomScalarWhereInput>;
  email?: InputMaybe<StringWhereInput>;
  id?: InputMaybe<IdWhereInput>;
  likedBy?: InputMaybe<UserWhereInput>;
  number?: InputMaybe<NumberWhereInput>;
  updatedAt?: InputMaybe<DateWhereInput>;
  username?: InputMaybe<StringWhereInput>;
};

export type UsersCollection = {
  __typename?: 'UsersCollection';
  count?: Maybe<Scalars['Int']>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  /** Flattened list of User type */
  nodes?: Maybe<Array<Maybe<User>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type CreateUserMutationVariables = Exact<{
  fields: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser?: { __typename?: 'User', id: string, username: string, email: string, birthDate?: Date | null, avatar?: { __typename?: 'File', name?: string | null, url?: string | null } | null } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users?: { __typename?: 'UsersCollection', edges?: Array<{ __typename?: 'UserEdge', node?: { __typename?: 'User', id: string, username: string, email: string, avatar?: { __typename?: 'File', name?: string | null, url?: string | null } | null } | null } | null> | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID'];
  fields: UpdateUserFieldsInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'User', id: string, username: string, email: string, avatar?: { __typename?: 'File', name?: string | null, url?: string | null } | null } | null };

export type CreateGroupMutationVariables = Exact<{
  fields: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup?: { __typename?: 'Group', id: string, name?: string | null, users: Array<{ __typename?: 'User', id: string, username: string }> } | null };

export type GetGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGroupsQuery = { __typename?: 'Query', groups?: { __typename?: 'GroupsCollection', edges?: Array<{ __typename?: 'GroupEdge', node?: { __typename?: 'Group', id: string, messages?: { __typename?: 'MessagesCollection', edges?: Array<{ __typename?: 'GroupMessageEdge', node?: { __typename?: 'GroupMessage', id: string } | null } | null> | null } | null } | null } | null> | null } | null };

export type GetGroupsByUserIdQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetGroupsByUserIdQuery = { __typename?: 'Query', groups?: { __typename?: 'GroupsCollection', edges?: Array<{ __typename?: 'GroupEdge', node?: { __typename?: 'Group', id: string, messages?: { __typename?: 'MessagesCollection', edges?: Array<{ __typename?: 'GroupMessageEdge', node?: { __typename?: 'GroupMessage', id: string, text?: string | null, createdBy?: { __typename?: 'User', id: string } | null } | null } | null> | null } | null } | null } | null> | null } | null };

export type GetGroupsByMessageCreatedByUserIdQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type GetGroupsByMessageCreatedByUserIdQuery = { __typename?: 'Query', groups?: { __typename?: 'GroupsCollection', edges?: Array<{ __typename?: 'GroupEdge', node?: { __typename?: 'Group', id: string, messages?: { __typename?: 'MessagesCollection', edges?: Array<{ __typename?: 'GroupMessageEdge', node?: { __typename?: 'GroupMessage', id: string, text?: string | null, createdBy?: { __typename?: 'User', id: string } | null } | null } | null> | null } | null } | null } | null> | null } | null };

export type GetGroupMessageCreatedByUserIdQueryVariables = Exact<{
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type GetGroupMessageCreatedByUserIdQuery = { __typename?: 'Query', groupMessages?: { __typename?: 'GroupMessagesCollection', edges?: Array<{ __typename?: 'GroupMessageEdge', node?: { __typename?: 'GroupMessage', id: string } | null } | null> | null } | null };

export type CreateGroupMessageMutationVariables = Exact<{
  groupId: Scalars['ID'];
  fields: CreateGroupMessageInput;
}>;


export type CreateGroupMessageMutation = { __typename?: 'Mutation', createGroupMessage?: { __typename?: 'GroupMessage', id: string, text?: string | null, createdBy?: { __typename?: 'User', id: string } | null } | null };

export type DeleteGroupMessageMutationVariables = Exact<{
  groupId: Scalars['ID'];
  messageId: Scalars['ID'];
}>;


export type DeleteGroupMessageMutation = { __typename?: 'Mutation', deleteGroupMessage?: boolean | null };

export type DeleteGroupMutationVariables = Exact<{
  groupId: Scalars['ID'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup?: boolean | null };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: boolean | null };


export const CreateUserDocument = gql`
    mutation createUser($fields: CreateUserInput!) {
  createUser(input: $fields) {
    id
    username
    email
    birthDate
    avatar {
      name
      url
    }
  }
}
    `;
export const GetUsersDocument = gql`
    query getUsers {
  users {
    edges {
      node {
        id
        username
        email
        avatar {
          name
          url
        }
      }
    }
  }
}
    `;
export const UpdateUserDocument = gql`
    mutation updateUser($id: ID!, $fields: UpdateUserFieldsInput!) {
  updateUser(input: {id: $id, fields: $fields}) {
    id
    username
    email
    avatar {
      name
      url
    }
  }
}
    `;
export const CreateGroupDocument = gql`
    mutation createGroup($fields: CreateGroupInput!) {
  createGroup(input: $fields) {
    id
    name
    users {
      id
      username
    }
  }
}
    `;
export const GetGroupsDocument = gql`
    query getGroups {
  groups {
    edges {
      node {
        id
        messages {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
}
    `;
export const GetGroupsByUserIdDocument = gql`
    query getGroupsByUserId($userId: ID!) {
  groups(where: {users: {id: {equalTo: $userId}}}) {
    edges {
      node {
        id
        messages {
          edges {
            node {
              id
              text
              createdBy {
                id
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetGroupsByMessageCreatedByUserIdDocument = gql`
    query getGroupsByMessageCreatedByUserId($userId: ID!) {
  groups(where: {messages: {createdBy: {id: {equalTo: $userId}}}}) {
    edges {
      node {
        id
        messages {
          edges {
            node {
              id
              text
              createdBy {
                id
              }
            }
          }
        }
      }
    }
  }
}
    `;
export const GetGroupMessageCreatedByUserIdDocument = gql`
    query getGroupMessageCreatedByUserId($groupId: ID!, $userId: ID!) {
  groupMessages(groupId: $groupId, where: {createdBy: {id: {equalTo: $userId}}}) {
    edges {
      node {
        id
      }
    }
  }
}
    `;
export const CreateGroupMessageDocument = gql`
    mutation createGroupMessage($groupId: ID!, $fields: CreateGroupMessageInput!) {
  createGroupMessage(groupId: $groupId, input: $fields) {
    id
    text
    createdBy {
      id
    }
  }
}
    `;
export const DeleteGroupMessageDocument = gql`
    mutation deleteGroupMessage($groupId: ID!, $messageId: ID!) {
  deleteGroupMessage(groupId: $groupId, input: {id: $messageId})
}
    `;
export const DeleteGroupDocument = gql`
    mutation deleteGroup($groupId: ID!) {
  deleteGroup(input: {id: $groupId})
}
    `;
export const DeleteUserDocument = gql`
    mutation deleteUser($userId: ID!) {
  deleteUser(input: {id: $userId})
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createUser(variables: CreateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateUserMutation>(CreateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createUser', 'mutation');
    },
    getUsers(variables?: GetUsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUsersQuery>(GetUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getUsers', 'query');
    },
    updateUser(variables: UpdateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>(UpdateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUser', 'mutation');
    },
    createGroup(variables: CreateGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateGroupMutation>(CreateGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createGroup', 'mutation');
    },
    getGroups(variables?: GetGroupsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGroupsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGroupsQuery>(GetGroupsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGroups', 'query');
    },
    getGroupsByUserId(variables: GetGroupsByUserIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGroupsByUserIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGroupsByUserIdQuery>(GetGroupsByUserIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGroupsByUserId', 'query');
    },
    getGroupsByMessageCreatedByUserId(variables: GetGroupsByMessageCreatedByUserIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGroupsByMessageCreatedByUserIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGroupsByMessageCreatedByUserIdQuery>(GetGroupsByMessageCreatedByUserIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGroupsByMessageCreatedByUserId', 'query');
    },
    getGroupMessageCreatedByUserId(variables: GetGroupMessageCreatedByUserIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGroupMessageCreatedByUserIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGroupMessageCreatedByUserIdQuery>(GetGroupMessageCreatedByUserIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGroupMessageCreatedByUserId', 'query');
    },
    createGroupMessage(variables: CreateGroupMessageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateGroupMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateGroupMessageMutation>(CreateGroupMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createGroupMessage', 'mutation');
    },
    deleteGroupMessage(variables: DeleteGroupMessageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteGroupMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteGroupMessageMutation>(DeleteGroupMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteGroupMessage', 'mutation');
    },
    deleteGroup(variables: DeleteGroupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteGroupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteGroupMutation>(DeleteGroupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteGroup', 'mutation');
    },
    deleteUser(variables: DeleteUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteUserMutation>(DeleteUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteUser', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;