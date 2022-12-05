import { startHttpApolloServer } from "./setup";
import { graphQLClient } from "./testHelper";
import { gql } from "graphql-request";
import { firestoreType } from "../src";

const User = firestoreType({
  name: "User",
  definition: (t) => {
    t.string("username", { required: true });
  },
});

const Post = firestoreType({
  name: "Post",
  definition: (t) => {
    t.ref("createdBy", { type: "User" });
  },
});

const CREATE_DOCUMENT = gql`
  mutation createPost($createdBy: UserReferenceInput!) {
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
  mutation updatePost($id: ID!, $createdBy: UserReferenceInput) {
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
    httpApolloServer = await startHttpApolloServer({ types: [User, Post] });
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  let postId = "";
  let createdById = "";

  it("Create And Link", async () => {
    const { createPost, errors } = await graphQLClient.request(CREATE_DOCUMENT, {
      createdBy: { createAndLink: { username: "User1" } },
    });

    expect(errors).toBeUndefined()
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

  it("Query with not equal where with exists", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { createdBy: { exists: true } },
    });

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(1);
  });

  it("Query with not equal where with not exists", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { createdBy: { exists: false } },
    });

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(0);
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

  it("Query with not equal where", async () => {
    const { posts } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { createdBy: { id: { notEqualTo: createdById } } },
    });

    expect(posts).not.toBeUndefined();
    expect(posts.edges).toHaveLength(0);
  });
});
