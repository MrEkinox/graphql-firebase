import {
  objectType as nexusObjectType,
  enumType as nexusEnumType,
  scalarType as nexusScalarType,
  NexusEnumTypeConfig,
  NexusObjectTypeConfig,
  NexusScalarTypeConfig,
  makeSchema as NexusMakeSchema,
  SchemaConfig,
  fieldAuthorizePlugin,
  declarativeWrappingPlugin,
  connectionPlugin,
} from "nexus/dist/core";
import * as Scalars from "./scalars";
import {
  getCollectionInput,
  getCreateInput,
  getObjectUpdateInput,
  getReferenceInput,
  getReferenceListInput,
  createDefaultWhereInputs,
  getFieldWhereInput,
  getWhereInput,
} from "./inputs";
import * as fileInput from "./file";
import {
  getCreateMutation,
  getDeleteMutation,
  getUpdateMutation,
} from "./mutations";
import { getAllQuery, getQuery } from "./queries";
import { getDefinitionFields, getParentIdLabel } from "./utils";
import { GraphQLFirebasePlugin, LogTimePlugin } from "./plugin";

export { GraphQLFirebasePlugin } from "./plugin";

export const enumType = (options: NexusEnumTypeConfig<string>) => {
  const type = nexusEnumType(options);
  const whereInput = getFieldWhereInput(type.name);

  return [type, whereInput];
};

export const scalarType = (options: NexusScalarTypeConfig<string>) => {
  const type = nexusScalarType(options);
  const whereInput = getFieldWhereInput(type.name);

  return [type, whereInput];
};

export const objectType = (options: NexusObjectTypeConfig<string>) => {
  const type = nexusObjectType(options);
  const whereInput = getWhereInput(options);
  const createInput = getCreateInput(options);
  const updateInput = getObjectUpdateInput(options);

  return [type, whereInput, createInput, updateInput];
};

export interface FirestoreTypeOptions extends NexusObjectTypeConfig<string> {
  parents?: string[];
}

export const firestoreType = (options: FirestoreTypeOptions) => {
  const parentIds = getParentIdLabel(options.parents);
  const fields = getDefinitionFields(options.definition);

  const parents = [...(options.parents || []), options.name];

  const type = nexusObjectType({
    ...options,
    definition: (t) => {
      parentIds?.forEach((parentId) => t.id(parentId, { required: true }));
      t.id("id", { required: true });
      t.field("createdAt", { type: "Date", required: true });
      t.field("updatedAt", { type: "Date", required: true });
      options.definition(t);
      fields.forEach((field) => {
        const type = field.target || field.type;
        if (field.type === "Collection" && field.target)
          // @ts-ignore
          return t.collection(field.name, { ...field, type, parents });
      });
    },
  });

  const singleQuery = getQuery(options);
  const allQuery = getAllQuery(options);
  const whereInput = getWhereInput(type.value);
  const deleteMutation = getDeleteMutation(options);
  const createMutation = getCreateMutation(options);
  const updateMutation = getUpdateMutation(options);
  const relationInput = getReferenceInput(options.name);
  const pointerInput = getReferenceListInput(options.name);
  const collectionInput = getCollectionInput(options.name);

  return [
    type,
    deleteMutation,
    whereInput,
    allQuery,
    singleQuery,
    updateMutation,
    createMutation,
    relationInput,
    pointerInput,
    collectionInput,
  ];
};

export const makeSchema = (config: SchemaConfig & { debug?: boolean }) => {
  const defaultWhere = createDefaultWhereInputs();

  return NexusMakeSchema({
    ...config,
    types: [...config.types, defaultWhere, Scalars, fileInput],
    plugins: [
      ...(config.plugins || []),
      fieldAuthorizePlugin(),
      declarativeWrappingPlugin(),
      GraphQLFirebasePlugin(),
      connectionPlugin({
        includeNodesField: false,
        disableBackwardPagination: true,
        disableForwardPagination: true,
        validateArgs: () => {},
        extendConnection: {
          count: { type: "Int", requireResolver: false },
        },
        getConnectionName: (fieldName) => `${fieldName}Collection`,
      }),
      LogTimePlugin(config.debug),
    ],
  });
};
