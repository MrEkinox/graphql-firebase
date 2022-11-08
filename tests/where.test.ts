import { startHttpApolloServer } from "./setup";
import { CollectionOptions } from "../src/interfaces";
import { gql } from "graphql-request";
import { graphQLClient } from "./testHelper";
import { enumType } from "nexus";

const TestEnum = enumType({ name: "TestEnum", members: ["other"] });

const collections: CollectionOptions[] = [
  { name: "User", fields: { username: { type: "String", required: true } } },
  {
    name: "Like",
    fields: {
      users: { type: "Relation", target: "User", required: true },
      createdBy: { type: "Pointer", target: "User" },
      meetDate: { type: "Date" },
      endDate: { type: "Date" },
      testEnm: { type: TestEnum },
      testEnm2: { type: TestEnum },
      boolean: { type: "Boolean" },
      array: { type: "String", list: true },
      any: { type: "Any" },
      viewNumber: { type: "Number", defaultValue: 50 },
      viewNumber2: { type: "Number", defaultValue: 50 },
      customObject: {
        type: "Object",
        fields: {
          viewNumber: { type: "Number", defaultValue: 50 },
          viewNumber2: { type: "Number", defaultValue: 50 },
          test: { type: "String", required: true },
          test8: { type: "String" },
          customObject2: {
            type: "Object",
            fields: {
              test: { type: "String" },
              test2: { type: "String" },
              customObject3: {
                type: "Object",
                fields: {
                  test: { type: "String" },
                },
              },
            },
          },
        },
      },
    },
  },
];

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

describe("Where Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  let likeId = "";
  let likeUsers: any[] = [];

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({ collections });
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

  it.only("Query with where boolean equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { boolean: { equalTo: true } },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(1);
  });

  it.only("Query with where boolean not equal", async () => {
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
  });

  it("Query with where date is not between", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        meetDate: { greaterThan: new Date("2000"), lessThan: new Date("2003") },
      },
    });

    expect(likes).not.toBeUndefined();
    expect(likes.edges).toHaveLength(0);
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

    console.log(likes);
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object where no equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test: { equalTo: "string2" } },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with object where equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test: { equalTo: "string" } },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object where in", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test: { in: ["string", "other"] } },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object where in empty value", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test8: { in: ["string", "other"] } },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with object where in empty input", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { test8: { in: [] } },
      },
    });

    console.log(likes);
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

    console.log(likes);
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object in object where", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { customObject2: { test: { equalTo: "string" } } },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(1);
  });

  it("Query with object in object where not equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: { customObject2: { test: { equalTo: "string2" } } },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with multiple number object in object where not equal", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        customObject: {
          viewNumber: {
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 100,
          },
          viewNumber2: {
            greaterThanOrEqualTo: 0,
            lessThanOrEqualTo: 100,
          },
        },
      },
    });

    console.log(likes);
    expect(likes.edges).toHaveLength(0);
  });

  it("Query with multiple number where is between", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: {
        viewNumber: {
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 100,
        },
        viewNumber2: {
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 100,
        },
      },
    });

    console.log(likes);
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

    console.log(likes);
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

    console.log(likes);
    expect(likes.edges).toHaveLength(0);
  });
});
