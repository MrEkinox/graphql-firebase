import { startHttpApolloServer } from "./setup";
import { CollectionOptions } from "../src/interfaces";
import { gql } from "graphql-request";
import { graphQLClient } from "./testHelper";
import { enumType } from "nexus";

export const MissionCategorieEnum = enumType({
  name: "MissionCategorieEnum",
  members: [
    "shootingVideo",
    "shootingPhoto",
    "commercial",
    "institutionalVideo",
    "awarenessCampaign",
    "documentary",
    "film",
  ],
});

const collections: CollectionOptions[] = [
  {
    name: "User",
    fields: {
      testEnm: { type: MissionCategorieEnum },
      username: { type: "String", required: true },
    },
  },
  {
    name: "Like",
    fields: {
      test: {
        type: "Collection",
        name: "User",
        fields: {
          testEnm: { type: MissionCategorieEnum },
        },
      },
      users: { type: "Relation", target: "User", required: true },
      createdBy: { type: "Pointer", target: "User" },
    },
  },
];

const CREATE_DOCUMENT = gql`
  mutation createLike($input: CreateLikeInput!) {
    createLike(input: $input) {
      id
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
        }
      }
    }
  }
`;

describe("Divers Test", () => {
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
      },
    });

    likeId = createLike.id;
    likeUsers = createLike.users;
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  it("Query without where", async () => {
    const { likes } = await graphQLClient.request(QUERY_DOCUMENT);

    console.log(likes)

    expect(likes.edges).toHaveLength(1);
    expect(likes.count).toEqual(1);
  });
});
