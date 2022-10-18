import { startHttpApolloServer } from "./setup";
import { CollectionOptions } from "../src/interfaces";
import { graphQLClient } from "./testHelper";
import { gql } from "graphql-request";

const collections: CollectionOptions[] = [
  {
    name: "Folder",
    fields: {
      documents: {
        type: "Collection",
        required: true,
        name: "Document",
        fields: {
          name: { type: "String", required: true },
        },
      },
    },
  },
];

const CREATE_DOCUMENT = gql`
  mutation createFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      id
      documents {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const UPDATE_DOCUMENT = gql`
  mutation updateFolder($id: ID!, $fields: UpdateFolderFieldsInput!) {
    updateFolder(input: { id: $id, fields: $fields }) {
      id
      documents {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const QUERY_DOCUMENT = gql`
  query queryFolder($where: FolderWhereInput) {
    folders(where: $where) {
      edges {
        node {
          id
          documents {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

describe("Collection Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({ collections });
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  let folderId = "";
  let folderDocuments: any[] = [];

  it("Single Create And Add", async () => {
    const { createFolder } = await graphQLClient.request(CREATE_DOCUMENT, {
      input: { documents: { createAndAdd: [{ name: "Document1" }] } },
    });

    const documents = createFolder?.documents?.edges?.map((edge) => edge?.node);

    expect(createFolder).not.toBeUndefined();
    expect(documents).toHaveLength(1);
    expect(documents[0].name).toEqual("Document1");

    folderId = createFolder.id;
  });

  it("Multiple Create And Add", async () => {
    const { updateFolder } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: folderId,
      fields: {
        documents: {
          createAndAdd: [{ name: "Document2" }, { name: "Document3" }],
        },
      },
    });

    const documents = updateFolder?.documents?.edges?.map((edge) => edge?.node);

    expect(updateFolder).not.toBeUndefined();
    expect(documents).toHaveLength(3);

    folderDocuments = documents;
  });

  it("Query without where", async () => {
    const { folders } = await graphQLClient.request(QUERY_DOCUMENT);

    expect(folders).not.toBeUndefined();
    expect(folders.edges).toHaveLength(1);
  });

  it("Query with not equal where", async () => {
    const { folders } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { documents: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(folders).not.toBeUndefined();
    expect(folders.edges).toHaveLength(0);
  });

  it("Query with equal where", async () => {
    const { folders } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { documents: { id: { equalTo: folderDocuments[0].id } } },
    });

    expect(folders).not.toBeUndefined();
    expect(folders.edges).toHaveLength(1);
  });

  it("delete single", async () => {
    const { updateFolder } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: folderId,
      fields: { documents: { delete: [folderDocuments[0].id] } },
    });

    const documents = updateFolder?.documents?.edges?.map((edge) => edge?.node);

    expect(updateFolder).not.toBeUndefined();
    expect(documents).toHaveLength(2);
  });

  it("delete multiple", async () => {
    const { updateFolder } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: folderId,
      fields: {
        documents: { delete: [folderDocuments[1].id, folderDocuments[2].id] },
      },
    });

    const documents = updateFolder?.documents?.edges?.map((edge) => edge?.node);

    expect(updateFolder).not.toBeUndefined();
    expect(documents).toHaveLength(0);
  });

  it("Query without collection and without where", async () => {
    const { folders } = await graphQLClient.request(QUERY_DOCUMENT);

    expect(folders).not.toBeUndefined();
    expect(folders.edges).toHaveLength(1);
  });

  it("Query without collection and with where", async () => {
    const { folders } = await graphQLClient.request(QUERY_DOCUMENT, {
      where: { documents: { id: { equalTo: "UNKNOW_ID" } } },
    });

    expect(folders).not.toBeUndefined();
    expect(folders.edges).toHaveLength(0);
  });
});
