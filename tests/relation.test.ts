import { startHttpApolloServer } from "./setup";
import { CollectionOptions } from "../src/interfaces";
import { graphQLClient } from "./testHelper";
import { gql } from "graphql-request";

const collections: CollectionOptions[] = [
  { name: "User", fields: { username: { type: "String", required: true } } },
  {
    name: "Like",
    fields: {
      users: { type: "Relation", target: "User", required: true },
    },
  },
];

const CREATE_LIKE_DOCUMENT = gql`
  mutation createLike($users: UserRelationInput!) {
    createLike(input: { users: $users }) {
      id
      users {
        id
        username
      }
    }
  }
`;

const UPDATE_LIKE_DOCUMENT = gql`
  mutation updateLike($id: ID!, $users: UserRelationInput!) {
    updateLike(input: { id: $id, fields: { users: $users } }) {
      id
      users {
        id
        username
      }
    }
  }
`;

const QUERY_LIKE_DOCUMENT = gql`
  query queryLike($where: LikeWhereInput) {
    likes(where: $where) {
      edges {
        node {
          id
          users {
            id
            username
          }
        }
      }
    }
  }
`;

describe("Relation Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({ collections });
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  let likeId = "";
  let likeUsers: any[] = [];

  it("Single Create And Add", async () => {
    const { createLike } = await graphQLClient.request(CREATE_LIKE_DOCUMENT, {
      users: { createAndAdd: [{ username: "User1" }] },
    });

    expect(createLike).not.toBeUndefined();
    expect(createLike.users).toHaveLength(1);
    expect(createLike.users[0].username).toEqual("User1");

    likeId = createLike.id;
  });

  it("Multiple Create And Add", async () => {
    const { updateLike } = await graphQLClient.request(UPDATE_LIKE_DOCUMENT, {
      id: likeId,
      users: { createAndAdd: [{ username: "User2" }, { username: "User3" }] },
    });

    expect(updateLike).not.toBeUndefined();
    expect(updateLike.users).toHaveLength(3);

    likeUsers = updateLike.users;
  });

  it("remove single", async () => {
    const { updateLike } = await graphQLClient.request(UPDATE_LIKE_DOCUMENT, {
      id: likeId,
      users: { remove: [likeUsers[0].id] },
    });

    expect(updateLike).not.toBeUndefined();
    expect(updateLike.users).toHaveLength(2);
  });

  it("remove multiple", async () => {
    const { updateLike } = await graphQLClient.request(UPDATE_LIKE_DOCUMENT, {
      id: likeId,
      users: { remove: [likeUsers[1].id, likeUsers[2].id] },
    });

    expect(updateLike).not.toBeUndefined();
    expect(updateLike.users).toHaveLength(0);
  });

  it("Single Add", async () => {
    const { updateLike } = await graphQLClient.request(UPDATE_LIKE_DOCUMENT, {
      id: likeId,
      users: { add: [likeUsers[0].id] },
    });

    expect(updateLike).not.toBeUndefined();
    expect(updateLike.users).toHaveLength(1);
  });

  it("Multiple Add", async () => {
    const { updateLike } = await graphQLClient.request(UPDATE_LIKE_DOCUMENT, {
      id: likeId,
      users: { add: [likeUsers[1].id, likeUsers[2].id] },
    });

    expect(updateLike).not.toBeUndefined();
    expect(updateLike.users).toHaveLength(3);
  });

  it("Query without where", async () => {
    const { likes } = await graphQLClient.request(QUERY_LIKE_DOCUMENT);

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
    expect(likes.edges[0].node.users).toHaveLength(3);
  });

  it("Query with not equal where", async () => {
    const { likes } = await graphQLClient.request(QUERY_LIKE_DOCUMENT, {
      where: { users: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with equal where", async () => {
    const { likes } = await graphQLClient.request(QUERY_LIKE_DOCUMENT, {
      where: { users: { id: { in: likeUsers[0].id } } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
    expect(likes.edges[0].node.users).toHaveLength(3);
  });

  it("remove all relation", async () => {
    const { updateLike } = await graphQLClient.request(UPDATE_LIKE_DOCUMENT, {
      id: likeId,
      users: { remove: [likeUsers[0].id, likeUsers[1].id, likeUsers[2].id] },
    });

    expect(updateLike).not.toBeUndefined();
    expect(updateLike.users).toHaveLength(0);
  });

  it("Query without relation and without where", async () => {
    const { likes } = await graphQLClient.request(QUERY_LIKE_DOCUMENT);

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
    expect(likes.edges[0].node.users).toHaveLength(0);
  });

  it("Query without relation and with where", async () => {
    const { likes } = await graphQLClient.request(QUERY_LIKE_DOCUMENT, {
      where: { users: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });
});
