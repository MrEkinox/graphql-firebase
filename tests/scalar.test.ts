import { serverApollo, startHttpApolloServer } from "./setup";
import { createFile, graphQLClient } from "./testHelper";
import { gql } from "graphql-request";
import { firestoreType } from "../src";

const User = firestoreType({
  name: "User",
  definition: (t) => {
    t.date("singleDate");
    t.date("multipleDate", { list: true });
    t.int("singleNumber");
    t.int("multipleNumber", { list: true });
    t.file("singleFile");
    t.file("multipleFile", { list: true });
  },
});

const CREATE_DOCUMENT = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      singleDate
      multipleDate
      singleNumber
      multipleNumber
      singleFile {
        name
        url
      }
      multipleFile {
        name
        url
      }
    }
  }
`;

const UPDATE_DOCUMENT = gql`
  mutation updateUser($id: ID!, $fields: UpdateUserFieldsInput!) {
    updateUser(input: { id: $id, fields: $fields }) {
      id
      singleDate
      multipleDate
      singleNumber
      multipleNumber
      singleFile {
        name
        url
      }
      multipleFile {
        name
        url
      }
    }
  }
`;

const QUERY_DOCUMENT = gql`
  query queryUser($where: UserWhereInput) {
    users(where: $where) {
      edges {
        node {
          id
          singleDate
          multipleDate
          singleNumber
          multipleNumber
          singleFile {
            name
            url
          }
          multipleFile {
            name
            url
          }
        }
      }
    }
  }
`;

describe("Scalar Test", () => {
  let httpApolloServer: Awaited<ReturnType<typeof startHttpApolloServer>>;
  let userId = "";

  beforeAll(async () => {
    httpApolloServer = await startHttpApolloServer({ types: [User] });
    const { createUser } = await graphQLClient.request(CREATE_DOCUMENT, {
      input: {},
    });
    userId = createUser.id;
  });

  afterAll(async () => {
    await httpApolloServer.stop();
  });

  it("Set Date", async () => {
    const singleDate = new Date("2017");
    const multipleDate = Array.from({ length: 3 }).map(() => new Date("2019"));
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleDate, multipleDate },
    });

    expect(updateUser.singleDate).toEqual(singleDate.toISOString());
    expect(updateUser.multipleDate).toEqual(
      multipleDate.map((date) => date.toISOString())
    );
  });

  it("Unset Date", async () => {
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleDate: null, multipleDate: [] },
    });

    expect(updateUser.singleDate).toBeNull();
    expect(updateUser.multipleDate).toHaveLength(0);
  });

  it("Invalid Date", async () => {
    try {
      await graphQLClient.request(UPDATE_DOCUMENT, {
        id: userId,
        fields: { singleDate: "Invalid Date", multipleDate: ["Invalid Date"] },
      });
      fail();
    } catch (error: any) {
      expect(error).not.toBeUndefined();
    }
  });

  it("Set Number", async () => {
    const singleNumber = 2017;
    const multipleNumber = Array.from({ length: 3 }).map(() => 2019);
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleNumber, multipleNumber },
    });

    expect(updateUser.singleNumber).toEqual(singleNumber);
    expect(updateUser.multipleNumber).toEqual(multipleNumber);
  });

  it("Unset Number", async () => {
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleNumber: null, multipleNumber: [] },
    });

    expect(updateUser.singleNumber).toBeNull();
    expect(updateUser.multipleNumber).toHaveLength(0);
  });

  it("Invalid Number", async () => {
    try {
      await graphQLClient.request(UPDATE_DOCUMENT, {
        id: userId,
        fields: {
          singleNumber: "Invalid Number",
          multipleNumber: ["Invalid Number"],
        },
      });
      fail();
    } catch (error: any) {
      expect(error).not.toBeUndefined();
    }
  });

  let files = [];

  it("Set File", async () => {
    const singleFile = { upload: createFile() };
    const multipleFile = Array.from({ length: 3 }).map(() => createFile());

    const server = serverApollo({ types: [User] });
    const { data, errors } = await server.executeOperation({
      query: UPDATE_DOCUMENT,
      variables: {
        id: userId,
        fields: { singleFile, multipleFile: { add: multipleFile } },
      },
    });

    expect(errors).toBeUndefined();

    expect(data?.updateUser.singleFile).not.toBeUndefined();

    expect(data?.updateUser.multipleFile).toHaveLength(3);

    files = data?.updateUser.multipleFile;
  });

  it("Unset File", async () => {
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: {
        singleFile: null,
        multipleFile: { remove: files.map((file) => file["name"]) },
      },
    });

    expect(updateUser.singleFile).toBeNull();
    expect(updateUser.multipleFile).toHaveLength(0);
  });
});
