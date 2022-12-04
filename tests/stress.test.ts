import { startHttpApolloServer } from "./setup";
import { graphQLClient } from "./testHelper";
import { gql } from "graphql-request";
import { firestoreType } from "../src";

const FolderDocumentFile = firestoreType({
  name: "FolderDocumentFile",
  parents: ["Folder", "FolderDocument"],
  definition: (t) => {
    t.string("name", { required: true });
  },
});

const FolderDocument = firestoreType({
  name: "FolderDocument",
  parents: ["Folder"],
  definition: (t) => {
    t.string("name", { required: true });
    // @ts-ignore
    t.collection("file", { type: "FolderDocumentFile" });
  },
});

const Folder = firestoreType({
  name: "Folder",
  definition: (t) => {
    t.string("name", { required: true });
    // @ts-ignore
    t.collection("documents", { type: "FolderDocument" });
  },
});

const CREATE_FOLDER_DOCUMENT = gql`
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

const QUERY_DOCUMENT = gql`
  query queryFolder($folderId: ID!, $where: FolderDocumentWhereInput) {
    folderDocuments(folderId: $folderId, where: $where) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

describe("Stress Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({
      types: [Folder, FolderDocument, FolderDocumentFile],
    });
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  let folderId = "";

  it("Single folder Create And Add", async () => {
    const { createFolder } = await graphQLClient.request(
      CREATE_FOLDER_DOCUMENT,
      {
        input: {
          name: "Folder",
          documents: {
            createAndAdd: Array.from({ length: 30 }).map((_, i) => ({
              name: `Document${i % 2 === 0 ? "1" : "2"}`,
              file: { createAndAdd: [{ name: "File1" }] },
            })),
          },
        },
      }
    );

    folderId = createFolder.id;

    const documents = createFolder?.documents?.edges?.map((edge) => edge?.node);

    expect(createFolder).not.toBeUndefined();
    expect(documents).toHaveLength(30);
  });

  it("Query with where in subcollection", async () => {
    const { folderDocuments } = await graphQLClient.request(QUERY_DOCUMENT, {
      folderId,
      where: { name: { equalTo: "Document1" } },
    });

    expect(folderDocuments).not.toBeUndefined();
    expect(folderDocuments.edges).toHaveLength(15);
  });

  it("Query with where in subcollection", async () => {
    const { folderDocuments } = await graphQLClient.request(QUERY_DOCUMENT, {
      folderId,
      where: {
        name: { equalTo: "Document1" },
        file: { name: { equalTo: "File1" } },
      },
    });

    expect(folderDocuments).not.toBeUndefined();
    expect(folderDocuments.edges).toHaveLength(15);
  });
});
