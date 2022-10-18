import { serverApollo, startHttpApolloServer } from "./setup";
import { CollectionOptions } from "../src/interfaces";
import { createFile, graphQLClient } from "./testHelper";
import { gql } from "graphql-request";

const collections: CollectionOptions[] = [
  {
    name: "User",
    fields: {
      singleDate: { type: "Date" },
      multipleDate: { type: "Date", list: true },
      singleNumber: { type: "Number" },
      multipleNumber: { type: "Number", list: true },
      singleEmail: { type: "Email" },
      multipleEmail: { type: "Email", list: true },
      singlePhone: { type: "Phone" },
      multiplePhone: { type: "Phone", list: true },
      singleCountry: { type: "Country" },
      multipleCountry: { type: "Country", list: true },
      singleFile: { type: "File" },
      multipleFile: { type: "File", list: true },
    },
  },
];

const CREATE_DOCUMENT = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      singleDate
      multipleDate
      singleNumber
      multipleNumber
      singleEmail
      multipleEmail
      singlePhone
      multiplePhone
      singleCountry
      multipleCountry
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
      singleEmail
      multipleEmail
      singlePhone
      multiplePhone
      singleCountry
      multipleCountry
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
          singleEmail
          multipleEmail
          singlePhone
          multiplePhone
          singleCountry
          multipleCountry
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
    httpApolloServer = await startHttpApolloServer({ collections });
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

  it("Set Email", async () => {
    const singleEmail = "yannis@live.fr";
    const multipleEmail = Array.from({ length: 3 }).map(
      () => "yannis2@live.fr"
    );
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleEmail, multipleEmail },
    });

    expect(updateUser.singleEmail).toEqual(singleEmail);
    expect(updateUser.multipleEmail).toEqual(multipleEmail);
  });

  it("Unset Email", async () => {
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleEmail: null, multipleEmail: [] },
    });

    expect(updateUser.singleEmail).toBeNull();
    expect(updateUser.multipleEmail).toHaveLength(0);
  });

  it("Invalid Email", async () => {
    try {
      await graphQLClient.request(UPDATE_DOCUMENT, {
        id: userId,
        fields: {
          singleEmail: "Invalid Email",
          multipleEmail: ["Invalid Email"],
        },
      });
      fail();
    } catch (error: any) {
      expect(error).not.toBeUndefined();
    }
  });

  it("Set Phone", async () => {
    const singlePhone = "+33623484809";
    const multiplePhone = Array.from({ length: 3 }).map(() => "+33623484801");
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singlePhone, multiplePhone },
    });

    expect(updateUser.singlePhone).toEqual(singlePhone);
    expect(updateUser.multiplePhone).toEqual(multiplePhone);
  });

  it("Unset Phone", async () => {
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singlePhone: null, multiplePhone: [] },
    });

    expect(updateUser.singlePhone).toBeNull();
    expect(updateUser.multiplePhone).toHaveLength(0);
  });

  it("Invalid Phone", async () => {
    try {
      await graphQLClient.request(UPDATE_DOCUMENT, {
        id: userId,
        fields: {
          singlePhone: "Y671879819",
          multiplePhone: ["92U2HSSY82"],
        },
      });
      fail();
    } catch (error: any) {
      expect(error).not.toBeUndefined();
    }
  });

  it("Set Country", async () => {
    const singleCountry = "FR";
    const multipleCountry = Array.from({ length: 3 }).map(() => "US");
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleCountry, multipleCountry },
    });

    expect(updateUser.singleCountry).toEqual(singleCountry);
    expect(updateUser.multipleCountry).toEqual(multipleCountry);
  });

  it("Unset Country", async () => {
    const { updateUser } = await graphQLClient.request(UPDATE_DOCUMENT, {
      id: userId,
      fields: { singleCountry: null, multipleCountry: [] },
    });

    expect(updateUser.singleCountry).toBeNull();
    expect(updateUser.multipleCountry).toHaveLength(0);
  });

  it("Invalid Country", async () => {
    try {
      await graphQLClient.request(UPDATE_DOCUMENT, {
        id: userId,
        fields: {
          singleCountry: "Y671879819",
          multipleCountry: ["92U2HSSY82"],
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

    const { data, errors } = await serverApollo({
      collections,
    }).executeOperation({
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
