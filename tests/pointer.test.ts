import { startHttpApolloServer } from "./setup";
import { CollectionOptions } from "../src/interfaces";
import { graphQLClient } from "./testHelper";
import { gql } from "graphql-request";

const collections: CollectionOptions[] = [
  { name: "User", fields: { username: { type: "String", required: true } } },
  {
    name: "Post",
    fields: {
      createdBy: { type: "Pointer", target: "User" },
    },
  },
];

const CREATE_DOCUMENT = gql`
  mutation createPost($createdBy: UserPointerInput!) {
    createPost(input: { createdBy: $createdBy }) {
      id
      createdBy {
        id
        username
      }
    }
  }
`;

const UPDATE_DOCUMENT = gql`
  mutation updatePost($id: ID!, $createdBy: UserPointerInput) {
    updatePost(input: { id: $id, fields: { createdBy: $createdBy } }) {
      id
      createdBy {
        id
        username
      }
    }
  }
`;

const QUERY_DOCUMENT = gql`
  query queryPost($where: PostWhereInput) {
    posts(where: $where) {
      edges {
        node {
          id
          createdBy {
            id
            username
          }
        }
      }
    }
  }
`;

describe("Pointer Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({ collections });
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  let postId = "";
  let createdById = "";

  it("Create And Link", async () => {
    const { createPost } = await graphQLClient.request(CREATE_DOCUMENT, {
      createdBy: { createAndLink: { username: "User1" } },
    });

    expect(createPost).not.toBeUndefined();
    expect(createPost.createdBy.username).toEqual("User1");

    postId = createPost.id;
    createdById = createPost.createdBy.id;
  });

  it("Unlink", async () => {
    const { updatePost } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: postId,
      createdBy: null,
    });

    expect(updatePost).not.toBeUndefined();
    expect(updatePost.createdBy).toBeNull();
  });

  it("Query without pointer and without where", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT);

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(1);
  });

  it("Query without pointer and with where", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { createdBy: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(0);
  });

  it("Link existing", async () => {
    const { updatePost } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: postId,
      createdBy: { link: createdById },
    });

    expect(updatePost).not.toBeUndefined();
    expect(updatePost.createdBy.username).toEqual("User1");
  });

  it("Query without where", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT);

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(1);
    expect(posts.edges[0].node.createdBy.id).toEqual(createdById);
  });

  it("Query with not equal where", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { createdBy: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(0);
  });

  it("Query with equal where", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { createdBy: { id: { equalTo: createdById } } },
    });

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(1);
    expect(posts.edges[0].node.createdBy.id).toEqual(createdById);
  });
});
