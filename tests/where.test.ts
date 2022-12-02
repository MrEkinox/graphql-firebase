import { startHttpApolloServer } from "./setup";
import { gql } from "graphql-request";
import { graphQLClient } from "./testHelper";
import { enumType, firestoreType, objectType } from "../src";

const TestEnum = enumType({ name: "TestEnum", members: ["other"] });

const User = firestoreType({
  name: "User",
  definition: (t) => {
    t.string("username", { required: true });
  },
});

const CustomObject = objectType({
  name: "CustomObject",
  definition: (t) => {
    t.int("viewNumber");
    t.int("viewNumber2");
    t.string("test", { required: true });
    t.string("test8");
    // @ts-ignore
    t.object("customObject2", { type: "CustomObject2" });
  },
});

const CustomObject2 = objectType({
  name: "CustomObject2",
  definition: (t) => {
    t.string("test");
    t.string("test2");
    // @ts-ignore
    t.object("customObject3", { type: "CustomObject3" });
  },
});

const CustomObject3 = objectType({
  name: "CustomObject3",
  definition: (t) => {
    t.string("test");
  },
});

const Like = firestoreType({
  name: "Like",
  definition: (t) => {
    t.ref("users", { type: "User", list: true, required: true });
    t.ref("createdBy", { type: "User" });
    t.date("meetDate");
    t.date("endDate");
    t.boolean("boolean");
    // @ts-ignore
    t.field("testEnum", { type: "TestEnum" });
    // @ts-ignore
    t.field("testEnm2", { type: "TestEnum" });
    t.string("array", { list: true });
    t.any("any");
    t.int("viewNumber");
    t.int("viewNumber2");
    // @ts-ignore
    t.object("customObject", { type: "CustomObject" });
  },
});

const CREATE_DOCUMENT = gql`
  mutation createLike($input: CreateLikeInput!) {
    createLike(input: $input) {
      id
      meetDate
      users {
        id
        username
      }
    }
  }
`;

const QUERY_DOCUMENT = gql`
  query queryLike($where: LikeWhereInput) {
    likes(where: $where) {
      count
      edges {
        node {
          id
          meetDate
          users {
            id
            username
          }
        }
      }
    }
  }
`;

describe("Where Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  let likeId = "";
  let likeUsers: any[] = [];

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({
      types: [TestEnum, User, CustomObject, CustomObject2, CustomObject3, Like],
    });
    const { createLike } = await graphQLClient.request(CREATE_DOCUMENT, {
      input: {
        users: {
          createAndAdd: [{ username: "User1" }, { username: "User2" }],
        },
        meetDate: new Date("2022"),
        endDate: new Date("2023"),
        viewNumber: 50,
        array: ["1"],
        boolean: true,
        any: { "87878-877667": true },
        customObject: {
          test: "string",
          customObject2: {
            test: "string",
          },
        },
      },
    });

    likeId = createLike.id;
    likeUsers = createLike.users;
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  it("Query with where boolean equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { boolean: { equalTo: true } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with where boolean not equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { boolean: { equalTo: false } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with where any equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { any: { "87878-877667": { equalTo: true } } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with where any not equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { any: { "87878-877669": { equalTo: true } } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with where array contain", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { any: { arrayContains: "1" } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with where array not contain", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { array: { arrayContains: "2" } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with where date equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { meetDate: { equalTo: new Date("2022") } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with where date not equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { meetDate: { equalTo: new Date("1970") } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with where date is between", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        meetDate: { greaterThan: new Date("2021"), lessThan: new Date("2023") },
      },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
    expect(likes.count).toEqual(1);
  });

  it("Query with where date is not between", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        meetDate: { greaterThan: new Date("2000"), lessThan: new Date("2003") },
      },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
    expect(likes.count).toEqual(0);
  });

  it("Query with where date is less", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { endDate: { lessThanOrEqualTo: new Date("2024").toISOString() } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with where date is not less", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { endDate: { lessThanOrEqualTo: new Date("2003").toISOString() } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query without where", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT);

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with not equal where", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { users: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with relation where", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        users: { id: { in: likeUsers.map(({ id }) => id) } },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object where no equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test: { equalTo: "string2" } },
      },
    });

    expect(likes.edges).toHaveLength(0);
  });

  it("Query with object where equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test: { equalTo: "string" } },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object where in", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test: { in: ["string", "other"] } },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object where in empty value", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test8: { in: ["string", "other"] } },
      },
    });

    expect(likes.edges).toHaveLength(0);
  });

  it("Query with object where in empty input", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test8: { in: [] } },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object in object where in empty input", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: {
          customObject2: {
            customObject3: { test: { in: [] } },
          },
        },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object in object where", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { customObject2: { test: { equalTo: "string" } } },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object in object where not equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { customObject2: { test: { equalTo: "string2" } } },
      },
    });

    expect(likes.edges).toHaveLength(0);
  });

  it("Query with number where is between", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        viewNumber: {
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 100,
        },
      },
    });

    expect(likes.edges).toHaveLength(1);
  });

  it("Query with number where is not between", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        viewNumber: {
          greaterThanOrEqualTo: 200,
          lessThanOrEqualTo: 300,
        },
      },
    });

    expect(likes.edges).toHaveLength(0);
  });
});
