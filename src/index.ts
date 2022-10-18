import { ApolloServer } from "apollo-server-express";
import {
  connectionPlugin,
  declarativeWrappingPlugin,
  fieldAuthorizePlugin,
  makeSchema,
  arg,
  objectType,
} from "nexus";
import {
  isNexusEnumTypeDef,
  isNexusScalarTypeDef,
  ObjectDefinitionBlock,
} from "nexus/dist/core";
import {
  createDefaultWhereInputs,
  getObjectInput,
  getFieldWhereInput,
  getInputs,
  getWhereInput,
} from "./inputs";
import { GraphQLFirebaseOptions } from "./interfaces";
import { getMutations } from "./mutations";
import {
  parseCollections,
  ParsedCollectionOptions,
  ParsedCollectionsOptions,
  ParsedFieldOptions,
  ParsedFieldsOptions,
} from "./parser";
import { getQueries } from "./queries";
import {
  capitalize,
  getParentIds,
  ObjectEach,
  ObjectMap,
  ObjectReduce,
} from "./utils";
import * as CustomScalars from "./scalars";
import { collectionFromFirestore } from "./converter/collection";
import { UploadFileInput, UploadFileListInput } from "./converter/file";

export let parsedCollections: ParsedCollectionsOptions;

const getFieldDefinition = (
  t: ObjectDefinitionBlock<any>,
  collectionName: string,
  name: string,
  options: ParsedFieldOptions
) => {
  const { type } = options;
  switch (type) {
    case "Collection":
      t.connectionField(name, {
        getConnectionName: () =>
          `${collectionName}${capitalize(name)}Collection`,
        deprecation: options.deprecation,
        authorize: options.authorize,
        description: options.description,
        // @ts-ignore
        type: options.target,
        additionalArgs: {
          limit: arg({ type: "Int", default: 50 }),
          offset: arg({ type: "Int", default: 0 }),
          where: arg({ type: `${options.target}WhereInput` }),
          orderBy: arg({ type: `${options.target}OrderByInput` }),
        },
        resolve: async (root, { where, orderBy, ...input }, ctx, info) =>
          collectionFromFirestore(
            options.target,
            input,
            where,
            orderBy,
            root,
            info
          ),
      });
      break;
    case "Relation":
      // @ts-ignore
      t.field(name, { ...options, type: options.target, list: true });
      break;
    case "Pointer":
      // @ts-ignore
      t.field(name, { ...options, type: options.target });
      break;
    case "Object":
      // @ts-ignore
      const newCollectionName = collectionName + capitalize(name);
      t.field(name, {
        ...options,
        type: objectType({
          name: newCollectionName,
          definition: (t) => {
            getFieldsDefinition(t, newCollectionName, options.fields);
          },
        }),
      });
      break;

    default:
      if (isNexusEnumTypeDef(type) || isNexusScalarTypeDef(type)) {
        // @ts-ignore
        t.field(name, { ...options, type: type.name });
      } else if (type) {
        // @ts-ignore
        t.field(name, { ...options });
      }
      break;
  }
};

const getFieldsDefinition = (
  t: ObjectDefinitionBlock<any>,
  collectionName: string,
  fields: ParsedFieldsOptions
) => {
  ObjectEach(fields, (fieldName, fieldOptions) => {
    getFieldDefinition(t, collectionName, fieldName, fieldOptions);
  });
};

const createCollection = (
  name: string,
  collection: ParsedCollectionOptions
) => {
  const parentIds = getParentIds(collection.parent);

  const type = objectType({
    name,
    definition: (t) => {
      parentIds?.forEach((id) => t.id(id, { required: true }));
      getFieldsDefinition(t, name, collection.fields);
    },
  });

  const inputs = getInputs(name, collection.fields);

  const mutations = getMutations(collection, parentIds);
  const queries = getQueries(collection);

  return { type, inputs, mutations, queries };
};

const createAllCollection = () => {
  return ObjectMap(parsedCollections, (name, collection) => {
    return createCollection(name, collection);
  });
};

const flattenObjectType = (name: string, options: ParsedFieldsOptions) => {
  return ObjectReduce(
    options,
    (acc, fieldName, options2) => {
      const capitalizeName = name + capitalize(fieldName);
      if (options2.type === "Object") {
        const underObjects = flattenObjectType(capitalizeName, options2.fields);
        const objectFields: ParsedFieldsOptions = ObjectReduce(
          options2.fields,
          (acc, fieldName2, options2) => {
            const capitalizeFieldName = capitalizeName + capitalize(fieldName2);
            if (options2.type === "Object") {
              return {
                ...acc,
                [fieldName2]: {
                  ...options2,
                  type: `${capitalizeFieldName}Input`,
                },
              };
            }
            return { ...acc, [fieldName2]: options2 };
          },
          {}
        );
        const whereFields: ParsedFieldsOptions = ObjectReduce(
          options2.fields,
          (acc, fieldName2, options2) => {
            const capitalizeFieldName = capitalizeName + capitalize(fieldName2);
            if (options2.type === "Object") {
              return {
                ...acc,
                [fieldName2]: { ...options2, type: `${capitalizeFieldName}` },
              };
            }
            return { ...acc, [fieldName2]: options2 };
          },
          {}
        );
        const objectInput = getObjectInput(capitalizeName, objectFields);
        const objectWhereInput = getWhereInput(capitalizeName, whereFields);
        return {
          ...acc,
          ...underObjects,
          [capitalizeName]: [objectInput, objectWhereInput],
        };
      }
      if (
        isNexusEnumTypeDef(options2.type) ||
        isNexusScalarTypeDef(options2.type)
      ) {
        const whereInput = getFieldWhereInput(options2.type.name);
        return {
          ...acc,
          [options2.type.name]: options2.type,
          [whereInput.name]: whereInput,
        };
      }
      return acc;
    },
    {}
  );
};

const creatAllCustomTypeInput = () => {
  return ObjectReduce(parsedCollections, (acc, collectionName, collection) => {
    const typeInputs = flattenObjectType(collectionName, collection.fields);

    return { ...acc, ...typeInputs };
  });
};

export const GraphQLFirebase = (options: GraphQLFirebaseOptions) => {
  parsedCollections = parseCollections(options.collections);
  const customTypeInputs = creatAllCustomTypeInput();
  const defaultWhereInputs = createDefaultWhereInputs();
  const collectionSchemas = createAllCollection();

  const schema = makeSchema({
    ...options,
    types: [
      options.types,
      defaultWhereInputs,
      customTypeInputs,
      collectionSchemas,
      CustomScalars,
      UploadFileListInput,
      UploadFileInput,
    ],
    plugins: [
      ...(options.plugins || []),
      declarativeWrappingPlugin(),
      connectionPlugin({
        includeNodesField: false,
        disableBackwardPagination: true,
        disableForwardPagination: true,
        validateArgs: () => {},
        extendConnection: {
          count: { type: "Int", requireResolver: false },
        },
        getConnectionName: (fieldName) => `${capitalize(fieldName)}Collection`,
      }),
      fieldAuthorizePlugin(),
    ],
  });

  const server = new ApolloServer({
    debug: true,
    csrfPrevention: true,
    cache: "bounded",
    introspection: true,
    ...options,
    // @ts-ignore
    schema: schema,
    plugins: options.apolloPlugins,
  });

  return server;
};
