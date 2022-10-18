import { startHttpApolloServer, serverApollo } from "../setup";
import { gql } from "graphql-request";
import { client, createFile } from "../testHelper";
import { enumType, scalarType } from "nexus";
import { CollectionOptions } from "../../src/interfaces";


const customScalar = scalarType({ name: "CustomScalar" });

const customEnum = enumType({
  name: "CustomEnum",
  members: ["Member1", "Member2"],
});

const collections: CollectionOptions[] = [
  {
    name: "User",
    fields: {
      username: { type: "String", required: true },
      email: { type: "String", required: true },
      avatar: { type: "File" },
      birthDate: { type: "Date" },
      customType: {
        type: "Object",
        fields: {
          test: { type: "String", required: true },
          customType2: {
            type: "Object",
            fields: {
              test: { type: "String" },
            },
          },
        },
      },
      customScalar: { type: customScalar },
      customEnum: { type: customEnum },
      number: { type: "Number", resolve: () => 100 },
    },
  },
  {
    name: "Group",
    fields: {
      name: { type: "String" },
      users: { type: "Relation", target: "User", required: true },
      messages: {
        name: "Message", // GroupMessage
        type: "Collection",
        fields: {
          text: { type: "String" },
          image: { type: "File" },
          createdBy: { type: "Pointer", target: "User" },
        },
      },
    },
  },
];

describe("Basic Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({ collections });
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  it("can create new user", async () => {
    const { createUser } = await client.createUser({
      fields: {
        username: "MrEkinox",
        email: "yannis@gmail.com",
        birthDate: new Date(),
      },
    });

    expect(createUser?.id).not.toBeUndefined();
  });

  it("can upload user avatar", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const avatar = createFile();

    const { data, errors } = await serverApollo({
      collections,
    }).executeOperation({
      query: gql`
        mutation updateUser($id: ID!, $avatar: Upload!) {
          updateUser(
            input: { id: $id, fields: { avatar: { upload: $avatar } } }
          ) {
            id
            username
            avatar {
              name
              url
            }
          }
        }
      `,
      variables: {
        id: userId,
        avatar,
      },
    });

    expect(errors).toBeUndefined();

    expect(data?.updateUser.avatar).not.toBeUndefined();
  });

  it("can create group", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { createGroup } = await client.createGroup({
      fields: {
        name: "Group Name",
        users: { add: [userId] },
      },
    });

    expect(createGroup?.users).toHaveLength(1);
    expect(createGroup?.users[0].id).toEqual(userId);
  });

  it("can find a group by user", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { groups } = await client.getGroupsByUserId({ userId });

    const groupId = groups?.edges?.[0]?.node?.id;

    expect(groupId).not.toBeUndefined();
  });

  it("can create a message in group", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { groups } = await client.getGroupsByUserId({ userId });

    const groupId = groups?.edges?.[0]?.node?.id;

    if (!groupId) fail();

    const { createGroupMessage } = await client.createGroupMessage({
      groupId,
      fields: {
        text: "It's a message",
        createdBy: { link: userId },
      },
    });

    expect(createGroupMessage?.text).toEqual("It's a message");
    expect(createGroupMessage?.createdBy?.id).toEqual(userId);

    const { groups: groups2 } = await client.getGroupsByUserId({ userId });

    const group = groups2?.edges?.[0]?.node;

    expect(group?.messages?.edges).toHaveLength(1);

    expect(group?.messages?.edges?.[0]?.node?.text).toEqual("It's a message");

    expect(group?.messages?.edges?.[0]?.node?.createdBy?.id).toEqual(userId);
  });

  it("can create a image message in group", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { groups } = await client.getGroupsByUserId({ userId });

    const groupId = groups?.edges?.[0]?.node?.id;

    if (!groupId) fail();

    const avatar = createFile();

    const { data, errors } = await serverApollo({
      collections,
    }).executeOperation({
      query: gql`
        mutation createGroupMessage(
          $groupId: ID!
          $messageInput: CreateGroupMessageInput!
        ) {
          createGroupMessage(groupId: $groupId, input: $messageInput) {
            id
            image {
              url
            }
            createdBy {
              id
            }
          }
        }
      `,
      variables: {
        groupId,
        messageInput: {
          image: { upload: avatar },
          createdBy: { link: userId },
        },
      },
    });

    expect(errors).toBeUndefined();

    expect(data?.createGroupMessage.image).not.toBeUndefined();
    expect(data?.createGroupMessage.createdBy.id).toEqual(userId);
  });

  it("can find a groups contains message created by user", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { groups } = await client.getGroupsByMessageCreatedByUserId({
      userId,
    });

    expect(groups?.edges).toHaveLength(1);
  });

  it("can find a messages created by user in group", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { groups } = await client.getGroupsByUserId({ userId });

    const groupId = groups?.edges?.[0]?.node?.id;

    if (!groupId) fail();

    const { groupMessages } = await client.getGroupMessageCreatedByUserId({
      groupId,
      userId,
    });

    expect(groupMessages?.edges).toHaveLength(2);
  });

  it("can delete group message", async () => {
    const { groups } = await client.getGroups();

    const group = groups?.edges?.[0]?.node;

    if (!group) fail();

    const messageId = group.messages?.edges?.[0]?.node?.id;

    if (!messageId) fail();

    const { deleteGroupMessage } = await client.deleteGroupMessage({
      groupId: group.id,
      messageId,
    });

    expect(deleteGroupMessage).toEqual(true);
  });

  it("can delete group", async () => {
    const { groups } = await client.getGroups();

    const group = groups?.edges?.[0]?.node;

    if (!group) fail();

    const { deleteGroup } = await client.deleteGroup({
      groupId: group.id,
    });

    expect(deleteGroup).toEqual(true);
  });

  it("can delete user", async () => {
    const { users } = await client.getUsers();

    const userId = users?.edges?.[0]?.node?.id;

    if (!userId) fail();

    const { deleteUser } = await client.deleteUser({ userId });

    expect(deleteUser).toEqual(true);
  });
});
